import { useState } from "react";
import { Heart, Users, MessageSquare, BarChart3, MapPin, Calendar } from "lucide-react";

interface LandingPageProps {
  onLoginClick: (role: "staff" | "patient") => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-heading">IlerAI PHC</h1>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => onLoginClick("patient")}
                className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors touch-manipulation"
              >
                Patient
              </button>
              <button
                onClick={() => onLoginClick("staff")}
                className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-text-heading mb-4 sm:mb-6 leading-tight">
            Smart Healthcare Management
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-text-body mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Connecting Primary Health Centers with patients through intelligent management,
            real-time communication, and comprehensive health tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onLoginClick("patient")}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-secondary text-white rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-green-600 transition-colors touch-manipulation"
            >
              Find Nearby PHCs
            </button>
            <button
              onClick={() => onLoginClick("staff")}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-primary text-white rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-blue-700 transition-colors touch-manipulation"
            >
              Manage Your Facility
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-text-heading mb-6 sm:mb-8 lg:mb-12">
            Comprehensive Healthcare Solutions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Patient Management
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Track patient records, appointments, and health status with ease.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-secondary mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Smart Communication
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Send targeted messages and reminders to patients automatically.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Analytics & Insights
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Get detailed analytics on facility performance and patient outcomes.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Location Services
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Find nearby PHCs and get directions with integrated mapping.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Appointment Scheduling
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Book and manage appointments with automated reminders.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-pink-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-text-heading mb-1 sm:mb-2">
                Health Monitoring
              </h4>
              <p className="text-xs sm:text-sm lg:text-base text-text-body leading-relaxed">
                Monitor patient health metrics and receive personalized advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Transform Healthcare?
          </h3>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of healthcare providers and patients using IlerAI PHC
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onLoginClick("staff")}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-white text-primary rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-100 transition-colors touch-manipulation"
            >
              Get Started as Staff
            </button>
            <button
              onClick={() => onLoginClick("patient")}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 border-2 border-white text-white rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-white hover:text-primary transition-colors touch-manipulation"
            >
              Access Patient Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <span className="text-base sm:text-lg font-semibold">IlerAI PHC</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Empowering healthcare through intelligent technology
          </p>
        </div>
      </footer>
    </div>
  );
}