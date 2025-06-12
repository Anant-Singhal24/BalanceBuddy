import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
// import { saveUser, isAuthenticated } from "../utils/auth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import AuthBackground from "../components/AuthBackground";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Create user data object
    const userData = {
      fullName,
      email,
      password,
    };

    try {
      // Instead of registering directly, send OTP first
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        email,
        fullName,
        password,
        sendOtpOnly: true, // Flag to indicate we just want to generate and send OTP
      });

      if (response.data.success) {
        // Navigate to OTP verification page
        navigate("/verify-otp", {
          state: {
            email,
            userData, // Pass user data to be used after OTP verification
          },
        });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-4 rounded-full shadow-lg mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">BalanceBuddy</h1>
          <p className="text-gray-500 mt-2">Create a new account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p className="font-medium">Registration Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border"
                placeholder="••••••••"
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
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center font-medium text-base"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">
              Already have an account?
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 px-4 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all font-medium"
          >
            Sign In
          </Link>
        </form>
      </div>
    </AuthBackground>
  );
}
