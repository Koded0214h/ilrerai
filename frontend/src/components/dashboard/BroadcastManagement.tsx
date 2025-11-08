import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../store/slices/alertSlice";
import { Send, Users, MessageSquare, Clock } from "lucide-react";

export default function BroadcastManagement() {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patients);
  const [message, setMessage] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [messageType, setMessageType] = useState("reminder");

  const messageTemplates = {
    reminder: "Reminder: You have an upcoming appointment. Please confirm your attendance.",
    health_tip: "Health Tip: Remember to take your medication as prescribed and maintain a healthy diet.",
    emergency: "Important: Please contact the facility immediately regarding your health status.",
  };

  const getAudienceCount = () => {
    switch (selectedAudience) {
      case "all":
        return patients.length;
      case "high_risk":
        return patients.filter((p) => p.riskLevel === "high").length;
      case "overdue":
        const today = new Date();
        return patients.filter((p) => new Date(p.nextAppointment) < today).length;
      default:
        return 0;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      dispatch(
        addAlert({
          message: "Please enter a message to send",
          type: "error",
        })
      );
      return;
    }

    const audienceCount = getAudienceCount();
    dispatch(
      addAlert({
        message: `Message sent successfully to ${audienceCount} patients`,
        type: "success",
      })
    );
    setMessage("");
  };

  const handleTemplateSelect = (template: string) => {
    setMessage(messageTemplates[template as keyof typeof messageTemplates]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-heading mb-6">
        Broadcast Messages
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Compose Message
          </h3>

          {/* Message Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-body mb-2">
              Message Type
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="reminder">Appointment Reminder</option>
              <option value="health_tip">Health Tip</option>
              <option value="emergency">Emergency Alert</option>
            </select>
          </div>

          {/* Templates */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-body mb-2">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTemplateSelect("reminder")}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
              >
                Appointment Reminder
              </button>
              <button
                onClick={() => handleTemplateSelect("health_tip")}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
              >
                Health Tip
              </button>
              <button
                onClick={() => handleTemplateSelect("emergency")}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
              >
                Emergency Alert
              </button>
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-body mb-2">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="text-right text-sm text-text-body mt-1">
              {message.length}/160 characters
            </div>
          </div>

          {/* Audience Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-body mb-2">
              Target Audience
            </label>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Patients</option>
              <option value="high_risk">High Risk Patients Only</option>
              <option value="overdue">Overdue Appointments</option>
            </select>
            <div className="text-sm text-text-body mt-1">
              Will send to {getAudienceCount()} patients
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </button>
        </div>

        {/* Stats & Recent Messages */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Audience Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-body">Total Patients</span>
                <span className="font-medium">{patients.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-body">High Risk</span>
                <span className="font-medium text-red-600">
                  {patients.filter((p) => p.riskLevel === "high").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-body">Overdue</span>
                <span className="font-medium text-yellow-600">
                  {patients.filter((p) => new Date(p.nextAppointment) < new Date()).length}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Messages
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-subtle-bg rounded-lg">
                <div className="text-sm font-medium text-text-heading">Appointment Reminder</div>
                <div className="text-xs text-text-body">Sent to 15 patients • 2 hours ago</div>
              </div>
              <div className="p-3 bg-subtle-bg rounded-lg">
                <div className="text-sm font-medium text-text-heading">Health Tip</div>
                <div className="text-xs text-text-body">Sent to all patients • 1 day ago</div>
              </div>
              <div className="p-3 bg-subtle-bg rounded-lg">
                <div className="text-sm font-medium text-text-heading">Emergency Alert</div>
                <div className="text-xs text-text-body">Sent to 3 patients • 3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}