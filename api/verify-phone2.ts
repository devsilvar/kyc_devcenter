// /api/verify-phone.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const PARTNER_ID = process.env.SMILE_ID_PARTNER_ID;
  const AUTH_TOKEN = process.env.SMILE_ID_AUTH_TOKEN;

  if (!PARTNER_ID || !AUTH_TOKEN) {
    return res.status(500).json({ message: 'Missing SmileID credentials in environment variables' });
  }

  const { phoneNumber, firstName, lastName } = req.body;
  if (!phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields: phoneNumber, firstName, lastName' });
  }

  try {
    // Step 1: Generate signature
    const timestamp = new Date().toISOString();
    const signatureString = `${timestamp}${PARTNER_ID}sid_request`;

    const signature = crypto
      .createHmac('sha256', AUTH_TOKEN) // 🔥 use raw AUTH_TOKEN
      .update(signatureString, 'utf8')
      .digest('base64');

    // Step 2: Prepare request body
    const smileIDRequestBody = {
      country: "NG",
      phone_number: phoneNumber,
      match_fields: {
        first_name: firstName,
        last_name: lastName,
      },
      partner_params: {
        job_id: `job-${Date.now()}`,
        user_id: `user-${Date.now()}`,
      },
    };

    // Step 3: Headers
    const headers = {
      'Content-Type': 'application/json',
      'smileid-partner-id': PARTNER_ID,
      'smileid-request-signature': signature,
      'smileid-timestamp': timestamp,
      'smileid-source-sdk': 'rest_api',
      'smileid-source-sdk-version': '1.0.0',
    };

    // Step 4: Make request
    const smileIDApiUrl = 'https://testapi.smileidentity.com/v2/verify-phone-number';
    const { data } = await axios.post(smileIDApiUrl, smileIDRequestBody, { headers });

    // Step 5: Respond
    return res.status(200).json({
      status: 'success',
      verification: data,
    });

  } catch (error: any) {
    console.error('Verification Error:', error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Failed to verify phone number',
      details: error.response?.data || error.message,
    });
  }
}
