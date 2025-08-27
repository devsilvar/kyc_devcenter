// api/index.js
// This is your Node.js server using Express.js
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

// Main entry point for the React app
// This is a simple route to confirm the server is working
app.get('/', (req, res) => {
  res.send('<h1>This is the API server.</h1>');
});

// Your backend endpoint for phone number verification
app.post('/verify-phone', async (req, res) => {
  console.log('--- Vercel Function Invoked ---');
  console.log('SMILE_ID_PARTNER_ID:', process.env.SMILE_ID_PARTNER_ID ? 'Exists' : 'NOT FOUND');
  console.log('SMILE_ID_AUTH_TOKEN:', process.env.SMILE_ID_AUTH_TOKEN ? 'Exists' : 'NOT FOUND');

  const PARTNER_ID = process.env.SMILE_ID_PARTNER_ID;
  const AUTH_TOKEN = process.env.SMILE_ID_AUTH_TOKEN;

  if (!PARTNER_ID || !AUTH_TOKEN) {
    console.error('Environment variables for Smile ID are not set!');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  const { phoneNumber, firstName, lastName } = req.body;
  if (!phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const timestamp = new Date().toISOString();
    const signatureString = `${timestamp}${PARTNER_ID}sid_request`;
    
    const signature = crypto
      .createHmac('sha256', Buffer.from(AUTH_TOKEN, 'base64'))
      .update(signatureString, 'utf8')
      .digest('base64');
      
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
    console.error('Error from Smile ID API:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Failed to verify phone number due to a backend error.',
      details: error.response?.data,
    });
  }
});

// We export the app instance for Vercel.
module.exports = app;
