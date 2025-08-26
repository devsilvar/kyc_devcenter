// /api/verify-phone.js
// This file contains the serverless function that acts as a secure backend proxy
// for the Smile ID Phone Number Verification API.

// Import necessary libraries. 
// 'crypto' is a built-in Node.js module, so no installation is needed.
const crypto:any = require('crypto');
const axios:any = require('axios'); // You will need to install axios on your backend: `npm install axios`

// The core function that Vercel will execute.
// It uses the standard Node.js request (req) and response (res) objects.
module.exports = async (req, res) => {
  // IMPORTANT:
  // Your API keys and Partner ID must be stored as environment variables on Vercel.
  console.log('--- Function Invoked ---');
  console.log('SMILE_ID_PARTNER_ID:', process.env.SMILE_ID_PARTNER_ID ? 'Exists' : 'NOT FOUND');
  console.log('SMILE_ID_AUTH_TOKEN:', process.env.SMILE_ID_AUTH_TOKEN ? 'Exists' : 'NOT FOUND');
  // DO NOT hardcode them in your code.
  const PARTNER_ID:any = process.env.SMILE_ID_PARTNER_ID;
  const AUTH_TOKEN:any = process.env.SMILE_ID_AUTH_TOKEN;

  // ------------------------------------
  // 1. Validate the incoming request from your frontend
  // ------------------------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneNumber, firstName, lastName } = req.body;
  if (!phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields: phoneNumber, firstName, lastName' });
  }

  // ------------------------------------
  // 2. Generate the dynamic signature and timestamp
  // This is the most crucial security step.
  // We use the auth_token as the secret key.
  // ------------------------------------
  const timestamp = new Date().toISOString();
  const signatureString = `${timestamp}${PARTNER_ID}sid_request`;
  const signature = crypto
    .createHmac('sha256', Buffer.from(AUTH_TOKEN, 'base64'))
    .update(signatureString, 'utf8')
    .digest('base64');
    
  // ------------------------------------
  // 3. Prepare the request to the Smile ID API
  // ------------------------------------
  // The authentication details (Partner ID, signature, timestamp) now go in the headers.
  const smileIDApiUrl = 'https://testapi.smileidentity.com/v2/verify-phone-number'; // Use the synchronous endpoint
  
  const smileIDRequestBody = {
    // These are the customer-specific details for verification
    country: "NG", // Example country, but you can pass this from the frontend if needed
    phone_number: phoneNumber,
    match_fields: {
      first_name: firstName,
      last_name: lastName,
    },
    partner_params: {
      job_id: `job-${Date.now()}`,
      user_id: `user-${Date.now()}`
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'smileid-partner-id': PARTNER_ID,
    'smileid-request-signature': signature,
    'smileid-timestamp': timestamp,
    // The following headers are good practice to include
    'smileid-source-sdk': 'rest_api',
    'smileid-source-sdk-version': '1.0.0',
  };

  // ------------------------------------
  // 4. Make the secure API call and handle the response
  // ------------------------------------
  try {
    const response = await axios.post(smileIDApiUrl, smileIDRequestBody, { headers });

    // Return a clean response from Smile ID back to your frontend
    return res.status(200).json(response.data);

  } catch (error) {
    // Log the full error on the backend for debugging
    console.error('Error from Smile ID API:', error.response?.data || error.message);
    
    // Return a generic error message to the frontend to avoid
    // exposing internal details.
    return res.status(error.response?.status || 500).json({
      message: 'Failed to verify phone number. Please try again.',
      details: error.response?.data,
    });
  }
};
