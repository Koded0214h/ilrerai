import PredictiveReminders from '@/components/dashboard/PredictiveReminders';
import InsightsDashboard from '@/components/dashboard/InsightsDashboard';
import ReminderSystem from '@/components/dashboard/ReminderSystem';
import NearbyPHCs from '@/components/dashboard/NearbyPHCs';

export default function AIDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Healthcare Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PredictiveReminders />
          <InsightsDashboard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ReminderSystem />
          <NearbyPHCs />
        </div>
      </div>
    </div>
  );
}