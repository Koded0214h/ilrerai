import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import aiService from '@/lib/ai-service';

export default function InsightsDashboard() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { totalPatients, highRiskCount, adherenceRate } = useAppSelector(
    (state) => state.patients
  );
  const { services, drugStock } = useAppSelector((state) => state.facility);

  const generateInsights = async () => {
    setLoading(true);
    const facilityData = {
      totalPatients,
      highRiskCount,
      adherenceRate,
      activeServices: services.length,
      lowStockDrugs: Object.values(drugStock).filter((qty) => qty <= 20).length,
    };
    const result = await aiService.generateFacilityInsights(facilityData);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">PHC Activity Insights</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="text-2xl font-bold text-blue-600">{totalPatients}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded">
          <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="text-2xl font-bold text-green-600">{adherenceRate}%</div>
          <div className="text-sm text-gray-600">Adherence</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="text-2xl font-bold text-purple-600">{services.length}</div>
          <div className="text-sm text-gray-600">Services</div>
        </div>
      </div>

      <button 
        onClick={generateInsights}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate AI Insights'}
      </button>

      {insights.length > 0 && (
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-2">AI Analysis:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
