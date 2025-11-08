import { useState, useEffect } from 'react';
import { Brain, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import aiService from '../../lib/ai-service';

interface AIInsightsProps {
  patientData: any;
  medications: any[];
}

export default function AIInsights({ patientData, medications }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [reminder, setReminder] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<string>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateAIContent();
  }, [patientData, medications]);

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const [aiInsights, aiReminder, aiRisk] = await Promise.all([
        aiService.generateHealthInsights(patientData, medications),
        aiService.generateMedicationReminders(medications, patientData),
        aiService.assessPatientRisk(patientData, medications)
      ]);

      setInsights(aiInsights);
      setReminder(aiReminder);
      setRiskLevel(aiRisk);
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Risk Assessment */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          AI Risk Assessment
        </h3>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            riskLevel === 'high' ? 'bg-red-100 text-red-800' :
            riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {riskLevel.toUpperCase()} RISK
          </span>
          {loading && <span className="ml-2 text-sm text-gray-500">Analyzing...</span>}
        </div>
      </div>

      {/* Smart Medication Reminder */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Smart Reminder
        </h3>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">
            {loading ? 'Generating personalized reminder...' : reminder}
          </p>
        </div>
      </div>

      {/* Health Insights */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI Health Insights
        </h3>
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Generating insights...</p>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}