import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AuthBackground from "../components/AuthBackground";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <AuthBackground>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full backdrop-blur-md bg-opacity-95 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Wallet className="w-10 h-10 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900">BalanceBuddy</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
          Forgot Password
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Send Reset Link
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

export default ForgotPassword;
