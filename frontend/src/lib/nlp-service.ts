import aiService from './ai-service';

interface NLPResult {
  intent: string;
  entities: Record<string, string>;
  confidence: number;
}

class NLPService {
  async processMessage(message: string, language: 'english' | 'pidgin' = 'english'): Promise<NLPResult> {
    const prompt = `Analyze this ${language} healthcare message and extract intent and entities. Return JSON with intent, entities, confidence:
Message: "${message}"
Common intents: appointment_request, symptom_report, medication_inquiry, emergency`;

    try {
      const response = await fetch('https://gemini-1-5-flash.p.rapidapi.com/', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': 'e2b9507f2bmsh2ab87b5b1a01727p1890dajsn024e36a56f93',
          'x-rapidapi-host': 'gemini-1-5-flash.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gemini-1.5-flash',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      return {
        intent: 'unknown',
        entities: {},
        confidence: 0
      };
    }
  }

  generateResponse(intent: string, entities: Record<string, string>): string {
    switch (intent) {
      case 'appointment_request':
        return 'I can help you schedule an appointment. Please provide your preferred date and time.';
      case 'symptom_report':
        return 'Thank you for reporting your symptoms. A healthcare worker will contact you soon.';
      case 'medication_inquiry':
        return 'For medication questions, please consult with our pharmacist or doctor.';
      case 'emergency':
        return 'This appears to be an emergency. Please contact emergency services immediately or visit the nearest hospital.';
      default:
        return 'Thank you for your message. How can we assist you with your healthcare needs?';
    }
  }
}

export default new NLPService();
export type { NLPResult };