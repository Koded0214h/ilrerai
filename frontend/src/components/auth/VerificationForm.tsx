import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../store/slices/alertSlice";
import { loginSuccess } from "../../store/slices/authSlice";
import apiClient from "../../lib/api-client";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface VerificationFormProps {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
}

export default function VerificationForm({ phone, onBack, onVerified }: VerificationFormProps) {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      dispatch(addAlert({
        message: "Please enter the 4-digit verification code",
        type: "error"
      }));
      return;
    }

    setLoading(true);

    try {
      await apiClient.verifyPatient(phone, code);
      dispatch(addAlert({
        message: "Phone verified successfully! You can now log in.",
        type: "success"
      }));
      onVerified();
    } catch (error) {
      dispatch(addAlert({
        message: "Invalid verification code",
        type: "error"
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      // In a real app, you'd call an API to resend the code
      dispatch(addAlert({
        message: "Verification code resent to your phone",
        type: "info"
      }));
    } catch (error) {
      dispatch(addAlert({
        message: "Failed to resend code",
        type: "error"
      }));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Verify Your Phone
        </h2>
        
        <p className="text-sm text-gray-600 mb-6 text-center">
          We sent a 4-digit code to <strong>{phone}</strong>
        </p>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              placeholder="0000"
              maxLength={4}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${resending ? 'animate-spin' : ''}`} />
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}