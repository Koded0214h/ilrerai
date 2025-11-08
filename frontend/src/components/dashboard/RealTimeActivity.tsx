import { useState, useEffect } from 'react';
import { Activity, Users, Clock, Wifi } from 'lucide-react';
import socketService from '../../lib/socket';

interface ActivityLog {
  id: string;
  patientName: string;
  patientId: string;
  activity: string;
  timestamp: string;
}

export default function RealTimeActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activePatients, setActivePatients] = useState(new Set<string>());

  useEffect(() => {
    // Connect to real-time sync
    socketService.connect();
    socketService.joinRoom('staff-room');
    
    setIsConnected(socketService.isConnected());

    // Listen for patient activities
    socketService.onPatientDataUpdated((data) => {
      if (data.type === 'patient_active') {
        const newActivity: ActivityLog = {
          id: Date.now().toString(),
          patientName: data.patientName,
          patientId: data.patientId,
          activity: getActivityDescription(data.activity),
          timestamp: data.timestamp
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
        setActivePatients(prev => new Set(prev).add(data.patientId));

        // Remove from active after 5 minutes
        setTimeout(() => {
          setActivePatients(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.patientId);
            return newSet;
          });
        }, 5 * 60 * 1000);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const getActivityDescription = (activity: string) => {
    const descriptions: Record<string, string> = {
      'dashboard_view': 'Viewing dashboard',
      'appointment_check': 'Checking appointments',
      'medication_view': 'Viewing medications',
      'phc_search': 'Searching for PHCs',
      'map_view': 'Using map feature'
    };
    return descriptions[activity] || 'Active on app';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Real-Time Activity
        </h3>
        <div className="flex items-center space-x-2">
          <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Active Patients Count */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">
            {activePatients.size} patients currently active
          </span>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No recent patient activity
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {activity.patientName}
                </p>
                <p className="text-xs text-gray-600">{activity.activity}</p>
              </div>
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(activity.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}