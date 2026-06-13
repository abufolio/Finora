import { fetchJson, buildHeaders } from "./api.js";

export const budgetApi = {
  getBudgets: async () => {
    return fetchJson("/budgets", {
      method: "GET",
      headers: buildHeaders(),
    });
  },

  createBudget: async (budget) => {
    return fetchJson("/budgets", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(budget),
    });
  },

  updateBudget: async (id, budget) => {
    return fetchJson(`/budgets/${id}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(budget),
    });
  },

  deleteBudget: async (id) => {
    return fetchJson(`/budgets/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  },
};
