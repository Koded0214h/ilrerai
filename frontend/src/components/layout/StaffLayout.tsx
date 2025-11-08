import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import Sidebar from './Sidebar';
import DashboardOverview from '../dashboard/DashboardOverview';
import FacilityManagement from '../dashboard/FacilityManagement';
import PatientManagement from '../dashboard/PatientManagement';
import BroadcastManagement from '../dashboard/BroadcastManagement';
import AnalyticsManagement from '../dashboard/AnalyticsManagement';
import SettingsManagement from '../dashboard/SettingsManagement';
import NotificationCenter from '../dashboard/NotificationCenter';
import USSDSimulator from '../dashboard/USSDSimulator';
import RealTimeActivity from '../dashboard/RealTimeActivity';
import ServiceManagement from '../dashboard/ServiceManagement';
import NotificationToast from './NotificationToast';
import { LogOut, Menu, X, Home, Building, Users, MessageSquare, Phone, Hash, BarChart3, Settings } from 'lucide-react';

export default function StaffLayout() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'facility':
        return <FacilityManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'broadcast':
        return <BroadcastManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'ussd':
        return <USSDSimulator />;
      case 'analytics':
        return <AnalyticsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'facility', label: 'Facility', icon: Building },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'broadcast', label: 'Broadcast', icon: MessageSquare },
    { id: 'notifications', label: 'SMS & Voice', icon: Phone },
    { id: 'ussd', label: 'USSD Service', icon: Hash },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-800 touch-manipulation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors touch-manipulation ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Staff Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-16 lg:pb-0">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-6 gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center py-2 px-1 text-xs touch-manipulation ${
                  activeSection === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      <NotificationToast />
    </div>
  );
}