import React, { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, CircleDollarSign, Lightbulb, Loader2, RefreshCw, BarChart3, AlertCircle, ArrowRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Markdown parser converting bold, headings, and bullets to clean styled elements
const parseMarkdown = (text) => {
  if (!text) return "";

  const boldParsed = text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="text-slate-900 font-bold">$1</strong>'
  );

  const headingsParsed = boldParsed
    .replace(/^# (.*?)$/gm, '<h2 class="text-xl font-extrabold text-slate-900 mt-5 mb-2.5">$1</h2>')
    .replace(/^## (.*?)$/gm, '<h3 class="text-base font-bold text-emerald-800 mt-4 mb-2 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>$1</h3>')
    .replace(/^### (.*?)$/gm, '<h4 class="text-sm font-semibold text-slate-800 mt-3 mb-1.5">$1</h4>');

  const bulletsParsed = headingsParsed.replace(
    /^- (.*?)$/gm,
    '<div class="flex items-start gap-2 my-1.5 text-xs sm:text-sm text-slate-600"><span class="text-emerald-500 font-bold mt-0.5">•</span><span>$1</span></div>'
  );

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

  useEffect(() => {
    fetchDashboardData();

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
        const expenses = response.data.last30DaysExpenses?.transactions || [];
        setExpenseData(expenses);
        setIncomeAmount(response.data.totalIncome || 0);
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError("Failed to fetch spending data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (expenseData.length === 0) {
      setError("Please add some expenses before generating insights.");
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

        if (incomeAmount > 0) {
          fetchBudgetRecommendations();
        }
      } else {
        setError(response.data?.message || "Could not generate insights");
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError(
        err.response?.data?.message ||
          "AI advisor could not analyze data. Ensure PERPLEXITY_API_KEY is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetRecommendations = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GET_BUDGET, {
        income: incomeAmount,
        expenses: expenseData,
        financialGoals: "Maximize savings and eliminate unnecessary recurring expenses",
      });

      if (response.data && response.data.success) {
        setBudgetRecommendations(response.data.recommendations);
      }
    } catch (err) {
      console.error("Error fetching budget recommendations:", err);
    }
  };

  const streamInsights = () => {
    if (expenseData.length === 0) {
      setError("Please add some expenses before streaming insights.");
      return;
    }

    setStreamedInsights("");
    setStreamLoading(true);
    setError("");

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
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
                  } catch (e) {
                    console.error("Stream parse error:", e);
                  }
                }
              });

              return read();
            });
          }

          return read();
        })
        .catch((err) => {
          console.error("Error streaming insights:", err);
          setError(err.message || "Failed to stream insights");
          setStreamLoading(false);
        });
    } catch (err) {
      console.error("Stream init error:", err);
      setError(err.message);
      setStreamLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Financial Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Financial Advisor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Synthesizes your real-time expenses and cash inflows to recommend
              personalized savings opportunities and 50/30/20 budget allocations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={useStreaming ? streamInsights : fetchInsights}
              disabled={loading || streamLoading || expenseData.length === 0}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading || streamLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Insights...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>{useStreaming ? "Stream Insights" : "Generate Analysis"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Response Mode:</span>
            <button
              onClick={() => setUseStreaming(false)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                !useStreaming
                  ? "bg-white/15 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Comprehensive
            </button>
            <button
              onClick={() => setUseStreaming(true)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                useStreaming
                  ? "bg-white/15 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Real-time Stream
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Analyzing {expenseData.length} recent transactions
          </span>
        </div>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Advisor Notice</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {(loading || streamLoading) && !error && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 text-center py-12 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Evaluating Spending Habits...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Our AI model is calculating category ratios and detecting recurring anomalies.
          </p>
        </div>
      )}

      {/* Streaming View */}
      {useStreaming && streamedInsights && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Live AI Output</h2>
              <p className="text-[11px] text-slate-400">Streamed response from Perplexity Sonar</p>
            </div>
          </div>
          <div
            className="prose prose-sm prose-slate max-w-none space-y-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(streamedInsights) }}
          />
        </div>
      )}

      {/* Standard Dual Card Output View */}
      {!useStreaming && (insights || budgetRecommendations) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Spending Patterns</h2>
                    <p className="text-[11px] text-slate-400">Category analysis & habits</p>
                  </div>
                </div>
                <div
                  className="prose prose-sm prose-slate max-w-none space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(insights) }}
                />
              </div>
            </div>
          )}

          {budgetRecommendations && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Budget Blueprint</h2>
                    <p className="text-[11px] text-slate-400">Personalized target allocations</p>
                  </div>
                </div>
                <div
                  className="prose prose-sm prose-slate max-w-none space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(budgetRecommendations) }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State Banner */}
      {!loading && !streamLoading && !error && !insights && !streamedInsights && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200/80 text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lightbulb className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Ready to Analyze Your Money</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {expenseData.length === 0
              ? "No expenses found in the last 30 days. Add some expenses first to generate personalized budgeting blueprints."
              : "Click 'Generate Analysis' above to request AI-driven insights on your spending."}
          </p>
        </div>
      )}
    </div>
  );
}
