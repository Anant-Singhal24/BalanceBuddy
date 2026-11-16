const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { source, description, amount, date } = req.body;
    const parsedAmount = Number(amount);

    // Validation: Check for missing fields and valid amount
    if (!source || !date || !description || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        message: "All fields are required and amount must be a positive number",
      });
    }

    const newIncome = new Income({
      userId,
      source,
      description,
      amount: parsedAmount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income Sources for Authenticated User
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income Source (Scoped to authenticated user to prevent IDOR)
exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedIncome) {
      return res
        .status(404)
        .json({ message: "Income not found or unauthorized to delete" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
