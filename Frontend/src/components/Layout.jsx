import React, { useContext } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserContext } from "../context/UserContext";
import { Calendar, PlusCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function Layout() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Hi, {user?.fullName?.split(" ")[0] || "Buddy"} <span className="animate-wiggle">👋</span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Here's your personal financial overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mr-12 lg:mr-0">
            {/* Live Date Pill */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDate}</span>
            </div>

            {/* Quick Action Buttons */}
            <Link
              to="/income"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Income</span>
            </Link>

            <Link
              to="/expenses"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-sm"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />
              <span>Add Expense</span>
            </Link>
          </div>
        </header>

        {/* Main Routed Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
