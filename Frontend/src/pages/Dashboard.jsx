import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import DashboardLatestTrans from "./DashboardLatestTrans";
import FinanceOverview from "./FinanceOverview";
import IncomePieChart from "./IncomePieChart";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalBalance = dashboardData?.totalBalance ?? 0;
  const totalIncome = dashboardData?.totalIncome ?? 0;
  const totalExpenses = dashboardData?.totalExpenses ?? 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
          <div className="h-32 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Title & AI Advisor banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time summary of your balances, cash flow, and spending patterns
          </p>
        </div>

        <Link
          to="/ai-insights"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Advisor</span>
        </Link>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Total Net Worth
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ₹{totalBalance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-medium pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-time portfolio balance
            </p>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Total Inflow
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
              ₹{totalIncome.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-slate-400 font-medium pt-1">
              Cumulative income streams logged
            </p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Total Outflow
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-rose-600 tracking-tight">
              ₹{totalExpenses.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-slate-400 font-medium pt-1">
              Cumulative expenditures logged
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceOverview
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpenses}
        />

        <IncomePieChart
          transactions={dashboardData?.last30DaysIncome?.transactions || []}
          totalIncome={dashboardData?.last30DaysIncome?.total || totalIncome}
        />
      </div>

      {/* Recent Transactions List */}
      <DashboardLatestTrans transactions={dashboardData?.recentTransactions} />
    </div>
  );
}
