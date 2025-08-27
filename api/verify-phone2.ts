// /api/verify-phone.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('--- Function Invoked ---');
  console.log('SMILE_ID_PARTNER_ID:', process.env.SMILE_ID_PARTNER_ID ? 'Exists' : 'NOT FOUND');
  console.log('SMILE_ID_AUTH_TOKEN:', process.env.SMILE_ID_AUTH_TOKEN ? 'Exists' : 'NOT FOUND');
  const PARTNER_ID = process.env.SMILE_ID_PARTNER_ID;
  const AUTH_TOKEN = process.env.SMILE_ID_AUTH_TOKEN;

  if (!PARTNER_ID || !AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server misconfigured: Missing Smile ID credentials' });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneNumber, firstName, lastName } = req.body || {};
  if (!phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields: phoneNumber, firstName, lastName' });
  }

  // 1. Generate signature
  const timestamp = new Date().toISOString();
  const signatureString = `${timestamp}${PARTNER_ID}sid_request`;
  const signature = crypto
    .createHmac('sha256', Buffer.from(AUTH_TOKEN, 'base64'))
    .update(signatureString, 'utf8')
    .digest('base64');

  // 2. SmileID request
  const smileIDApiUrl = 'https://testapi.smileidentity.com/v2/verify-phone-number';
  const smileIDRequestBody = {
    country: 'NG',
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

  const headers = {
    'Content-Type': 'application/json',
    'smileid-partner-id': PARTNER_ID,
    'smileid-request-signature': signature,
    'smileid-timestamp': timestamp,
    'smileid-source-sdk': 'rest_api',
    'smileid-source-sdk-version': '1.0.0',
  };

  try {
    const response = await axios.post(smileIDApiUrl, smileIDRequestBody, { headers });
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error from Smile ID API:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Failed to verify phone number. Please try again.',
      details: error.response?.data,
    });
  }
}
