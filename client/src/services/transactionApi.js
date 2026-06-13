import { fetchJson, buildHeaders } from "./api.js";

export const transactionApi = {
  getTransactions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/transactions?${query}`, {
      method: "GET",
      headers: buildHeaders(),
    });
  },

  createTransaction: async (transaction) => {
    return fetchJson("/transactions", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(transaction),
    });
  },

  updateTransaction: async (id, transaction) => {
    return fetchJson(`/transactions/${id}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(transaction),
    });
  },

  deleteTransaction: async (id) => {
    return fetchJson(`/transactions/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  },
};
