const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);

    // TOTAL INCOME
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // TOTAL EXPENSE
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // LAST 30 DAYS INCOME
    const last30DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast30Days = last30DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // LAST 30 DAYS EXPENSE
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    //  LAST 5 TRANSACTIONS
    const lastTransactions = [
      ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "expense",
      })),
    ].sort((a, b) => b.date - a.date);

    // SAFE RESPONSE
    return res.status(200).json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last30DaysIncome: {
        total: incomeLast30Days,
        transactions: last30DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
