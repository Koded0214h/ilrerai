import { useState } from 'react';
import aiService from '@/lib/ai-service';

export default function InsightsDashboard() {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sampleData = {
    totalVisits: 150,
    missedAppointments: 25,
    averageDistance: 8.5,
    peakHours: ['9AM-11AM', '2PM-4PM'],
    commonServices: ['Vaccination', 'Consultation', 'Health Screening']
  };

  const generateInsights = async () => {
    setLoading(true);
    const result = await aiService.generateInsights(sampleData);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">PHC Activity Insights</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{sampleData.totalVisits}</div>
          <div className="text-sm text-gray-600">Total Visits</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded">
          <div className="text-2xl font-bold text-red-600">{sampleData.missedAppointments}</div>
          <div className="text-sm text-gray-600">Missed</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">{sampleData.averageDistance}km</div>
          <div className="text-sm text-gray-600">Avg Distance</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-600">{sampleData.peakHours.length}</div>
          <div className="text-sm text-gray-600">Peak Hours</div>
        </div>
      </div>

      <button 
        onClick={generateInsights}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate AI Insights'}
      </button>

      {insights && (
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-2">AI Analysis:</h3>
          <p className="text-sm whitespace-pre-wrap">{insights}</p>
        </div>
      )}
    </div>
  );
}