
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store";
import { AlertTriangle, Users, Calendar, TrendingUp } from "lucide-react";
import RealTimeActivity from './RealTimeActivity';

export default function DashboardOverview() {
  const { isOpen } = useAppSelector((state: RootState) => state.facility);
  const {
    totalPatients = 0,
    highRiskCount = 0,
    adherenceRate = 0,
  } = useAppSelector((state: RootState) => state.patients);

  const stats = [
    {
      title: "Facility Status",
      value: isOpen ? "Open" : "Closed",
      icon: AlertTriangle,
      color: isOpen ? "text-green-600" : "text-red-600",
      bgColor: isOpen ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Total Patients",
      value: totalPatients.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "High Risk Patients",
      value: highRiskCount.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Adherence Rate",
      value: `${adherenceRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Urgent Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-sm text-gray-600">
                {highRiskCount} patients at high risk of missing visits
              </span>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600 mr-3" />
              <span className="text-sm text-gray-600">
                15 appointments scheduled for today
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                SMS reminder sent to Amina Ibrahim
              </span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                Facility status updated to Open
              </span>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Drug stock updated</span>
              <span className="text-xs text-gray-400">3 hours ago</span>
            </div>
          </div>
        </div>
        
        <RealTimeActivity />
      </div>
    </div>
  );
}
