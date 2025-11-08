import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { patientData, medications, type } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    let prompt = '';
    let maxTokens = 300;

    switch (type) {
      case 'reminders':
        prompt = `Generate smart medication reminders for patient ${patientData.name} with medications: ${JSON.stringify(medications)}. Consider timing, food interactions, and adherence tips.`;
        break;
      case 'risk':
        prompt = `Assess risk level for patient: ${JSON.stringify(patientData)}, medications: ${JSON.stringify(medications)}. Return only: low, medium, or high.`;
        maxTokens = 10;
        break;
      case 'insights':
        prompt = `Generate 3 personalized health insights for patient ${patientData.name} with risk level ${patientData.risk_level} and medications: ${JSON.stringify(medications)}. Focus on prevention and wellness.`;
        maxTokens = 400;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are a healthcare AI assistant providing medical guidance.'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    const result = data.choices[0]?.message?.content || '';

    res.status(200).json({ result });
  } catch (error) {
    console.error('AI API error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
}