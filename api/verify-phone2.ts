// /api/verify-phone.ts
// This file contains the serverless function that acts as a secure backend proxy
// for the Smile ID Phone Number Verification API.

// We are using ES Module syntax (import/export) to be compatible with the
// "type": "module" setting in package.json.
import crypto from 'node:crypto';
import axios from 'axios'; 

// Vercel's serverless function should use a default export for ES Modules.
export default async function (req, res) {
  // IMPORTANT: Log statements to help you debug on Vercel's dashboard.
  // These will show you what values your function is seeing.
  console.log('--- Function Invoked ---');
  console.log('SMILE_ID_PARTNER_ID:', process.env.SMILE_ID_PARTNER_ID ? 'Exists' : 'NOT FOUND');
  console.log('SMILE_ID_AUTH_TOKEN:', process.env.SMILE_ID_AUTH_TOKEN ? 'Exists' : 'NOT FOUND');
  
  const PARTNER_ID = process.env.SMILE_ID_PARTNER_ID;
  const AUTH_TOKEN = process.env.SMILE_ID_AUTH_TOKEN;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneNumber, firstName, lastName } = req.body;
  if (!phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const timestamp = new Date().toISOString();
    const signatureString = `${timestamp}${PARTNER_ID}sid_request`;
    
    // Log the string we are about to hash to check for correctness
    console.log('Signature string to hash:', signatureString);
    
    const signature = crypto
      .createHmac('sha256', Buffer.from(AUTH_TOKEN, 'base64'))
      .update(signatureString, 'utf8')
      .digest('base64');
      
    // Log the generated signature
    console.log('Generated Signature:', signature);

    const smileIDRequestBody = {
      country: "NG", 
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
      'smileid-source-sdk': 'rest_api',
      'smileid-source-sdk-version': '1.0.0',
    };

    const smileIDApiUrl = 'https://testapi.smileidentity.com/v2/verify-phone-number'; 

    const response = await axios.post(smileIDApiUrl, smileIDRequestBody, { headers });
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Final Catch Block Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Failed to verify phone number due to a backend error.',
      details: error.response?.data,
    });
  }
};
