import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import AuthBackground from "../components/AuthBackground";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userData } = location.state || {};

  useEffect(() => {
    if (!email || !userData) {
      navigate("/signup");
      return;
    }

    // Timer for OTP expiration
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        // OTP expired
        clearInterval(interval);
        setError("OTP has expired. Please request a new one.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes, email, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      if (response.data.success) {
        setMessage("OTP verified successfully!");

        // User is now verified, complete registration
        const regResponse = await axiosInstance.post(
          API_PATHS.AUTH.COMPLETE_REGISTRATION,
          {
            userData,
          }
        );

        const { token, user } = regResponse.data;

        if (token) {
          updateUser(user, token);
          // Show success message briefly before redirecting
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  const handleResendOTP = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      setMessage("A new OTP has been sent to your email");
      // Reset timer
      setMinutes(2);
      setSeconds(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <AuthBackground>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full backdrop-blur-md bg-opacity-95 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wallet className="w-10 h-10 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900">BalanceBuddy</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
          Verify Your Email
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium">{email}</span>
        </p>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border text-center text-lg tracking-widest"
              required
              placeholder="• • • • • •"
              maxLength={6}
            />
          </div>

          <div className="text-center text-sm text-gray-500">
            {minutes > 0 || seconds > 0 ? (
              <p>
                Time remaining: {minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
            ) : (
              <p>OTP expired</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Verify OTP
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={minutes > 0 || seconds > 0}
              className={`text-sm ${
                minutes > 0 || seconds > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-emerald-600 hover:underline"
              }`}
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </AuthBackground>
  );
};

export default OTPVerification;
