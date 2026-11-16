import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, ShieldCheck, RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react";
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
  const [isVerifying, setIsVerifying] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userData } = location.state || {};

  useEffect(() => {
    if (!email || !userData) {
      navigate("/signup");
      return;
    }

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes, email, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsVerifying(true);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      if (response.data.success) {
        setMessage("Code verified! Setting up your account...");

        const regResponse = await axiosInstance.post(
          API_PATHS.AUTH.COMPLETE_REGISTRATION,
          {
            userData,
          }
        );

        const { token, user } = regResponse.data;

        if (token) {
          updateUser(user, token);
          setTimeout(() => {
            navigate("/");
          }, 1200);
        }
      } else {
        setError("Invalid verification code. Please check and try again.");
        setIsVerifying(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify code. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      setMessage("A fresh verification code has been sent to your email!");
      setMinutes(2);
      setSeconds(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  const isTimerExpired = minutes === 0 && seconds === 0;

  return (
    <AuthBackground>
      <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Your Email
        </h2>

        <p className="text-sm text-slate-500 mt-2 mb-6">
          We sent a 6-digit code to <br />
          <span className="font-semibold text-slate-800 break-all">{email}</span>
        </p>

        {message && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 text-left animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium text-left animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
            >
              Enter 6-Digit Passcode
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))
              }
              className="w-full text-center tracking-[0.6em] text-3xl font-bold rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 py-3.5 px-4 transition-all outline-none"
              required
              placeholder="••••••"
              maxLength={6}
              autoFocus
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
            {!isTimerExpired ? (
              <span>
                Code expires in:{" "}
                <strong className="text-emerald-600 font-bold">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </strong>
              </span>
            ) : (
              <span className="text-red-500 font-semibold">Code expired</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all font-semibold text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span>Verifying & Logging In...</span>
            ) : (
              <>
                Confirm & Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!isTimerExpired}
              className={`text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors ${
                !isTimerExpired
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-emerald-600 hover:text-emerald-700 hover:underline"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Didn't receive code? Resend Code
            </button>
          </div>
        </form>
      </div>
    </AuthBackground>
  );
};

export default OTPVerification;
