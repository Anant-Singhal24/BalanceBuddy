import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, FileText, Download } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'income' | 'expense'

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [incomesResponse, expensesResponse] = await Promise.all([
          axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
        ]);

        const combined = [
          ...incomesResponse.data.map((income) => ({
            ...income,
            type: "income",
            category: income.source,
          })),
          ...expensesResponse.data.map((expense) => ({
            ...expense,
            type: "expense",
          })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(combined);
      } catch (err) {
        setError("Failed to load transactions. Please try again.");
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      filterType === "all" ? true : t.type === filterType;
    const matchesSearch =
      (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalIn = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalOut = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete chronological record of all logged inflows and expenditures
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
            In: +₹{totalIn.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold">
            Out: -₹{totalOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by description or category..."
            className="pl-9 pr-4 py-2 w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === "income"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Incomes
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === "expense"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-lg"></div>
            <div className="h-10 bg-slate-100 rounded-lg"></div>
            <div className="h-10 bg-slate-100 rounded-lg"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No matching transactions</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === "income";

                  return (
                    <tr
                      key={transaction._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {formatDateTime(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200/60"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                        {transaction.category || "General"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {transaction.description || "—"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right font-bold text-sm ${
                          isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}₹
                        {Number(transaction.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
