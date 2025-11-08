import { useState } from 'react';
import smsService, { SMSMessage } from '@/lib/sms-service';
import voiceService from '@/lib/voice-service';

interface Patient {
  id: string;
  name: string;
  phone: string;
  language: string;
  isLiterate: boolean;
  nextAppointment?: string;
  vaccinations?: string[];
}

export default function ReminderSystem() {
  const [patients] = useState<Patient[]>([
    { id: '1', name: 'John Doe', phone: '+2348123456789', language: 'english', isLiterate: true, nextAppointment: '2024-02-15 10:00' },
    { id: '2', name: 'Amina Hassan', phone: '+2348987654321', language: 'hausa', isLiterate: false, vaccinations: ['COVID-19'] }
  ]);
  
  const [sending, setSending] = useState(false);

  const sendAppointmentReminders = async () => {
    setSending(true);
    
    for (const patient of patients.filter(p => p.nextAppointment)) {
      const [date, time] = patient.nextAppointment!.split(' ');
      const message = smsService.generateAppointmentReminder(patient.name, date, time, patient.language);
      
      if (patient.isLiterate) {
        await smsService.sendSMS({ phone: patient.phone, message, language: patient.language as any });
      } else {
        await voiceService.makeIVRCall(patient.phone, message, patient.language);
      }
    }
    
    setSending(false);
  };

  const sendVaccinationReminders = async () => {
    setSending(true);
    
    for (const patient of patients.filter(p => p.vaccinations?.length)) {
      const vaccine = patient.vaccinations![0];
      const message = smsService.generateVaccinationReminder(patient.name, vaccine, '2024-02-20', patient.language);
      
      if (patient.isLiterate) {
        await smsService.sendSMS({ phone: patient.phone, message, language: patient.language as any });
      } else {
        await voiceService.makeIVRCall(patient.phone, message, patient.language);
      }
    }
    
    setSending(false);
  };

  const sendHealthTips = async () => {
    setSending(true);
    
    for (const patient of patients) {
      const tip = smsService.generateHealthTip(patient.language);
      
      if (patient.isLiterate) {
        await smsService.sendSMS({ phone: patient.phone, message: tip, language: patient.language as any });
      } else {
        await voiceService.makeIVRCall(patient.phone, tip, patient.language);
      }
    }
    
    setSending(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">SMS & Voice Reminders</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button 
          onClick={sendAppointmentReminders}
          disabled={sending}
          className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send Appointment Reminders
        </button>
        
        <button 
          onClick={sendVaccinationReminders}
          disabled={sending}
          className="p-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Send Vaccination Reminders
        </button>
        
        <button 
          onClick={sendHealthTips}
          disabled={sending}
          className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Send Health Tips
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Patients</h3>
        {patients.map(patient => (
          <div key={patient.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <span className="font-medium">{patient.name}</span>
              <span className="ml-2 text-sm text-gray-600">({patient.language})</span>
              <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100">
                {patient.isLiterate ? 'SMS' : 'Voice'}
              </span>
            </div>
            <span className="text-sm text-gray-500">{patient.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}