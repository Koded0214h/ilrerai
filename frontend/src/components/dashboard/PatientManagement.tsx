import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchPatients, updatePatientRiskLevel } from "../../store/slices/patientSlice";
import { addAlert } from "../../store/slices/alertSlice";
import socketService from "../../lib/socket";
import { Users, Phone, Calendar, AlertTriangle } from "lucide-react";

export default function PatientManagement() {
  const dispatch = useAppDispatch();
  const { patients, totalPatients, highRiskCount, adherenceRate, loading, error } = useAppSelector(
    (state) => state.patients
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPatients());
    
    // Initialize sync service for staff
    const syncService = require('../../lib/sync-service').default;
    syncService.initialize('staff');
    
    return () => {
      syncService.disconnect();
    };
  }, [dispatch]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleRiskUpdate = async (patientId: string, newRisk: "low" | "medium" | "high") => {
    try {
      await dispatch(updatePatientRiskLevel({ id: patientId, riskLevel: newRisk })).unwrap();
      
      // Notify patient in real-time
      const syncService = require('../../lib/sync-service').default;
      syncService.notifyStaffUpdate('risk_update', {
        patientId,
        message: `Your risk level has been updated to ${newRisk}`,
        newRiskLevel: newRisk
      });
      
      dispatch(
        addAlert({
          message: "Patient risk level updated successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        addAlert({
          message: "Failed to update patient risk level",
          type: "error",
        })
      );
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-lg">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchPatients())}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-heading mb-6">
        Patient Management
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm text-text-body">Total Patients</p>
              <p className="text-2xl font-bold text-text-heading">{totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-text-body">High Risk</p>
              <p className="text-2xl font-bold text-text-heading">{highRiskCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-text-body">Adherence Rate</p>
              <p className="text-2xl font-bold text-text-heading">{adherenceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg border border-border shadow-sm mb-6">
        <input
          type="text"
          placeholder="Search patients by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-heading">
            Patient Records ({filteredPatients.length})
          </h3>
        </div>
        <div className="divide-y divide-border">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-medium text-text-heading">
                      {patient.name}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                        patient.risk_level
                      )}`}
                    >
                      {patient.risk_level.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-text-body">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {patient.phone}
                    </div>
                    {patient.next_appointment && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Next: {new Date(patient.next_appointment).toLocaleDateString()}
                      </div>
                    )}
                    {patient.last_visit && (
                      <div>
                        Last Visit: {new Date(patient.last_visit).toLocaleDateString()}
                      </div>
                    )}
                    {patient.phc_name && (
                      <div>PHC: {patient.phc_name}</div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={patient.risk_level}
                    onChange={(e) =>
                      handleRiskUpdate(
                        patient.id,
                        e.target.value as "low" | "medium" | "high"
                      )
                    }
                    className="px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {filteredPatients.length === 0 && (
            <div className="p-6 text-center text-text-body">
              No patients found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}