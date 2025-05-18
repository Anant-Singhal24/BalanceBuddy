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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Wallet className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold">BalanceBuddy</h1>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-gray-800 text-emerald-400" : ""
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/income"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-gray-800 text-emerald-400" : ""
                }`
              }
            >
              <ArrowUpCircle className="w-5 h-5" />
              Income
            </NavLink>

            <NavLink
              to="/expenses"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-gray-800 text-emerald-400" : ""
                }`
              }
            >
              <ArrowDownCircle className="w-5 h-5" />
              Expenses
            </NavLink>

            <NavLink
              to="/transactions"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors ${
                  isActive ? "bg-gray-800 text-emerald-400" : ""
                }`
              }
            >
              <History className="w-5 h-5" />
              Transactions
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors mt-auto absolute bottom-4 w-[calc(100%-2rem)]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
