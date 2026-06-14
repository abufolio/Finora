import { useEffect, useState } from "react";
import { useReduxBudgets } from "../hooks/useReduxBudgets.js";
import { useDispatch } from "react-redux";
import { clearError } from "../features/budgetSlice.js";
import { formatCurrency } from "../utils/currency.js";

export default function Budgets() {
  const dispatch = useDispatch();
  const { budgets, isLoading, error, loadBudgets, add, remove } = useReduxBudgets();
  const [newBudget, setNewBudget] = useState({ category: "", limit: "" });

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    dispatch(clearError());
    const result = await add({
      category: newBudget.category,
      limit: Number(newBudget.limit),
    });
    if (!result.error) {
      setNewBudget({ category: "", limit: "" });
    }
  };

  const handleDelete = async (id) => {
    dispatch(clearError());
    await remove(id);
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
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Add budget
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Current budgets</h2>
          {isLoading ? (
            <p className="mt-4 text-slate-500">Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <p className="mt-4 text-slate-600">No budgets created yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {budgets.map((budget) => {
                const pct = budget.limit > 0 ? Math.min(100, (budget.spent / budget.limit) * 100) : 0;
                const isOver = pct >= 100;
                return (
                  <div key={budget.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{budget.category}</p>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(budget.spent || 0)} / {formatCurrency(budget.limit)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(budget.id)}
                        className="rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full transition-all ${isOver ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className={`mt-1 text-xs ${isOver ? "text-rose-600" : "text-slate-500"}`}>
                      {pct.toFixed(0)}% used {isOver ? "— over budget!" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
