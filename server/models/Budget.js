import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Budget = sequelize.define("Budget", {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  limit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  spent: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

Budget.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Budget, { foreignKey: "userId" });

export default Budget;
