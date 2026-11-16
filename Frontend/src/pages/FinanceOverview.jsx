import React from "react";
import { PieChart as PieIcon, DollarSign } from "lucide-react";
import CustomPieChart from "../components/charts/CustomPieChart";

const COLORS = ["#10b981", "#f43f5e", "#6366f1"];

const FinanceOverview = ({ totalBalance = 0, totalIncome = 0, totalExpense = 0 }) => {
  const balanceData = [
    { name: "Total Balance", amount: Math.abs(totalBalance) },
    { name: "Total Expenses", amount: Math.abs(totalExpense) },
    { name: "Total Income", amount: Math.abs(totalIncome) },
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Financial Breakdown</h3>
            <p className="text-[11px] text-slate-400">Balance vs Income vs Expense</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          ₹{Number(totalBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="pt-2">
        <CustomPieChart
          data={balanceData}
          label="Total Balance"
          totalAmount={totalBalance}
          colors={COLORS}
          showTextAnchor
        />
      </div>
    </div>
  );
};

export default FinanceOverview;
