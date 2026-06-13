import { useEffect, useState } from "react";
import { budgetApi } from "../services/budgetApi.js";
import { formatCurrency } from "../utils/currency.js";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBudget, setNewBudget] = useState({ category: "", limit: "" });

  const loadBudgets = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await budgetApi.getBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.message || "Unable to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await budgetApi.createBudget({
        category: newBudget.category,
        limit: Number(newBudget.limit),
      });
      setNewBudget({ category: "", limit: "" });
      await loadBudgets();
    } catch (err) {
      setError(err.message || "Unable to create budget.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await budgetApi.deleteBudget(id);
      setBudgets((current) => current.filter((budget) => budget.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete budget.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Budgets</h1>
        <p className="mt-2 text-slate-600">Manage spending limits for your main categories.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create budget</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <label className="block">
              <span className="text-sm text-slate-600">Category</span>
              <input
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">Limit</span>
              <input
                type="number"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </label>
            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Add budget
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Current budgets</h2>
          {loading ? (
            <p className="mt-4 text-slate-500">Loading budgets...</p>
          ) : error ? (
            <p className="mt-4 text-red-600">{error}</p>
          ) : budgets.length === 0 ? (
            <p className="mt-4 text-slate-600">No budgets created yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {budgets.map((budget) => (
                <div key={budget.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{budget.category}</p>
                      <p className="text-sm text-slate-600">Limit: {formatCurrency(budget.limit)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(budget.id)}
                      className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Spent: {formatCurrency(budget.spent || 0)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
