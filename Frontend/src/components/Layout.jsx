import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserContext } from "../context/UserContext";

export default function Layout() {

  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 w-full">
        <div className="p-4 sm:p-6 lg:p-8 lg:ml-64">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
