import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { UserContext } from "../context/UserContext";

export default function Sidebar() {
  const { user, clearUser } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      clearUser();
      navigate("/login");
    }
  };

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/income",
      label: "Income",
      icon: ArrowUpCircle,
    },
    {
      to: "/expenses",
      label: "Expenses",
      icon: ArrowDownCircle,
    },
    {
      to: "/transactions",
      label: "Transactions",
      icon: History,
    },
    {
      to: "/ai-insights",
      label: "AI Advisor",
      icon: Sparkles,
      badge: "AI",
    },
  ];

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "B";

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Dark Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-950 text-slate-300 z-50
        flex flex-col justify-between border-r border-slate-800/80
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Brand Header */}
        <div className="p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                Balance<span className="text-emerald-400">Buddy</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Smart Money Manager</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
              Menu
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/5 text-emerald-400 font-semibold shadow-sm border border-emerald-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive ? "text-emerald-400" : "text-slate-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Logout in Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                {userInitial}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.fullName || "My Account"}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">
                  {user?.email || "user@balancebuddy.com"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
