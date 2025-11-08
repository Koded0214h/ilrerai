import { useAppSelector } from "../../store/hooks";
import { BarChart3, TrendingUp, Users, Calendar, Activity, AlertCircle } from "lucide-react";

export default function AnalyticsManagement() {
  const { patients, totalPatients, highRiskCount, adherenceRate } = useAppSelector(
    (state) => state.patients
  );
  const { isOpen, services, drugStock } = useAppSelector((state) => state.facility);

  const getPatientsByRisk = () => {
    const low = patients.filter((p) => p.riskLevel === "low").length;
    const medium = patients.filter((p) => p.riskLevel === "medium").length;
    const high = patients.filter((p) => p.riskLevel === "high").length;
    return { low, medium, high };
  };

  const getOverdueAppointments = () => {
    const today = new Date();
    return patients.filter((p) => new Date(p.nextAppointment) < today).length;
  };

  const getDrugStockStatus = () => {
    const total = Object.keys(drugStock).length;
    const lowStock = Object.values(drugStock).filter((qty) => qty <= 20).length;
    const criticalStock = Object.values(drugStock).filter((qty) => qty <= 10).length;
    return { total, lowStock, criticalStock };
  };

  const riskData = getPatientsByRisk();
  const overdueCount = getOverdueAppointments();
  const stockStatus = getDrugStockStatus();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-heading mb-6">
        Analytics Dashboard
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body">Total Patients</p>
              <p className="text-2xl font-bold text-text-heading">{totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +12% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body">Adherence Rate</p>
              <p className="text-2xl font-bold text-text-heading">{adherenceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +5% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body">Overdue Appointments</p>
              <p className="text-2xl font-bold text-text-heading">{overdueCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-red-600">
            +3 from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body">Active Services</p>
              <p className="text-2xl font-bold text-text-heading">{services.length}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-text-body">
            Out of 6 available
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Risk Distribution */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Patient Risk Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-body">Low Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(riskData.low / patients.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{riskData.low}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-body">Medium Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(riskData.medium / patients.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{riskData.medium}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-body">High Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(riskData.high / patients.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{riskData.high}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drug Stock Analysis */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Drug Stock Status
          </h3>
          <div className="space-y-4">
            {Object.entries(drugStock).map(([drug, quantity]) => (
              <div key={drug} className="flex items-center justify-between">
                <span className="text-text-body">{drug}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        quantity > 50
                          ? "bg-green-500"
                          : quantity > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((quantity / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>{stockStatus.lowStock}</strong> items need restocking
            </p>
          </div>
        </div>

        {/* Facility Performance */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4">
            Facility Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-body">Facility Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Service Utilization</span>
              <span className="font-medium">{Math.round((services.length / 6) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Patient Satisfaction</span>
              <span className="font-medium text-green-600">4.2/5.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Average Wait Time</span>
              <span className="font-medium">15 mins</span>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4">
            Monthly Trends
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-body">New Patients</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">28</span>
                <span className="text-sm text-green-600">↑ 12%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Appointments</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">156</span>
                <span className="text-sm text-green-600">↑ 8%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Messages Sent</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">89</span>
                <span className="text-sm text-red-600">↓ 3%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">No-shows</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">12</span>
                <span className="text-sm text-green-600">↓ 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}