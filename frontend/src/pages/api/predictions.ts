import type { NextApiRequest, NextApiResponse } from 'next';
import aiService from '@/lib/ai-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { patients } = req.body;
      const predictions = await aiService.predictMissedVisits(patients);
      res.status(200).json(predictions);
    } catch (error) {
      res.status(500).json({ error: 'Prediction failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}