// /api/phone-callback.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const data = req.body;

  console.log('Smile Identity callback:', data);

  // TODO: Save this verification status to your database
  // e.g., mark the user's phone as verified

  res.status(200).json({ received: true });
}
