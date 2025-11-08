import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import socketService from '../../lib/socket';
import { Activity, Users, Wifi, WifiOff } from 'lucide-react';

export default function RealTimeSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [activePatients, setActivePatients] = useState<string[]>([]);
  const { patients } = useAppSelector(state => state.patients);

  useEffect(() => {
    // Monitor connection status
    const checkConnection = () => {
      setIsConnected(socketService.isConnected());
    };

    const interval = setInterval(checkConnection, 1000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  const getActivePatientNames = () => {
    return patients
      .filter(p => activePatients.includes(p.id))
      .map(p => p.name)
      .slice(0, 5); // Show max 5 names
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Real-Time Sync
        </h3>
        <div className="flex items-center">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className={`ml-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700">Active Patients</span>
          </div>
          <span className="text-sm font-medium text-gray-800">
            {activePatients.length}
          </span>
        </div>

        {activePatients.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Currently Active:</p>
            <div className="text-sm text-blue-800">
              {getActivePatientNames().join(', ')}
              {activePatients.length > 5 && ` +${activePatients.length - 5} more`}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          {isConnected 
            ? 'Patient changes sync in real-time' 
            : 'Reconnecting to sync service...'
          }
        </div>
      </div>
    </div>
  );
}
