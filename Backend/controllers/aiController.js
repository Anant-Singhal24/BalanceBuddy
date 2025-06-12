const { OpenAI } = require("openai");

// Load API key from environment variables
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || "your_api_key";

// Create OpenAI client instance configured for Perplexity API
const client = new OpenAI({
  apiKey: PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
  timeout: 60000, // 60 seconds timeout
});

/**
 * Generate financial insights from expense data
 * @route POST /api/v1/ai/insights
 * @access Private
 */
exports.getFinancialInsights = async (req, res) => {
  try {
    const { expenses, timeRange } = req.body;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid expense data is required",
      });
    }

    // Format expenses data for analysis
    const formattedData = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }));

    // Enhanced prompt for better formatting
    const messages = [
      {
        role: "system",
        content: `You are a financial analyst specializing in personal finance. 
        Provide clear, actionable insights based on spending data with proper formatting.
        
        FORMAT YOUR RESPONSE AS FOLLOWS:
        
        # Expense Analysis: ${timeRange || "Recent Period"}
        
        ## Top Spending Categories
        - List the top 3-5 categories in bullet points
        - Format as "**Category Name**: $Amount (Percentage of total)"
        
        ## Spending Patterns
        - Identify 3-5 key patterns in bullet points
        - Each bullet should start with a bold highlight
        
        ## Saving Opportunities
        - List 2-4 specific opportunities in bullet points
        - Format as "**Area**: Recommendation"
        
        ## Specific, Actionable Advice
        - Provide 3-5 concrete actions in bullet points
        - Format as "**Action Item**: Detailed explanation"
        
        Keep your analysis concise, practical, and focused on the most impactful insights.`,
      },
      {
        role: "user",
        content: `Analyze these expenses from ${
          timeRange || "the recent period"
        } and provide financial insights following the exact format specified:
        ${JSON.stringify(formattedData)}`,
      },
    ];

    console.log("Requesting financial insights from Perplexity API...");

    // Call the Perplexity API (no streaming)
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    // Return the AI response
    return res.status(200).json({
      success: true,
      insights: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Insights API Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get insights",
      error: error.toString(),
    });
  }
};

/**
 * Generate budget recommendations
 * @route POST /api/v1/ai/budget
 * @access Private
 */
exports.getBudgetRecommendations = async (req, res) => {
  try {
    const { income, expenses, financialGoals } = req.body;

    if (!income || !Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: "Income and expense data are required",
      });
    }

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Organize expenses by category
    const expensesByCategory = {};
    expenses.forEach((expense) => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += expense.amount;
    });

    // Enhanced prompt for better budget recommendations with formatting
    const messages = [
      {
        role: "system",
        content: `You are a budget planning assistant. Create personalized budget plans with clear formatting.
        
        FORMAT YOUR RESPONSE AS FOLLOWS:
        
        # Personalized Budget Plan
        
        ## Recommended Budget Allocation
        - Format each category as "**Category (Percentage Range)**: $Amount Range - Description"
        - List major budget categories: Housing, Utilities, Food, Transportation, etc.
        - Include dollar amounts based on the income
        
        ## Areas to Reduce Spending
        - List 3-5 specific areas as numbered items
        - Start each with a bold action item
        
        ## Savings Recommendations
        - Suggest savings allocation as "**50/30/20 Rule**" or similar framework
        - Break down savings priorities in bullet points
        - Format as "**Priority**: Explanation"
        
        ## Tips for Financial Goals
        - Provide 3-5 actionable tips as bullet points
        - Format as "**Tip**: Detailed explanation"
        
        Keep your recommendations practical, specific, and tailored to the user's situation.`,
      },
      {
        role: "user",
        content: `Create a budget plan with the following information, following the exact format specified:
        
        Monthly Income: $${income}
        Total Monthly Expenses: $${totalExpenses}
        Expenses by Category: ${JSON.stringify(expensesByCategory)}
        Financial Goals: ${
          financialGoals || "Build savings and reduce unnecessary expenses"
        }`,
      },
    ];

    console.log("Requesting budget recommendations from Perplexity API...");

    // Call the Perplexity API (no streaming)
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return the AI response
    return res.status(200).json({
      success: true,
      recommendations: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Budget API Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get budget recommendations",
      error: error.toString(),
    });
  }
};

/**
 * Generate financial insights with streaming (for real-time updates)
 * @route POST /api/v1/ai/stream-insights
 * @access Private
 */
exports.streamFinancialInsights = async (req, res) => {
  try {
    const { expenses, timeRange } = req.body;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid expense data is required",
      });
    }

    // Format data (simplified for streaming to reduce processing time)
    const formattedData = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
    }));

    // Enhanced prompt for streaming with structured output
    const messages = [
      {
        role: "system",
        content: `You are a financial insights assistant providing real-time analysis.
        
        FORMAT YOUR RESPONSE AS FOLLOWS:
        
        # Quick Financial Analysis
        
        ## Spending Overview
        - Summarize key spending trends with proper formatting
        - Use bold for important terms and categories
        
        ## Recommendations
        - Provide 2-3 clear, actionable recommendations
        - Format as "**Recommendation**: Details"
        
        Keep your analysis concise and focused, as this is being streamed to the user in real-time.`,
      },
      {
        role: "user",
        content: `Analyze these expenses and provide quick insights with proper formatting: ${JSON.stringify(
          formattedData
        )}`,
      },
    ];

    // Set up response for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("Starting streaming response from Perplexity API...");

    // Call the Perplexity API with streaming
    const stream = await client.chat.completions.create({
      model: "sonar-pro",
      messages: messages,
      stream: true,
      temperature: 0.7,
    });

    // Send each chunk as it arrives
    let responseText = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      responseText += content;

      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    console.log("Streaming completed");
    res.write(
      `data: ${JSON.stringify({ done: true, fullResponse: responseText })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("Streaming API Error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
