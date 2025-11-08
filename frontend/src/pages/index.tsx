import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import LandingPage from '../components/auth/LandingPage';
import LoginForm from '../components/auth/LoginForm';
import StaffLayout from '../components/layout/StaffLayout';
import PatientDashboard from '../components/patient/PatientDashboard';

export default function Home() {
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [loginRole, setLoginRole] = useState<'staff' | 'patient'>('staff');

  const handleLoginClick = (role: 'staff' | 'patient') => {
    setLoginRole(role);
    setCurrentView('login');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (isAuthenticated && user) {
    if (user.role === 'staff') {
      return <StaffLayout />;
    } else {
      return <PatientDashboard />;
    }
  }

  if (currentView === 'login') {
    return <LoginForm role={loginRole} onBack={handleBackToLanding} />;
  }

  return <LandingPage onLoginClick={handleLoginClick} />;
}