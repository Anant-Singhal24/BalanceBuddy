import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import CustomPieChart from "../components/charts/CustomPieChart";

const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899"];

const IncomePieChart = ({ transactions = [], totalIncome = 0 }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions) return;

    // Group transactions by source
    const grouped = transactions.reduce((acc, item) => {
      const source = item?.source || "Other";
      acc[source] = (acc[source] || 0) + (Number(item?.amount) || 0);
      return acc;
    }, {});

    const processedData = Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
    }));

    setChartData(processedData);
  }, [transactions]);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Income by Source</h3>
            <p className="text-[11px] text-slate-400">Past 30 Days Activity</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          ₹{Number(totalIncome || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="pt-2">
        {chartData.length > 0 ? (
          <CustomPieChart
            data={chartData}
            label="Total Income"
            totalAmount={totalIncome}
            colors={COLORS}
            showTextAnchor
          />
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
            <p className="font-medium">No income logged in past 30 days</p>
            <p className="text-slate-300 mt-1">Add your first income stream above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomePieChart;
