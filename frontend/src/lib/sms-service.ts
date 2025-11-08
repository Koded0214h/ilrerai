interface SMSMessage {
  phone: string;
  message: string;
  language: 'english' | 'pidgin' | 'hausa' | 'yoruba' | 'igbo';
}

interface VoiceMessage {
  phone: string;
  audioUrl: string;
  language: string;
}

class SMSService {
  async sendSMS(data: SMSMessage): Promise<boolean> {
    try {
      // Simulate SMS API call
      console.log(`SMS to ${data.phone}: ${data.message}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendVoiceMessage(data: VoiceMessage): Promise<boolean> {
    try {
      // Simulate Voice API call
      console.log(`Voice call to ${data.phone}: ${data.audioUrl}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  generateAppointmentReminder(patientName: string, date: string, time: string, language: string): string {
    const messages = {
      english: `Hello ${patientName}, reminder: Your appointment is on ${date} at ${time}. Please arrive 15 minutes early.`,
      pidgin: `Hello ${patientName}, make you no forget say your appointment na ${date} for ${time}. Come 15 minutes early.`,
      hausa: `Sannu ${patientName}, tunawa: Alkawarinku shine ${date} da karfe ${time}. Ku zo minti 15 da wuri.`,
      yoruba: `Bawo ${patientName}, iranti: Adehun yin ni ojo ${date} ni ago ${time}. E wa ni iṣẹju 15 ṣaaju.`,
      igbo: `Ndewo ${patientName}, ncheta: Nleta gi bu ${date} na elekere ${time}. Bia nkeji 15 tupu oge.`
    };
    return messages[language as keyof typeof messages] || messages.english;
  }

  generateVaccinationReminder(patientName: string, vaccine: string, date: string, language: string): string {
    const messages = {
      english: `${patientName}, your ${vaccine} vaccination is due on ${date}. Visit the PHC center.`,
      pidgin: `${patientName}, your ${vaccine} injection suppose happen on ${date}. Go PHC center.`,
      hausa: `${patientName}, allurar ${vaccine} ta kamata a yi ${date}. Ku je cibiyar PHC.`,
      yoruba: `${patientName}, abẹrẹ ${vaccine} yin yẹ ki o ṣe ni ${date}. Lo si ile-iwosan PHC.`,
      igbo: `${patientName}, ogwu mgbochi ${vaccine} gi kwesiri ime na ${date}. Gaa ulo ogwu PHC.`
    };
    return messages[language as keyof typeof messages] || messages.english;
  }

  generateHealthTip(language: string): string {
    const tips = {
      english: "Drink clean water daily, wash hands frequently, and eat balanced meals for good health.",
      pidgin: "Drink clean water everyday, wash your hand well well, chop balanced food for good health.",
      hausa: "Sha ruwa mai tsabta kullum, wanke hannuwa akai-akai, ci abinci mai daidaito don lafiya.",
      yoruba: "Mu omi mimọ lojoojumọ, fọ ọwọ nigbagbogbo, jẹ ounjẹ deede fun ilera to dara.",
      igbo: "Ṅụọ mmiri dị ọcha kwa ụbọchị, saa aka mgbe niile, rie nri kwesịrị ekwesị maka ahụ ike ọma."
    };
    return tips[language as keyof typeof tips] || tips.english;
  }
}

export default new SMSService();
export type { SMSMessage, VoiceMessage };