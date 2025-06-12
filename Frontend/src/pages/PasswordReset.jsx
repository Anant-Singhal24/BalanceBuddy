import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Wallet, Eye, EyeOff } from "lucide-react";
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

  // console.log("Token from URL:", token);
  // console.log("Token length:", token?.length);

  // Validate token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        // console.log("No token found in URL params");
        setIsTokenValid(false);
        setError(
          "No reset token provided. Please request a new password reset link."
        );
        setIsVerifying(false);
        return;
      }

      try {
        const verifyUrl = API_PATHS.AUTH.VERIFY_RESET_TOKEN(token);
        // console.log("Verifying token at:", verifyUrl);

        const response = await axiosInstance.get(verifyUrl);
        // console.log("Token verification response:", response.data);

        setIsTokenValid(response.data.valid);
        if (!response.data.valid) {
          setError(
            "Invalid or expired reset token. Please request a new password reset link."
          );
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setIsTokenValid(false);
        setError(
          "Invalid or expired reset token. Please request a new password reset link."
        );
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
      setError(
        "No reset token provided. Please request a new password reset link."
      );
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // console.log("Submitting password reset");
      // console.log("Full URL:", API_PATHS.AUTH.RESET_PASSWORD);
      // console.log("Token being sent:", token);
      // console.log("New password length:", newPassword.length);

      const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token: token,
        newPassword: newPassword,
      });

      // console.log("Reset password response:", response);

      setMessage(response.data.message || "Password reset successful!");
      setError("");

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);

      if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);

        setError(err.response.data.message || "Failed to reset password");

        if (err.response.data.message === "Invalid or expired reset token") {
          setIsTokenValid(false);
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please try again.");
      } else {
        console.error("Request error:", err.message);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <AuthBackground>
        <div className="bg-white p-8 rounded-lg shadow-xl w-full backdrop-blur-md bg-opacity-95 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Wallet className="w-10 h-10 text-emerald-500" />
            <h1 className="text-2xl font-bold text-gray-900">BalanceBuddy</h1>
          </div>

          <div className="text-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </AuthBackground>
    );
  }

  // If token is invalid, show error and link to forgot password
  if (!isTokenValid) {
    return (
      <AuthBackground>
        <div className="bg-white p-8 rounded-lg shadow-xl w-full backdrop-blur-md bg-opacity-95 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Wallet className="w-10 h-10 text-emerald-500" />
            <h1 className="text-2xl font-bold text-gray-900">BalanceBuddy</h1>
          </div>

          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error || "Invalid or expired reset token"}
          </div>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 inline-block"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full backdrop-blur-md bg-opacity-95 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wallet className="w-10 h-10 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900">BalanceBuddy</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
          Reset Password
        </h2>

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
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Eye className="h-5 w-5 text-emerald-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-sm font-medium text-gray-700 text-center">
            Remember your password?{" "}
            <Link to="/login" className="text-emerald-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </AuthBackground>
  );
};

export default PasswordReset;
