import React, { useState, useEffect, useRef } from "react";
import { BarChart3, CircleDollarSign, Lightbulb, Loader2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Simple markdown parser for converting markdown to HTML
const parseMarkdown = (text) => {
  if (!text) return "";

  // Convert bold markdown (**text**) to HTML <strong> tags
  const boldParsed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert markdown headings (# Heading) to HTML heading tags
  const headingsParsed = boldParsed
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold my-3">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold my-3">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>');

  // Convert bullet points to proper HTML lists
  const bulletsParsed = headingsParsed.replace(/^- (.*?)$/gm, "• $1");

  return bulletsParsed;
};

export default function AiInsights() {
  const [loading, setLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);
  const [error, setError] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [insights, setInsights] = useState("");
  const [budgetRecommendations, setBudgetRecommendations] = useState("");
  const [streamedInsights, setStreamedInsights] = useState("");
  const [useStreaming, setUseStreaming] = useState(false);
  const eventSourceRef = useRef(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();

    // Cleanup event source on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (response.data) {
        // Get expenses from the last 30 days
        const expenses = response.data.last30DaysExpenses.transactions || [];
        setExpenseData(expenses);
        setIncomeAmount(response.data.totalIncome || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch your financial data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get non-streaming AI insights
  const fetchInsights = async () => {
    if (expenseData.length === 0) {
      setError("No expense data available for analysis");
      return;
    }

    setLoading(true);
    setError("");
    setInsights("");

    try {
      const response = await axiosInstance.post(API_PATHS.AI.GET_INSIGHTS, {
        expenses: expenseData,
        timeRange: "the last 30 days",
      });

      if (response.data && response.data.success) {
        setInsights(response.data.insights);

        // Also fetch budget recommendations
        if (incomeAmount > 0) {
          fetchBudgetRecommendations();
        }
      } else {
        setError(response.data?.message || "Could not generate insights");
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setError(error.response?.data?.message || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  // Get budget recommendations
  const fetchBudgetRecommendations = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GET_BUDGET, {
        income: incomeAmount,
        expenses: expenseData,
        financialGoals: "Save money and reduce unnecessary spending",
      });

      if (response.data && response.data.success) {
        setBudgetRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error("Error fetching budget recommendations:", error);
      // Don't set main error since insights might still work
    }
  };

  // Stream insights in real time
  const streamInsights = () => {
    if (expenseData.length === 0) {
      setError("No expense data available for analysis");
      return;
    }

    // Clear previous results
    setStreamedInsights("");
    setStreamLoading(true);
    setError("");

    // Close any existing event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Create a new POST request using fetch API
      fetch(`${API_PATHS.BASE_URL}/api/v1/ai/stream-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          expenses: expenseData,
          timeRange: "the last 30 days",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          function read() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                setStreamLoading(false);
                return;
              }

              const chunk = decoder.decode(value);
              const events = chunk.split("\n\n").filter(Boolean);

              events.forEach((event) => {
                if (event.startsWith("data: ")) {
                  try {
                    const data = JSON.parse(event.slice(6));

                    if (data.error) {
                      setError(data.error);
                      setStreamLoading(false);
                    } else if (data.done) {
                      setStreamLoading(false);
                    } else if (data.content) {
                      setStreamedInsights((prev) => prev + data.content);
                    }
                  } catch (error) {
                    console.error("Error parsing event data:", error);
                  }
                }
              });

              return read();
            });
          }

          return read();
        })
        .catch((error) => {
          console.error("Error streaming insights:", error);
          setError(error.message);
          setStreamLoading(false);
        });
    } catch (error) {
      console.error("Error setting up stream:", error);
      setError(error.message);
      setStreamLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
        AI Financial Insights
      </h1>

      {/* Toggle between streaming and non-streaming */}
      <div className="mb-6 flex items-center">
        <span className="mr-3 text-sm font-medium text-gray-900">Standard</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={useStreaming}
            onChange={() => setUseStreaming(!useStreaming)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="ml-3 text-sm font-medium text-gray-900">
          Streaming (real-time)
        </span>
      </div>

      {/* Action buttons */}
      <div className="mb-6">
        <button
          onClick={useStreaming ? streamInsights : fetchInsights}
          disabled={loading || streamLoading || expenseData.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          {loading || streamLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Insights...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              {useStreaming ? "Stream Insights" : "Generate Insights"}
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">
            Analyzing your financial data...
          </span>
        </div>
      )}

      {/* Streaming insights */}
      {useStreaming && streamedInsights && (
        <div className="mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">
                Streaming Insights
                {streamLoading && (
                  <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />
                )}
              </h2>
            </div>
            <div
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(streamedInsights),
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Standard (non-streaming) content */}
      {!useStreaming && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial insights */}
          {insights && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">Spending Insights</h2>
              </div>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(insights) }}
              ></div>
            </div>
          )}

          {/* Budget recommendations */}
          {budgetRecommendations && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <CircleDollarSign className="w-6 h-6 text-emerald-500 mr-2" />
                <h2 className="text-xl font-semibold">
                  Budget Recommendations
                </h2>
              </div>
              <div
                className="prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(budgetRecommendations),
                }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* No data yet state */}
      {!loading && !error && !insights && !streamedInsights && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-600 mb-4">
            {expenseData.length === 0
              ? "No expense data available. Add some expenses to get insights."
              : "Click the button above to generate AI insights about your finances."}
          </p>
        </div>
      )}
    </div>
  );
}
