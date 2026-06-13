import { useEffect, useState } from "react";
import { transactionApi } from "../services/transactionApi.js";
import { formatCurrency } from "../utils/currency.js";

const typeOptions = ["income", "expense"];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", type: "", category: "" });
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const loadTransactions = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.search ? { search: filters.search } : {}),
      };
      const data = await transactionApi.getTransactions(params);
      setTransactions(data);
    } catch (err) {
      setError(err.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    loadTransactions();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await transactionApi.createTransaction({
        ...newTransaction,
        amount: Number(newTransaction.amount),
      });
      setNewTransaction((prev) => ({ ...prev, title: "", amount: "", category: "", note: "" }));
      await loadTransactions();
    } catch (err) {
      setError(err.message || "Unable to create transaction.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await transactionApi.deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      setError(err.message || "Unable to delete transaction.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <p className="mt-2 text-slate-600">Create and review your latest income and expenses.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">New transaction</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Title</span>
                <input
                  value={newTransaction.title}
                  onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Amount</span>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm text-slate-600">Type</span>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Category</span>
                <input
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Date</span>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Note</span>
              <textarea
                value={newTransaction.note}
                onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                rows={3}
              />
            </label>
            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Add transaction
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <form onSubmit={applyFilters} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Search</span>
                <input
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder="Search titles"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Type</span>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <option value="">All</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Category</span>
              <input
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Category name"
              />
            </label>
            <button className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Apply filters
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent transactions</h2>
        {loading ? (
          <p className="mt-4 text-slate-500">Loading transactions...</p>
        ) : error ? (
          <p className="mt-4 text-red-600">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="mt-4 text-slate-600">No transactions found.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{transaction.title}</p>
                    <p className="text-sm text-slate-600">{transaction.category || "No category"}</p>
                  </div>
                  <p className={`text-sm font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  <span>{transaction.note || "No note"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(transaction.id)}
                    className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
