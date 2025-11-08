const twilio = require('twilio');

class VoiceService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async makeVoiceCall(to, message, language = 'english') {
    try {
      const twimlUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/voice/twiml?message=${encodeURIComponent(message)}&language=${language}`;
      
      const call = await this.client.calls.create({
        url: twimlUrl,
        to: to,
        from: this.fromNumber
      });

      console.log(`📞 Voice call initiated to ${to}: ${message}`);
      return { success: true, sid: call.sid };
    } catch (error) {
      console.error('Voice Call Error:', error);
      return { success: false, error: error.message };
    }
  }

  async callAppointmentReminder(patient) {
    const message = `Hello ${patient.name}. This is a reminder for your appointment at ${patient.phc_name} tomorrow. Please arrive 15 minutes early.`;
    return this.makeVoiceCall(patient.phone, message, patient.language);
  }

  async callMedicationReminder(patient, medication) {
    const message = `Hello ${patient.name}. This is a reminder to take your ${medication.name}, ${medication.dosage}. Take it with ${medication.instructions || 'water'}.`;
    return this.makeVoiceCall(patient.phone, message, patient.language);
  }

  generateTwiML(message, language = 'english') {
    const voice = this.getVoiceForLanguage(language);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="${voice}" language="${this.getLanguageCode(language)}">${message}</Say>
      <Pause length="1"/>
      <Say voice="${voice}">Press any key to repeat this message.</Say>
      <Gather numDigits="1" timeout="10">
        <Say voice="${voice}">${message}</Say>
      </Gather>
    </Response>`;
  }

  getVoiceForLanguage(language) {
    const voices = {
      'english': 'alice',
      'hausa': 'alice',
      'yoruba': 'alice',
      'igbo': 'alice'
    };
    return voices[language] || 'alice';
  }

  getLanguageCode(language) {
    const codes = {
      'english': 'en-US',
      'hausa': 'en-US', // Fallback to English
      'yoruba': 'en-US', // Fallback to English
      'igbo': 'en-US'    // Fallback to English
    };
    return codes[language] || 'en-US';
  }
}

module.exports = new VoiceService();