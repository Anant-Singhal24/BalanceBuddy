import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Wallet, Eye, EyeOff, Lock, CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AuthBackground from "../components/AuthBackground";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setError("No reset token found in URL. Please request a new password reset link.");
        setIsVerifying(false);
        return;
      }

      try {
        const verifyUrl = API_PATHS.AUTH.VERIFY_RESET_TOKEN(token);
        const response = await axiosInstance.get(verifyUrl);

        setIsTokenValid(response.data.valid);
        if (!response.data.valid) {
          setError("This password reset link has expired or is invalid. Please request a new one.");
        }
      } catch (err) {
        setIsTokenValid(false);
        setError("Invalid or expired password reset link. Please request a new one.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!token) {
      setError("No reset token provided. Please request a new password reset link.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token: token,
        newPassword: newPassword,
      });

      setMessage(response.data.message || "Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <AuthBackground>
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Verifying Security Token</h2>
          <p className="text-xs text-slate-500 mt-2">Checking your password reset link...</p>
        </div>
      </AuthBackground>
    );
  }

  if (!isTokenValid) {
    return (
      <AuthBackground>
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Expired or Invalid Link</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            {error || "This password reset token has expired or has already been used."}
          </p>
          <Link
            to="/forgot-password"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 font-semibold text-sm inline-block"
          >
            Request New Reset Link
          </Link>
        </div>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Password
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Set a strong, new password for your account.
        </p>

        {message && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 text-left animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message} Redirecting to login...</span>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium text-left animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              New Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-11 pr-11 block w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3 text-sm transition-all outline-none"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-11 pr-4 block w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3 text-sm transition-all outline-none"
                placeholder="Repeat your new password"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all font-semibold text-sm flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                Reset & Save Password
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthBackground>
  );
};

export default PasswordReset;
