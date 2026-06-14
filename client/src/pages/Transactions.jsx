import { useEffect, useState } from "react";
import { useReduxTransactions } from "../hooks/useReduxTransactions.js";
import { useDispatch } from "react-redux";
import { clearError } from "../features/transactionSlice.js";
import { formatCurrency } from "../utils/currency.js";
import { getCategoriesByType, ALL_CATEGORIES } from "../utils/categories.js";

const typeOptions = ["income", "expense"];

export default function Transactions() {
  const dispatch = useDispatch();
  const {
    transactions,
    pagination,
    isLoading,
    error,
    loadTransactions,
    add,
    update,
    remove,
  } = useReduxTransactions();

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Tahrirlash (edit) holati: hozir qaysi tranzaksiya tahrirlanayotgani
  // va uning vaqtinchalik (form) qiymatlari
  const [editingId, setEditingId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    const params = {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.search ? { search: filters.search } : {}),
      page,
      limit: 10,
    };
    loadTransactions(params);
  }, [page]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    const params = {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.search ? { search: filters.search } : {}),
      page: 1,
      limit: 10,
    };
    loadTransactions(params);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    dispatch(clearError());
    const result = await add({
      ...newTransaction,
      amount: Number(newTransaction.amount),
    });
    if (!result.error) {
      setNewTransaction((prev) => ({
        ...prev,
        title: "",
        amount: "",
        category: "",
        note: "",
      }));
    }
  };

  const handleDelete = async (id) => {
    dispatch(clearError());
    await remove(id);
  };

  const startEdit = (transaction) => {
    dispatch(clearError());
    setEditingId(transaction.id);
    setEditTransaction({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category || "",
      note: transaction.note || "",
      // DB dan to'liq ISO sana keladi, <input type="date"> "YYYY-MM-DD" kutadi
      date: new Date(transaction.date).toISOString().slice(0, 10),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTransaction(null);
  };

  const handleUpdate = async (event, id) => {
    event.preventDefault();
    dispatch(clearError());
    const result = await update(id, {
      ...editTransaction,
      amount: Number(editTransaction.amount),
    });
    if (!result.error) {
      cancelEdit();
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <p className="mt-2 text-slate-600">
          Create and review your latest income and expenses.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            New transaction
          </h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Title</span>
                <input
                  value={newTransaction.title}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Amount</span>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
                  }
                  list="category-options-new"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
                <datalist id="category-options-new">
                  {getCategoriesByType(newTransaction.type).map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Date</span>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Note</span>
              <textarea
                value={newTransaction.note}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, note: e.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                rows={3}
              />
            </label>
            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
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
                list="category-options-filter"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Category name"
              />
              <datalist id="category-options-filter">
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>
            <button className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Apply filters
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent transactions
          </h2>
          {pagination.totalCount > 0 && (
            <span className="text-sm text-slate-500">
              {pagination.totalCount} total
            </span>
          )}
        </div>

        {isLoading && transactions.length === 0 ? (
          <p className="mt-4 text-slate-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          error ? (
            <p className="mt-4 text-red-600">{error}</p>
          ) : (
            <p className="mt-4 text-slate-600">No transactions found.</p>
          )
        ) : (
          <div className="mt-4 space-y-3">
            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {transactions.map((transaction) =>
              editingId === transaction.id ? (
                <form
                  key={transaction.id}
                  onSubmit={(e) => handleUpdate(e, transaction.id)}
                  className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs text-slate-600">Title</span>
                      <input
                        value={editTransaction.title}
                        onChange={(e) =>
                          setEditTransaction({
                            ...editTransaction,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-600">Amount</span>
                      <input
                        type="number"
                        value={editTransaction.amount}
                        onChange={(e) =>
                          setEditTransaction({
                            ...editTransaction,
                            amount: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="block">
                      <span className="text-xs text-slate-600">Type</span>
                      <select
                        value={editTransaction.type}
                        onChange={(e) =>
                          setEditTransaction({
                            ...editTransaction,
                            type: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      >
                        {typeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-600">Category</span>
                      <input
                        value={editTransaction.category}
                        onChange={(e) =>
                          setEditTransaction({
                            ...editTransaction,
                            category: e.target.value,
                          })
                        }
                        list="category-options-edit"
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      />
                      <datalist id="category-options-edit">
                        {getCategoriesByType(editTransaction.type).map(
                          (cat) => (
                            <option key={cat} value={cat} />
                          ),
                        )}
                      </datalist>
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-600">Date</span>
                      <input
                        type="date"
                        value={editTransaction.date}
                        onChange={(e) =>
                          setEditTransaction({
                            ...editTransaction,
                            date: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs text-slate-600">Note</span>
                    <textarea
                      value={editTransaction.note}
                      onChange={(e) =>
                        setEditTransaction({
                          ...editTransaction,
                          note: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                      rows={2}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  key={transaction.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {transaction.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {transaction.category || "No category"}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <span>{transaction.note || "No note"}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(transaction)}
                      className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages || isLoading}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
