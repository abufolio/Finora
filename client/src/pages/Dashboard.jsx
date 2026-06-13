import { useEffect, useState } from "react";
import { analyticsApi } from "../services/analyticsApi.js";
import { formatCurrency } from "../utils/currency.js";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setError("");
      setLoading(true);
      try {
        const data = await analyticsApi.getSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message || "Unable to load summary.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Your latest financial summary is shown below.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading analytics...</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[.2em] text-slate-500">Balance</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(summary.balance)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[.2em] text-slate-500">Income</p>
            <p className="mt-4 text-3xl font-semibold text-emerald-600">{formatCurrency(summary.income)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[.2em] text-slate-500">Expense</p>
            <p className="mt-4 text-3xl font-semibold text-rose-600">{formatCurrency(summary.expense)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[.2em] text-slate-500">Savings</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(summary.savings)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
