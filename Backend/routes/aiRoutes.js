const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getFinancialInsights,
  getBudgetRecommendations,
  streamFinancialInsights,
} = require("../controllers/aiController");

// @route   POST /api/v1/ai/insights
// @desc    Get AI-generated financial insights
// @access  Private
router.post("/insights", protect, getFinancialInsights);

// @route   POST /api/v1/ai/budget
// @desc    Get AI-generated budget recommendations
// @access  Private
router.post("/budget", protect, getBudgetRecommendations);

// @route   POST /api/v1/ai/stream-insights
// @desc    Stream AI-generated financial insights in real-time
// @access  Private
router.post("/stream-insights", protect, streamFinancialInsights);

module.exports = router;
