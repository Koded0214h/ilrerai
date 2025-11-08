import { useState } from 'react';
import smsService from '@/lib/sms-service';
import voiceService from '@/lib/voice-service';
import mapsService from '@/lib/maps-service';
import aiService from '@/lib/ai-service';

export default function TestDashboard() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSMS = async () => {
    const message = smsService.generateAppointmentReminder('John Doe', '2024-02-15', '10:00 AM', 'english');
    const sent = await smsService.sendSMS({ phone: '+2348123456789', message, language: 'english' });
    addResult(`SMS Test: ${sent ? 'Success' : 'Failed'} - ${message}`);
  };

  const testVoice = async () => {
    const message = 'Your appointment is tomorrow at 10 AM';
    const called = await voiceService.makeIVRCall('+2348123456789', message, 'english');
    addResult(`Voice Test: ${called ? 'Success' : 'Failed'} - IVR call initiated`);
  };

  const testMaps = async () => {
    const userLocation = { lat: 9.0765, lng: 7.3986 }; // Abuja
    const phcs = await mapsService.getNearbyPHCs(userLocation);
    addResult(`Maps Test: Found ${phcs.length} PHCs near user location`);
  };

  const testAI = async () => {
    const samplePatients = [
      { id: '1', name: 'Test Patient', missedAppointments: 2, visitFrequency: 1, distance: 5, lastVisit: new Date('2024-01-01') }
    ];
    const predictions = await aiService.predictMissedVisits(samplePatients);
    addResult(`AI Test: Generated ${predictions.length} predictions`);
  };

  const testMultiLanguage = () => {
    const languages = ['english', 'pidgin', 'hausa', 'yoruba', 'igbo'];
    languages.forEach(lang => {
      const tip = smsService.generateHealthTip(lang);
      addResult(`${lang.toUpperCase()}: ${tip}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Dashboard</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button onClick={testSMS} className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            Test SMS
          </button>
          <button onClick={testVoice} className="p-4 bg-green-500 text-white rounded hover:bg-green-600">
            Test Voice
          </button>
          <button onClick={testMaps} className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600">
            Test Maps
          </button>
          <button onClick={testAI} className="p-4 bg-red-500 text-white rounded hover:bg-red-600">
            Test AI
          </button>
          <button onClick={testMultiLanguage} className="p-4 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Test Languages
          </button>
          <button onClick={() => setResults([])} className="p-4 bg-gray-500 text-white rounded hover:bg-gray-600">
            Clear Results
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}