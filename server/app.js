import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance API is running 🚀" });
});

app.use(errorMiddleware);

export default app;
