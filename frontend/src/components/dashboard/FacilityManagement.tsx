import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  toggleFacilityStatus,
  updateHours,
  updateServices,
} from "../../store/slices/facilitySlice";
import { addAlert } from "../../store/slices/alertSlice";
import { Clock, Package, CheckCircle } from "lucide-react";

export default function FacilityManagement() {
  const dispatch = useAppDispatch();
  const { isOpen, hours, services, drugStock } = useAppSelector(
    (state) => state.facility
  );
  const [newHours, setNewHours] = useState(hours);
  const [selectedServices, setSelectedServices] = useState(services);

  const availableServices = [
    "Immunization",
    "Antenatal",
    "General Consultation",
    "Family Planning",
    "Child Health",
    "Malaria Treatment",
  ];

  const handleStatusToggle = () => {
    dispatch(toggleFacilityStatus());
    dispatch(
      addAlert({
        message: `Facility status updated to ${!isOpen ? "Open" : "Closed"}`,
        type: "success",
      })
    );
  };

  const validateHours = (hours: string) => {
    const pattern =
      /^(1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:AM|PM)\s*-\s*(1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:AM|PM)$/i;
    return pattern.test(hours.trim());
  };

  const handleHoursUpdate = () => {
    if (!validateHours(newHours)) {
      dispatch(
        addAlert({
          message:
            'Invalid hours format. Please use format like "8:00 AM - 5:00 PM"',
          type: "error",
        })
      );
      return;
    }
    dispatch(updateHours(newHours.trim()));
    dispatch(
      addAlert({
        message: "Operating hours updated successfully",
        type: "success",
      })
    );
  };

  const handleServiceToggle = (service: string) => {
    if (selectedServices.length >= 5 && !selectedServices.includes(service)) {
      dispatch(
        addAlert({
          message: "Maximum of 5 services can be selected",
          type: "warning",
        })
      );
      return;
    }

    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s: string) => s !== service)
      : [...selectedServices, service];

    setSelectedServices(updated);
    dispatch(updateServices(updated));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-heading mb-6">
        Facility Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facility Status */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4">
            Facility Status
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-body">Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOpen
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>
          <button
            onClick={handleStatusToggle}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isOpen
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-secondary hover:bg-green-600 text-white"
            }`}
          >
            {isOpen ? "Close Facility" : "Open Facility"}
          </button>
        </div>

        {/* Operating Hours */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Operating Hours
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newHours}
              onChange={(e) => setNewHours(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 8:00 AM - 5:00 PM"
            />
            <button
              onClick={handleHoursUpdate}
              className="w-full bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Update Hours
            </button>
          </div>
        </div>

        {/* Available Services */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Available Services
          </h3>
          <div className="space-y-2">
            {availableServices.map((service) => (
              <label
                key={service}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-text-body">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Drug Stock */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Drug Stock
          </h3>
          <div className="space-y-3">
            {Object.entries(drugStock).map(([drug, quantity]) => {
              const qty = quantity as number;
              return (
                <div
                  key={drug}
                  className="flex items-center justify-between p-3 bg-subtle-bg rounded-lg"
                >
                  <span className="text-text-body font-medium">{drug}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      qty > 50
                        ? "bg-green-100 text-green-800"
                        : qty > 20
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {qty} units
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
