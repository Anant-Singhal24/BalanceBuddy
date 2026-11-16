import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, ArrowDownLeft, AlertCircle, ShoppingCart } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { expenseCategories } from "../constants/categories";
import CategorySelect from "../components/CategorySelect";
import DatePicker from "../components/DatePicker";

export default function Expenses() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
        setTransactions(response.data || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        description,
        amount: parsedAmount,
        date,
      });

      setTransactions([response.data, ...transactions]);

      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString());
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      try {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
        setTransactions(transactions.filter((t) => t._id !== expenseId));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const totalExpenseCalculated = transactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header with Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expense Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor, categorize, and control your spending habits
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-sm self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              Recorded Outflow
            </p>
            <p className="text-lg font-extrabold text-rose-700 leading-tight">
              ₹{totalExpenseCalculated.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all self-start">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Add New Expense</h2>
              <p className="text-[11px] text-slate-400">Log a bill, grocery, or purchase</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 pr-4 block w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 p-3 text-sm transition-all outline-none"
                  required
                  min="0.01"
                  step="any"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Expense Category
              </label>
              <CategorySelect
                categories={expenseCategories}
                value={category}
                onChange={setCategory}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Weekly Grocery Run"
                className="px-3.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 p-3 text-sm transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date & Time
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white py-3 px-4 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all font-semibold text-sm flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? "Logging Expense..." : "Save Expense Record"}</span>
            </button>
          </form>
        </div>

        {/* History List Card (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Expense Records</h2>
              <p className="text-[11px] text-slate-400">
                {transactions.length} total expenditures recorded
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Sorted by latest
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-6 animate-pulse">
              <div className="h-16 bg-slate-100 rounded-xl"></div>
              <div className="h-16 bg-slate-100 rounded-xl"></div>
              <div className="h-16 bg-slate-100 rounded-xl"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <p className="font-semibold text-slate-700 text-sm">No expenses recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Use the form on the left to log your first expenditure.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {transactions.map((transaction) => {
                const categoryMatch = expenseCategories.find(
                  (c) => c.id === transaction.category
                );
                const Icon = categoryMatch?.icon || ShoppingCart;
                const { date: displayDate, time: displayTime } = formatDateTime(
                  transaction.date
                );

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/90 rounded-xl transition-all border border-slate-100 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            {categoryMatch?.label || transaction.category}
                          </span>
                          <span className="text-[11px] text-slate-400">• {displayDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className="text-xs sm:text-sm font-bold text-rose-600">
                        -₹{Number(transaction.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
