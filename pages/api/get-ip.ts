import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const clientIp = requestIp.getClientIp(req);
    res.status(200).json({ ip: clientIp });
  } catch (error) {
    console.error('Error fetching client IP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
