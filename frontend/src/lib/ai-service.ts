class AIService {
  private apiKey = process.env.OPENAI_API_KEY;
  private baseUrl = 'https://api.openai.com/v1';

  async generateMedicationReminders(medications: any[], patientData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a healthcare AI assistant. Generate personalized medication reminders.'
          }, {
            role: 'user',
            content: `Generate smart reminders for patient ${patientData.name} with medications: ${JSON.stringify(medications)}. Consider timing, food interactions, and adherence tips.`
          }],
          max_tokens: 300
        })
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Take your medications as prescribed.';
    } catch (error) {
      console.error('AI reminder error:', error);
      return 'Remember to take your medications on time.';
    }
  }

  async assessPatientRisk(patientData: any, medications: any[]) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a healthcare AI that assesses patient risk levels. Return only: low, medium, or high.'
          }, {
            role: 'user',
            content: `Assess risk for patient: ${JSON.stringify(patientData)}, medications: ${JSON.stringify(medications)}. Consider missed appointments, medication adherence, and health status.`
          }],
          max_tokens: 10
        })
      });

      const data = await response.json();
      const risk = data.choices?.[0]?.message?.content?.toLowerCase().trim();
      return ['low', 'medium', 'high'].includes(risk) ? risk : 'medium';
    } catch (error) {
      console.error('AI risk assessment error:', error);
      return 'medium';
    }
  }

  async generateHealthInsights(patientData: any, medications: any[]) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a healthcare AI providing personalized health insights and recommendations.'
          }, {
            role: 'user',
            content: `Generate 3 personalized health insights for patient ${patientData.name} with risk level ${patientData.risk_level} and medications: ${JSON.stringify(medications)}. Focus on prevention and wellness.`
          }],
          max_tokens: 400
        })
      });

      const data = await response.json();
      const insights = data.choices?.[0]?.message?.content || '';
      return insights.split('\n').filter((line: string) => line.trim()).slice(0, 3);
    } catch (error) {
      console.error('AI insights error:', error);
      return [
        'Stay hydrated and maintain regular exercise',
        'Follow your medication schedule consistently',
        'Schedule regular check-ups with your healthcare provider'
      ];
    }
  }
  
  async generateFacilityInsights(facilityData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a healthcare operations AI. Generate actionable insights for a primary healthcare center based on the data provided.'
          }, {
            role: 'user',
            content: `Analyze this PHC data: ${JSON.stringify(facilityData)}. Provide 3 key insights to improve patient outreach, service utilization, and appointment adherence. Focus on practical, data-driven recommendations.`
          }],
          max_tokens: 500
        })
      });

      const data = await response.json();
      const insights = data.choices?.[0]?.message?.content || '';
      return insights.split('\n').filter((line: string) => line.trim()).slice(0, 3);
    } catch (error) {
      console.error('AI facility insights error:', error);
      return [
        'Review peak hours to optimize staff allocation',
        'Target patients with high missed appointments for follow-up',
        'Promote underutilized services to the community'
      ];
    }
  }

  async predictMissedVisits(patients: any[]) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'You are a healthcare AI that predicts patient appointment adherence. Analyze patient data and return predictions for missed visits.'
          }, {
            role: 'user',
            content: `Predict which patients are likely to miss their next appointment based on this data: ${JSON.stringify(patients)}. Return a JSON array of patient IDs with risk scores.`
          }],
          max_tokens: 300
        })
      });

      const data = await response.json();
      const predictions = data.choices?.[0]?.message?.content || '[]';
      return JSON.parse(predictions);
    } catch (error) {
      console.error('AI prediction error:', error);
      return [];
    }
  }

}

export default new AIService();