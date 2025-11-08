import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import type { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { fetchPatients } from "../../store/slices/patientSlice";
import syncService from "../../lib/sync-service";
import healthCheck from "../../lib/health-check";


import { MapPin, Calendar, Pill, Activity, LogOut, Phone, Clock, Settings, Heart, Menu, X, Home } from "lucide-react";
import PatientSettings from "./PatientSettings";
import PHCMap from "../maps/PHCMap";
import AIInsights from "../ai/AIInsights";
import { addAlert } from "../../store/slices/alertSlice";

export default function PatientDashboard() {
  const dispatch: AppDispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { patients } = useAppSelector((state: RootState) => state.patients);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPHC, setSelectedPHC] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const patientData = patients.find(p => p.id === user?.id) || {
    id: user?.id || 'patient-123',
    name: user?.name || 'John Doe',
    next_appointment: '2024-01-15T10:00:00',
    risk_level: 'low'
  };
  
  const nearbyPHCs = [
    { id: "1", name: "Central PHC Ikeja", distance: "0.8 km", status: "Open", phone: "+234-801-234-5678", lat: 6.5244, lng: 3.3792 },
    { id: "2", name: "Community Health Center", distance: "1.2 km", status: "Open", phone: "+234-802-345-6789", lat: 6.4474, lng: 3.3903 },
    { id: "3", name: "Primary Care Clinic", distance: "2.1 km", status: "Closed", phone: "+234-803-456-7890", lat: 6.5027, lng: 3.3218 },
  ];

  const medications = [
    { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", remaining: 14 },
    { name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily", remaining: 7 },
  ];

  const activities = [
    { title: "Morning Walk", description: "30 minutes daily", completed: true },
    { title: "Blood Pressure Check", description: "Weekly monitoring", completed: false },
    { title: "Diet Plan", description: "Low sodium intake", completed: true },
  ];

  useEffect(() => {
    getUserLocation();
    
    // Start backend health monitoring
    healthCheck.startHealthCheck((isHealthy) => {
      setBackendStatus(isHealthy ? 'online' : 'offline');
      
      if (isHealthy) {
        // Backend is available - fetch data and start sync
        dispatch(fetchPatients());
        
        if (user?.id) {
          syncService.initialize('patient', user.id);
        }
      }
    });
    
    return () => {
      healthCheck.stopHealthCheck();
      syncService.disconnect();
    };
  }, [user?.id, dispatch]);

  const handleLogout = () => {
    syncService.disconnect();
    dispatch(logout());
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          dispatch(addAlert({
            message: "Unable to get your location. Please enable location services.",
            type: "error"
          }));
        }
      );
    }
  };

  const openDirections = (phc: any) => {
    // Always open directions - use PHC name as destination
    const destination = encodeURIComponent(`${phc.name}, Lagos, Nigeria`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
    
    dispatch(addAlert({
      message: `Opening directions to ${phc.name}`,
      type: "success"
    }));
  };

  const viewOnMap = (phc: any) => {
    setSelectedPHC(phc);
    setActiveSection('map');
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="px-3 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 touch-manipulation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-800">
              {activeSection === 'dashboard' ? 'My Health' : 'Settings'}
            </h1>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <header className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Patient Portal</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm touch-manipulation"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 text-center">
          <Heart className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 md:mb-4 animate-pulse" />
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm md:text-lg lg:text-xl opacity-90">
            Get well soon
          </p>
          
          {/* Backend Status Indicator */}
          <div className="mt-4 flex items-center justify-center">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs ${
              backendStatus === 'online' ? 'bg-green-600 text-white' :
              backendStatus === 'offline' ? 'bg-red-600 text-white' :
              'bg-yellow-600 text-white'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                backendStatus === 'online' ? 'bg-green-300' :
                backendStatus === 'offline' ? 'bg-red-300' :
                'bg-yellow-300 animate-pulse'
              }`}></div>
              {backendStatus === 'online' ? 'Connected' :
               backendStatus === 'offline' ? 'Offline Mode' :
               'Connecting...'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6 lg:py-8 pb-20 md:pb-8">
        {activeSection === 'dashboard' && (
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Next Appointment
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {patientData.next_appointment 
                          ? new Date(patientData.next_appointment).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'No appointment scheduled'
                        }
                      </p>
                      <p className="text-gray-600 text-sm">Central PHC Ikeja</p>
                      <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                      patientData.risk_level === "high" 
                        ? "bg-red-100 text-red-800"
                        : patientData.risk_level === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {patientData.risk_level?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Medications
                </h2>
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">{med.name}</h3>
                        <p className="text-xs text-gray-600">{med.dosage} - {med.frequency}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs font-medium">{med.remaining}d</p>
                        <p className={`text-xs ${med.remaining <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                          {med.remaining <= 7 ? 'Low' : 'OK'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              <AIInsights patientData={patientData} medications={medications} />
              
              <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Nearby PHCs
                </h2>
                <div className="space-y-3">
                  {nearbyPHCs.map((phc) => (
                    <div key={phc.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 text-sm leading-tight flex-1">{phc.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
                          phc.status === "Open" 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {phc.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{phc.distance} away</p>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{phc.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewOnMap(phc)}
                          className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors touch-manipulation"
                        >
                          View Map
                        </button>
                        <button
                          onClick={() => openDirections(phc)}
                          className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors touch-manipulation"
                        >
                          Directions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'settings' && (
          <PatientSettings />
        )}
        
        {activeSection === 'map' && selectedPHC && (
          <PHCMap 
            phc={selectedPHC} 
            userLocation={userLocation}
            onBack={() => setActiveSection('dashboard')}
          />
        )}
        

      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`flex flex-col items-center py-3 px-4 text-xs touch-manipulation ${
              activeSection === 'dashboard'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span>My Health</span>
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`flex flex-col items-center py-3 px-4 text-xs touch-manipulation ${
              activeSection === 'settings'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500'
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}