const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { category, description, amount, date } = req.body;
    const parsedAmount = Number(amount);

    // Validation: Check for missing fields and valid amount
    if (!category || !date || !description || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        message: "All fields are required and amount must be a positive number",
      });
    }

    const newExpense = new Expense({
      userId,
      category,
      description,
      amount: parsedAmount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expense Sources for Authenticated User
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense Source (Scoped to authenticated user to prevent IDOR)
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized to delete" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
