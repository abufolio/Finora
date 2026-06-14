import express from "express";
import sequelize from "../config/db.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    // 1. Umumiy daromad va xarajatni olish
    const typeTotals = await Transaction.findAll({
      attributes: [
        "type",
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      where: { userId: req.user.id },
      group: ["type"],
      raw: true,
    });

    let income = 0;
    let expense = 0;

    typeTotals.forEach((item) => {
      if (item.type === "income") income = Number(item.total) || 0;
      if (item.type === "expense") expense = Number(item.total) || 0;
    });

    const balance = income - expense;

    // 2. Kategoriyalar bo'yicha yig'indilarni olish
    const categoryTotals = await Transaction.findAll({
      attributes: [
        "type",
        "category",
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      where: { userId: req.user.id },
      group: ["type", "category"],
      raw: true,
    });

    const expenseByCategory = categoryTotals
      .filter((item) => item.type === "expense")
      .map((item) => ({
        name: item.category || "Uncategorized",
        value: Number(item.total) || 0,
      }));

    const incomeByCategory = categoryTotals
      .filter((item) => item.type === "income")
      .map((item) => ({
        name: item.category || "Uncategorized",
        value: Number(item.total) || 0,
      }));

    res.json({
      balance,
      income,
      expense,
      expenseByCategory,
      incomeByCategory,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
