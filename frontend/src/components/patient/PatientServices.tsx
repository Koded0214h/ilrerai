import { useState, useEffect } from 'react';
import { Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';
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

export default function PatientServices() {
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to real-time updates
    socketService.connect();
    
    // Listen for service updates from staff
    socketService.onStaffDataUpdated((data) => {
      if (data.type === 'services_updated') {
        setServices(data.services);
        dispatch(addAlert({
          message: 'Available services have been updated',
          type: 'info'
        }));
      }
    });

    // Load initial services
    loadServices();
  }, [dispatch]);

  const loadServices = async () => {
    try {
      // Mock API call - in real app, fetch from backend
      const mockServices = [
        { id: '1', name: 'Antenatal Care', description: 'Pregnancy checkups and monitoring', available: true, hours: 'Mon-Fri 8AM-4PM', cost: 'Free' },
        { id: '2', name: 'Immunization', description: 'Vaccines for children and adults', available: true, hours: 'Daily 8AM-2PM', cost: 'Free' },
        { id: '4', name: 'General Consultation', description: 'Medical diagnosis and treatment', available: true, hours: 'Daily 8AM-5PM', cost: '₦500' },
      ];
      setServices(mockServices);
    } catch (error) {
      dispatch(addAlert({
        message: 'Failed to load services',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="text-gray-500">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Available Services</h2>
      
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-700">{service.hours}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">{service.cost}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                {service.available ? (
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </div>
                ) : (
                  <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No services available at this time
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Live Updates:</strong> This list updates automatically when staff make changes to available services.
        </p>
      </div>
    </div>
  );
}