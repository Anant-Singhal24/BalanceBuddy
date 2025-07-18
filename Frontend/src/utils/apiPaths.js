export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_PATHS = {
  BASE_URL: BASE_URL,
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    VERIFY_RESET_TOKEN: (token) => `/api/v1/auth/verify-reset-token/${token}`,
    VERIFY_OTP: "/api/v1/auth/verify-otp",
    RESEND_OTP: "/api/v1/auth/resend-otp",
    COMPLETE_REGISTRATION: "/api/v1/auth/complete-registration",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
  },
  AI: {
    GET_INSIGHTS: "/api/v1/ai/insights",
    GET_BUDGET: "/api/v1/ai/budget",
    STREAM_INSIGHTS: "/api/v1/ai/stream-insights",
  },
};
