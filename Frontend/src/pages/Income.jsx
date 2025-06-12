import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { incomeCategories } from "../constants/categories";
import CategorySelect from "../components/CategorySelect";
import DatePicker from "../components/DatePicker";

export default function Income() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch income transactions
  useEffect(() => {
    const fetchIncome = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          API_PATHS.INCOME.GET_ALL_INCOME
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching income:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncome();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: category,
        description,
        amount: parseFloat(amount),
        date,
      });

      setTransactions([response.data, ...transactions]);

      // Reset form
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString());
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const handleDelete = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      try {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
        setTransactions(transactions.filter((t) => t._id !== incomeId));
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Income</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Add Income</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                required
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <CategorySelect
                categories={incomeCategories}
                value={category}
                onChange={setCategory}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
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
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Income
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Income History</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No income records found
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const Icon = incomeCategories.find(
                  (c) => c.id === transaction.source
                )?.icon;
                const { date: displayDate, time: displayTime } = formatDateTime(
                  transaction.date
                );

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {incomeCategories.find(
                            (c) => c.id === transaction.source
                          )?.label || transaction.source}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{displayDate}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-400">{displayTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-emerald-500">
                        +₹{transaction.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
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

