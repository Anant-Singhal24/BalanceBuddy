import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Clock } from "lucide-react";

export default function DashboardLatestTrans({ transactions = [] }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Transactions</h3>
            <p className="text-[11px] text-slate-400">Latest 5 cash flow entries</p>
          </div>
        </div>

        <Link
          to="/transactions"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {transactions?.length > 0 ? (
          transactions.slice(0, 5).map((transaction, index) => {
            const isIncome = transaction.type === "income";
            const categoryLabel = isIncome ? transaction.source : transaction.category;
            const amount = Number(transaction.amount || 0);

            return (
              <div
                key={transaction._id || `transaction-${index}`}
                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? "bg-emerald-100/80 text-emerald-600"
                        : "bg-rose-100/80 text-rose-600"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                      {categoryLabel || "Uncategorized"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {transaction.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <span
                    className={`text-xs sm:text-sm font-bold block ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹
                    {amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(transaction.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p className="font-medium">No transactions recorded yet</p>
            <p className="text-slate-300 mt-1">Start by adding your first expense or income stream</p>
          </div>
        )}
      </div>
    </div>
  );
}
