import { useState, useEffect } from 'react';
import phcDataService, { PHCData } from '@/lib/phc-data-service';

export default function PHCDataDashboard() {
  const [selectedState, setSelectedState] = useState('anambra');
  const [phcData, setPHCData] = useState<PHCData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const states = ['anambra', 'abia', 'taraba', 'sokoto', 'cross-river'];

  const loadPHCData = async () => {
    setLoading(true);
    const data = await phcDataService.fetchPHCData(selectedState);
    const stateStats = await phcDataService.getStateStats(selectedState);
    setPHCData(data);
    setStats(stateStats);
    setLoading(false);
  };

  useEffect(() => {
    loadPHCData();
  }, [selectedState]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">PHC Data Dashboard</h2>
      
      <select 
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {states.map(state => (
          <option key={state} value={state}>
            {state.charAt(0).toUpperCase() + state.slice(1)} State
          </option>
        ))}
      </select>

      {loading && <p className="text-gray-500">Loading PHC data...</p>}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.totalPHCs}</div>
            <div className="text-sm text-gray-600">Total PHCs</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.totalBeds}</div>
            <div className="text-sm text-gray-600">Total Beds</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStaff}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.keys(stats.powerSources).length}
            </div>
            <div className="text-sm text-gray-600">Power Sources</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {phcData.map((phc, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{phc.name}</h3>
              <span className={`px-2 py-1 text-xs rounded ${
                phc.buildingCondition === 'Good' ? 'bg-green-100 text-green-800' :
                phc.buildingCondition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {phc.buildingCondition}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Beds:</span> {phc.beds}
              </div>
              <div>
                <span className="font-medium">Wards:</span> {phc.wards}
              </div>
              <div>
                <span className="font-medium">Staff:</span> {phc.staffCount}
              </div>
              <div>
                <span className="font-medium">Power:</span> {phc.powerSource}
              </div>
            </div>
            
            <div className="mt-2">
              <span className="font-medium text-sm">Services:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {phc.services.map(service => (
                  <span key={service} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}