import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach bearer token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and expired tokens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear stored session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Avoid infinite reload loops if already on an auth screen
        const currentPath = window.location.pathname.toLowerCase();
        const authPaths = ["/login", "/signup", "/verify-otp", "/forgot-password", "/reset-password"];
        const isOnAuthPage = authPaths.some((path) => currentPath.startsWith(path));

        if (!isOnAuthPage) {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please check your network connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
