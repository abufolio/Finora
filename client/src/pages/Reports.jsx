import { useEffect } from "react";
import { useReduxAnalytics } from "../hooks/useReduxAnalytics.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../utils/currency.js";

const COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function Reports() {
  const { summary, isLoading, error, loadSummary } = useReduxAnalytics();

  useEffect(() => {
    loadSummary();
  }, []);

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">Loading reports...</div>
    );
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!summary) return null;

  const { expenseByCategory = [], incomeByCategory = [] } = summary;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Financial Reports
        </h1>
        <p className="mt-2 text-slate-600">
          Visual breakdown of your income and expenses.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expenses Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Expenses by Category
          </h2>
          {expenseByCategory.length > 0 ? (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 text-slate-500">No expense data available.</p>
          )}
        </div>

        {/* Income Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Income by Category
          </h2>
          {incomeByCategory.length > 0 ? (
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 text-slate-500">No income data available.</p>
          )}
        </div>
      </div>

      {/* Overview Bar Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Income vs Expense
        </h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Income", value: summary.income, fill: "#10b981" },
                { name: "Expense", value: summary.expense, fill: "#f43f5e" },
              ]}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {[0, 1].map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#10b981" : "#f43f5e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
