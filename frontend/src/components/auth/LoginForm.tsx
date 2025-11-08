import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import type { AppDispatch } from "../../store";
import { loginSuccess, type User } from "../../store/slices/authSlice";
import { addAlert } from "../../store/slices/alertSlice";
import apiClient from "../../lib/api-client";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";


interface LoginFormProps {
  role: "staff" | "patient";
  onBack: () => void;
}

export default function LoginForm({ role, onBack }: LoginFormProps) {
  const dispatch: AppDispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isRegistering && !name)) {
      dispatch(addAlert({
        message: "Please fill in all fields",
        type: "error"
      }));
      return;
    }

    setLoading(true);

    try {
      let userData;
      
      if (isRegistering) {
        if (role === "staff") {
          userData = await apiClient.registerStaff(name, email, password);
        } else {
          userData = await apiClient.registerPatient(name, email, password);
        }
        dispatch(addAlert({
          message: "Registration successful! You can now log in.",
          type: "success"
        }));
        setIsRegistering(false);
        setName("");
        setPassword("");
      } else {
        if (role === "staff") {
          userData = await apiClient.loginStaff(email, password);
        } else {
          userData = await apiClient.loginPatient(email, password);
        }
        
        const user: User = role === "staff"
          ? {
              id: (userData as any).user.email,
              name: (userData as any).user.name,
              email: (userData as any).user.email,
              role: role as "staff"
            }
          : {
              ...(userData as any).patient,
              role: role as "patient"
            };

        dispatch(loginSuccess(user));
        dispatch(addAlert({
          message: `Welcome, ${user.name}!`,
          type: "success"
        }));
      }
    } catch (error: any) {
      dispatch(addAlert({
        message: error.message || "Authentication failed",
        type: "error"
      }));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-text-body hover:text-text-heading mb-4 sm:mb-6 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold text-text-heading mb-4 sm:mb-6 text-center">
          {isRegistering 
            ? (role === "staff" ? "Staff Registration" : "Patient Registration")
            : (role === "staff" ? "Staff Login" : "Patient Login")
          }
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-body mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter your full name"
                disabled={loading}
              />

            </div>
          )}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-body mb-1 sm:mb-2">
              {role === "staff" ? "Email Address" : "Phone Number"}
            </label>
            <input
              type={role === "staff" ? "email" : "tel"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder={role === "staff" ? "staff@phc.com" : "08012345678"}
              disabled={loading}
            />

          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-body mb-1 sm:mb-2">
              {role === "staff" ? "Password" : "PIN"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm sm:text-base"
                placeholder={role === "staff" ? "Enter your password" : "Enter 4-digit PIN"}
                maxLength={role === "patient" ? 4 : undefined}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body hover:text-text-heading touch-manipulation"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

          </div>
          
          <button
            type="submit"
            disabled={loading || !email || !password || (isRegistering && !name)}
            className="w-full bg-primary hover:bg-blue-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation disabled:opacity-50"
          >
            {loading 
              ? (isRegistering ? "Registering..." : "Signing In...") 
              : (isRegistering ? "Register" : "Sign In")
            }
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-blue-600 hover:underline text-sm"
              disabled={loading}
            >
              {isRegistering 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Register"
              }
            </button>
          </div>
        </form>
        
        {!isRegistering && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              {role === "staff" ? "Staff: any@email.com / any" : "Patient: +234-801-234-567 / 1234"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}