import React, { useEffect, useState } from "react";
import CustomPieChart from "../components/charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const IncomePieChart = ({ transactions, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions) return;

    // Process transactions data
    const processedData = transactions.map(item => ({
      name: item?.source || 'Unknown Source',
      amount: item?.amount || 0
    }));

    setChartData(processedData);
  }, [transactions]);

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Income</h5>
        <span className="text-sm text-gray-500">
          Total Income(30 Days): ₹
          {totalIncome.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {chartData.length> 0 ? (
        <CustomPieChart
          data={chartData}
          label="Income Distribution"
          totalAmount={totalIncome}
          colors={COLORS}
          showTextAnchor
        />
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No income data available
        </div>
      )}
    </div>
  );
};

export default IncomePieChart;

