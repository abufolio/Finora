import Budget from "../models/Budget.js";

export const createBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;
    const budget = await Budget.create({
      category,
      limit,
      userId: req.user.id,
    });
    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user.id },
      order: [["category", "ASC"]],
    });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!budget) return res.status(404).json({ message: "Not found." });

    await budget.update(req.body);
    res.json(budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!budget) return res.status(404).json({ message: "Not found." });

    await budget.destroy();
    res.json({ message: "Budget deleted." });
  } catch (error) {
    next(error);
  }
};
