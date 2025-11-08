import { useState, useEffect } from 'react';
import { useRealtime } from '@/hooks/useRealtime';
import aiService from '@/lib/ai-service';

// Define types locally for now
interface Patient {
  id: string;
  name: string;
  risk_level: string;
  next_appointment: string;
  // Add other patient properties as needed
}

interface PredictionResult {
  patientId: string;
  riskScore: number;
  recommendation: string;
}

export default function PredictiveReminders() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const { connected } = useRealtime();

  useEffect(() => {
    loadPatients();
    const handlePatientUpdate = () => loadPatients();
    if (typeof window !== 'undefined') {
      window.addEventListener('patient-updated', handlePatientUpdate);
      return () => window.removeEventListener('patient-updated', handlePatientUpdate);
    }
  }, []);

  const loadPatients = async () => {
    try {
      const response = await fetch('/api/patients', {
        headers: { 'x-api-key': 'healthcare-admin-key' }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPatients(data.map((p: any) => ({
        ...p,
        visitFrequency: Math.random() * 3,
        distance: Math.random() * 20 + 5,
        lastVisit: new Date(p.lastVisit)
      })));
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const analyzePredictions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patients })
      });
      const results = await response.json();
      setPredictions(results);
    } catch (error) {
      console.error('Prediction failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Predictive Reminders</h2>
      
      <button 
        onClick={analyzePredictions}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Risk'}
      </button>

      <div className="space-y-3">
        {predictions.map(pred => (
          <div key={pred.patientId} className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">Patient {pred.patientId}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                pred.riskScore > 70 ? 'bg-red-100 text-red-800' :
                pred.riskScore > 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Risk: {pred.riskScore}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{pred.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
