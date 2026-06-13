import Transaction from "../models/Transaction.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, note, date } = req.body;
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      note,
      date,
      userId: req.user.id,
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { category, type, search, page = 1, limit = 10 } = req.query;
    const where = { userId: req.user.id };

    if (category) where.category = category;
    if (type) where.type = type;
    if (search) {
      where.title = { [Op.substring]: search };
    }

    const offset = (page - 1) * limit;
    const transactions = await Transaction.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["date", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });
    if (!transaction) return res.status(404).json({ message: "Not found." });

    await transaction.update(req.body);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });
    if (!transaction) return res.status(404).json({ message: "Not found." });

    await transaction.destroy();
    res.json({ message: "Transaction deleted." });
  } catch (error) {
    next(error);
  }
};
