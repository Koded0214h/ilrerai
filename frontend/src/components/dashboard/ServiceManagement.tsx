import { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../lib/api-client';
import socketService from '../../lib/socket';
import { useAppDispatch } from '../../store/hooks';
import { addAlert } from '../../store/slices/alertSlice';

interface Service {
  id: string;
  name: string;
  description: string;
  available: boolean;
  hours: string;
  cost: string;
}

export default function ServiceManagement() {
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Antenatal Care', description: 'Pregnancy checkups and monitoring', available: true, hours: 'Mon-Fri 8AM-4PM', cost: 'Free' },
    { id: '2', name: 'Immunization', description: 'Vaccines for children and adults', available: true, hours: 'Daily 8AM-2PM', cost: 'Free' },
    { id: '3', name: 'Family Planning', description: 'Contraceptives and counseling', available: false, hours: 'Mon-Fri 9AM-3PM', cost: 'Free' },
    { id: '4', name: 'General Consultation', description: 'Medical diagnosis and treatment', available: true, hours: 'Daily 8AM-5PM', cost: '₦500' },
    { id: '5', name: 'Laboratory Tests', description: 'Blood tests and diagnostics', available: false, hours: 'Mon-Fri 7AM-3PM', cost: '₦1000-5000' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socketService.connect();
    socketService.joinRoom('staff-room');
  }, []);

  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, available: !service.available }
        : service
    ));
  };

  const updateServiceDetails = (serviceId: string, field: keyof Service, value: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, [field]: value }
        : service
    ));
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      // Save to backend (mock for now)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Broadcast changes to all patients
      socketService.emitStaffUpdate({
        type: 'services_updated',
        services: services.filter(s => s.available),
        message: 'Available services have been updated'
      });
      
      dispatch(addAlert({
        message: 'Services updated successfully. Patients will see changes immediately.',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addAlert({
        message: 'Failed to update services',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Service Management
        </h2>
        <button
          onClick={saveChanges}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm touch-manipulation"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Real-time sync:</strong> Changes made here will instantly appear on patient apps and USSD menus.
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateServiceDetails(service.id, 'name', e.target.value)}
                  className="text-lg font-semibold text-gray-800 bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                />
                <textarea
                  value={service.description}
                  onChange={(e) => updateServiceDetails(service.id, 'description', e.target.value)}
                  className="w-full text-sm text-gray-600 bg-transparent border-none p-0 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  rows={2}
                />
              </div>
              <button
                onClick={() => toggleService(service.id)}
                className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors touch-manipulation ${
                  service.available
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {service.available ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Visible to Patients
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hidden from Patients
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="text"
                  value={service.hours}
                  onChange={(e) => updateServiceDetails(service.id, 'hours', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mon-Fri 8AM-4PM"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cost</label>
                <input
                  type="text"
                  value={service.cost}
                  onChange={(e) => updateServiceDetails(service.id, 'cost', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Free or ₦500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Patient View Impact:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Only services marked as &quot;Visible to Patients&quot; will appear in patient apps</p>
          <p>• USSD menu (*347*22#) will automatically update with available services</p>
          <p>• Patients get real-time notifications when services change</p>
          <p>• Hours and costs are displayed exactly as entered above</p>
        </div>
      </div>
    </div>
  );
}