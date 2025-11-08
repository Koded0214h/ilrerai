import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../store/slices/alertSlice";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";

export default function SettingsManagement() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+234-801-234-5678",
    facilityName: "Central PHC Ikeja",
    position: "Medical Officer",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    appointmentReminders: true,
    stockAlerts: true,
    patientUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  const handleSaveProfile = () => {
    dispatch(addAlert({
      message: "Profile updated successfully",
      type: "success"
    }));
  };

  const handleSaveNotifications = () => {
    dispatch(addAlert({
      message: "Notification preferences saved",
      type: "success"
    }));
  };

  const handleSaveSecurity = () => {
    dispatch(addAlert({
      message: "Security settings updated",
      type: "success"
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-heading mb-6 flex items-center">
        <Settings className="w-6 h-6 mr-2" />
        Settings
      </h2>

      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-text-body hover:bg-subtle-bg"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-heading mb-6">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Position
                  </label>
                  <select
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Medical Officer">Medical Officer</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Pharmacist">Pharmacist</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    value={profileData.facilityName}
                    onChange={(e) => setProfileData({...profileData, facilityName: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="mt-6 bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-heading mb-6">
                Notification Preferences
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">Email Alerts</h4>
                    <p className="text-sm text-text-body">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">SMS Alerts</h4>
                    <p className="text-sm text-text-body">Receive urgent notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">Appointment Reminders</h4>
                    <p className="text-sm text-text-body">Get notified about upcoming appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.appointmentReminders}
                      onChange={(e) => setNotifications({...notifications, appointmentReminders: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">Stock Alerts</h4>
                    <p className="text-sm text-text-body">Notifications when drug stock is low</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.stockAlerts}
                      onChange={(e) => setNotifications({...notifications, stockAlerts: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">Patient Updates</h4>
                    <p className="text-sm text-text-body">Notifications about patient status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.patientUpdates}
                      onChange={(e) => setNotifications({...notifications, patientUpdates: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <button
                onClick={handleSaveNotifications}
                className="mt-6 bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-heading mb-6">
                Security Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-heading">Two-Factor Authentication</h4>
                    <p className="text-sm text-text-body">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.twoFactorAuth}
                      onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-2">
                    Password Expiry (days)
                  </label>
                  <select
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity({...security, passwordExpiry: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-border">
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors mr-4">
                    Change Password
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Reset All Sessions
                  </button>
                </div>
              </div>
              <button
                onClick={handleSaveSecurity}
                className="mt-6 bg-primary hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Save Security Settings
              </button>
            </div>
          )}

          {activeTab === "system" && (
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-text-heading mb-6">
                System Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-text-heading mb-2">Data Export</h4>
                  <p className="text-sm text-text-body mb-4">Export your facility data for backup or analysis</p>
                  <div className="flex space-x-4">
                    <button className="bg-secondary hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Export Patient Data
                    </button>
                    <button className="bg-secondary hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Export Analytics
                    </button>
                  </div>
                </div>
                <div className="border-t border-border pt-6">
                  <h4 className="font-medium text-text-heading mb-2">System Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-body">Version:</span>
                      <span className="ml-2 font-medium">v1.0.0</span>
                    </div>
                    <div>
                      <span className="text-text-body">Last Updated:</span>
                      <span className="ml-2 font-medium">Jan 15, 2024</span>
                    </div>
                    <div>
                      <span className="text-text-body">Database:</span>
                      <span className="ml-2 font-medium">Connected</span>
                    </div>
                    <div>
                      <span className="text-text-body">Backup:</span>
                      <span className="ml-2 font-medium text-green-600">Up to date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}