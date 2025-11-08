import { useState } from 'react';
import { MessageSquare, Phone, Send, Users, Brain, Sparkles } from 'lucide-react';
import apiClient from '../../lib/api-client';
import aiService from '../../lib/ai-service';
import { useAppDispatch } from '../../store/hooks';
import { addAlert } from '../../store/slices/alertSlice';

export default function NotificationCenter() {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'sms' | 'voice'>('sms');
  const [type, setType] = useState('custom');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const generateAIMessage = async () => {
    setAiGenerating(true);
    try {
      const aiMessage = await aiService.generateMedicationReminders(
        [{ name: 'medication', dosage: '500mg' }],
        { name: 'Patient', language }
      );
      setMessage(aiMessage);
    } catch (error) {
      dispatch(addAlert({ message: 'AI generation failed', type: 'error' }));
    } finally {
      setAiGenerating(false);
    }
  };

  const sendNotification = async (patientId?: string) => {
    if (!message.trim()) {
      dispatch(addAlert({ message: 'Please enter a message', type: 'error' }));
      return;
    }

    setLoading(true);
    try {
      const endpoint = patientId 
        ? `/api/notifications/send-${method}`
        : '/api/notifications/bulk-send';
      
      const payload = patientId 
        ? { patientId, message, type }
        : { message, type, method, language };

      await apiClient.post(endpoint, payload);
      
      dispatch(addAlert({
        message: `${method.toUpperCase()} ${patientId ? 'sent' : 'broadcast sent'} successfully!`,
        type: 'success'
      }));
      
      setMessage('');
    } catch (error) {
      dispatch(addAlert({
        message: `Failed to send ${method}`,
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const quickMessages = {
    appointment: 'Reminder: You have an appointment tomorrow. Please arrive 15 minutes early.',
    medication: 'Time to take your medication. Follow the prescribed dosage.',
    'health-tip': 'Health Tip: Drink plenty of water and maintain regular exercise for better health.'
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">SMS & Voice Center</h2>
      
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Send Notification */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Send Notification
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => setMethod('sms')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  method === 'sms' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                SMS
              </button>
              <button
                onClick={() => setMethod('voice')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  method === 'voice' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Phone className="w-5 h-5 mx-auto mb-1" />
                Voice Call
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (quickMessages[e.target.value as keyof typeof quickMessages]) {
                    setMessage(quickMessages[e.target.value as keyof typeof quickMessages]);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="custom">Custom Message</option>
                <option value="appointment">Appointment Reminder</option>
                <option value="medication">Medication Reminder</option>
                <option value="health-tip">Health Tip</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="hausa">Hausa</option>
                <option value="yoruba">Yoruba</option>
                <option value="igbo">Igbo</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <button
                  onClick={generateAIMessage}
                  disabled={aiGenerating}
                  className="flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50 touch-manipulation"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  {aiGenerating ? 'AI...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter your message or use AI Generate..."
              />
            </div>

            <button
              onClick={() => sendNotification()}
              disabled={loading || !message.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center text-sm sm:text-base touch-manipulation min-h-[44px]"
            >
              <Users className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : `Broadcast ${method.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setType('appointment');
                setMessage(quickMessages.appointment);
                sendNotification();
              }}
              className="w-full p-3 sm:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation min-h-[60px]"
            >
              <div className="font-medium text-gray-800 text-sm sm:text-base">Send Appointment Reminders</div>
              <div className="text-xs sm:text-sm text-gray-600">Notify all patients with upcoming appointments</div>
            </button>

            <button
              onClick={() => {
                setType('medication');
                setMessage(quickMessages.medication);
                sendNotification();
              }}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-800">Medication Reminders</div>
              <div className="text-sm text-gray-600">Send medication adherence reminders</div>
            </button>

            <button
              onClick={() => {
                setType('health-tip');
                setMessage(quickMessages['health-tip']);
                sendNotification();
              }}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-800">Health Tips</div>
              <div className="text-sm text-gray-600">Share wellness tips with patients</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}