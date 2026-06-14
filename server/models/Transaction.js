import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    hooks: {
      afterCreate: async (transaction) => {
        if (transaction.type !== "expense") return;
        const Budget = sequelize.models.Budget;
        if (!Budget) return;

        const budget = await Budget.findOne({
          where: { userId: transaction.userId, category: transaction.category },
        });
        if (budget) {
          await budget.increment("spent", { by: transaction.amount });
        }
      },
      afterDestroy: async (transaction) => {
        if (transaction.type !== "expense") return;
        const Budget = sequelize.models.Budget;
        if (!Budget) return;

        const budget = await Budget.findOne({
          where: { userId: transaction.userId, category: transaction.category },
        });
        if (budget) {
          await budget.decrement("spent", { by: transaction.amount });
        }
      },
      afterUpdate: async (transaction) => {
        const Budget = sequelize.models.Budget;
        if (!Budget) return;

        const oldType =
          transaction.previous("type") !== undefined
            ? transaction.previous("type")
            : transaction.type;
        const newType = transaction.type;
        const oldAmount =
          transaction.previous("amount") !== undefined
            ? transaction.previous("amount")
            : transaction.amount;
        const newAmount = transaction.amount;
        const oldCategory =
          transaction.previous("category") !== undefined
            ? transaction.previous("category")
            : transaction.category;
        const newCategory = transaction.category;

        // Revert old impact
        if (oldType === "expense") {
          const oldBudget = await Budget.findOne({
            where: { userId: transaction.userId, category: oldCategory },
          });
          if (oldBudget) {
            await oldBudget.decrement("spent", { by: oldAmount });
          }
        }

        // Apply new impact
        if (newType === "expense") {
          const newBudget = await Budget.findOne({
            where: { userId: transaction.userId, category: newCategory },
          });
          if (newBudget) {
            await newBudget.increment("spent", { by: newAmount });
          }
        }
      },
    },
  },
);

Transaction.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Transaction, { foreignKey: "userId" });

export default Transaction;
