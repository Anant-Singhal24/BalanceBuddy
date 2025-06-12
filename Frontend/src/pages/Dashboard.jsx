import React, { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DashboardLatestTrans from "./DashboardLatestTrans";
import FinanceOverview from "./FinanceOverview";
import IncomePieChart from "./IncomePieChart";

export default function Dashboard() {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 font-medium">Total Balance</h2>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold">
            ₹{" "}
            {dashboardData?.totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 font-medium">Total Income</h2>
            <ArrowUpCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-emerald-500">
            ₹{" "}
            {dashboardData?.totalIncome.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 font-medium">Total Expenses</h2>
            <ArrowDownCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-red-500">
            ₹{" "}
            {dashboardData?.totalExpenses.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      {(dashboardData?.totalBalance > 0 || dashboardData?.totalIncome > 0 || dashboardData?.totalBalance < 0 || dashboardData?.totalExpenses > 0) && (
        <FinanceOverview
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpenses || 0}
        />
       )} 
      <br />

      {dashboardData?.totalIncome > 0 && dashboardData?.last30DaysIncome?.transactions?.length > 0 && (
        <IncomePieChart
          transactions={dashboardData?.last30DaysIncome?.transactions || []}
          totalIncome={dashboardData?.totalIncome || 0}
        />
      )}
      <br />
      <DashboardLatestTrans transactions={dashboardData?.recentTransactions} />
    </div>
  );
}
