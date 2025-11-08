const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendSMS(to, message, language = 'english') {
    try {
      // Translate message if needed
      const translatedMessage = this.translateMessage(message, language);
      
      // Mock SMS for development
      if (!process.env.TWILIO_ACCOUNT_SID) {
        console.log(`📱 SMS sent to ${to}`);
        console.log(`📄 SMS CONTENT: ${translatedMessage}`);
        console.log(`\n===========================================\n`);
        return { success: true, sid: 'mock_' + Date.now() };
      }
      
      const result = await this.client.messages.create({
        body: translatedMessage,
        from: this.fromNumber,
        to: to
      });

      console.log(`📱 SMS sent to ${to}: ${translatedMessage}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationSMS(phone, code) {
    const message = `Your IlerAI verification code is: ${code}. Enter this code to complete registration. Code expires in 10 minutes.`;
    return this.sendSMS(phone, message);
  }

  async sendAppointmentReminder(patient) {
    const message = `Hello ${patient.name}, this is a reminder for your appointment at ${patient.phc_name} tomorrow. Please arrive 15 minutes early. Reply STOP to opt out.`;
    return this.sendSMS(patient.phone, message, patient.language);
  }

  async sendMedicationReminder(patient, medication) {
    const message = `Hi ${patient.name}, time to take your ${medication.name} (${medication.dosage}). Take with ${medication.instructions || 'water'}. Stay healthy!`;
    return this.sendSMS(patient.phone, message, patient.language);
  }

  async sendHealthTip(patient, tip) {
    const message = `Health Tip for ${patient.name}: ${tip}. Stay healthy with IlerAI PHC!`;
    return this.sendSMS(patient.phone, message, patient.language);
  }

  translateMessage(message, language) {
    // Basic translation for Nigerian languages
    const translations = {
      'hausa': {
        'Hello': 'Sannu',
        'appointment': 'alƙawari',
        'tomorrow': 'gobe',
        'time to take': 'lokacin shan',
        'Stay healthy': 'Ku kasance da lafiya'
      },
      'yoruba': {
        'Hello': 'Bawo',
        'appointment': 'ipade',
        'tomorrow': 'ola',
        'time to take': 'akoko lati mu',
        'Stay healthy': 'Duro ni ilera'
      },
      'igbo': {
        'Hello': 'Ndewo',
        'appointment': 'nhazi',
        'tomorrow': 'echi',
        'time to take': 'oge iri',
        'Stay healthy': 'Nọrọ na ahụ ike'
      }
    };

    if (language === 'english' || !translations[language]) {
      return message;
    }

    let translated = message;
    Object.entries(translations[language]).forEach(([english, local]) => {
      translated = translated.replace(new RegExp(english, 'gi'), local);
    });

    return translated;
  }
}

module.exports = new SMSService();