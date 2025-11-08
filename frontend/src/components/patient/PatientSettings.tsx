import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../store/slices/alertSlice";
import { User, Phone, Lock, Save } from "lucide-react";

export default function PatientSettings() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.email || ""); // email field stores phone for patients
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      dispatch(addAlert({
        message: "Name is required",
        type: "error"
      }));
      return;
    }

    if (!/^0[789][01]\d{8}$/.test(phone)) {
      dispatch(addAlert({
        message: "Invalid phone format (0xxxxxxxxxx)",
        type: "error"
      }));
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, call API to update profile
      dispatch(addAlert({
        message: "Profile updated successfully",
        type: "success"
      }));
    } catch (error) {
      dispatch(addAlert({
        message: "Failed to update profile",
        type: "error"
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPin || !newPin || !confirmPin) {
      dispatch(addAlert({
        message: "All PIN fields are required",
        type: "error"
      }));
      return;
    }

    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin)) {
      dispatch(addAlert({
        message: "PIN must be 4 digits",
        type: "error"
      }));
      return;
    }

    if (newPin !== confirmPin) {
      dispatch(addAlert({
        message: "New PIN and confirmation don't match",
        type: "error"
      }));
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, call API to change PIN
      dispatch(addAlert({
        message: "PIN changed successfully",
        type: "success"
      }));
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (error) {
      dispatch(addAlert({
        message: "Failed to change PIN",
        type: "error"
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile Information
        </h3>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="08012345678"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      
      {/* PIN Change */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change PIN
        </h3>
        
        <form onSubmit={handleChangePin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current PIN
            </label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current PIN"
              maxLength={4}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New PIN
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new PIN"
              maxLength={4}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new PIN"
              maxLength={4}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !currentPin || !newPin || !confirmPin}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? "Changing..." : "Change PIN"}
          </button>
        </form>
      </div>
      
      {/* Account Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Account Information
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Patient ID:</span>
            <span className="font-medium">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Registration Date:</span>
            <span className="font-medium">January 15, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}