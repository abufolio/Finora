import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
    });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = income - expense;
    const savings = balance;

    res.json({ balance, income, expense, savings });
  } catch (error) {
    next(error);
  }
});

export default router;
