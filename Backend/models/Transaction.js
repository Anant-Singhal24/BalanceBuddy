const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Each transaction belongs to a user
  },
  description: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to the current date
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
