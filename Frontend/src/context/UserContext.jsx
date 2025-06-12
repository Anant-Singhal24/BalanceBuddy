import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // State for user, token, and loading
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Verify token is valid
          const tokenIsValid = await verifyToken(storedToken);

          if (tokenIsValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid or expired
            clearUser();
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          clearUser();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Verify token with the backend
  const verifyToken = async (authToken) => {
    try {
      await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  // Function to update user data and save it in localStorage
  const updateUser = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
  };

  // Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, loading, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
