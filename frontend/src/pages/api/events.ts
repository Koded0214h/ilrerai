import type { NextApiRequest, NextApiResponse } from 'next';
import realtime from '@/lib/realtime';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  realtime.addClient(res);
  res.write('data: {"event":"connected"}\n\n');
}