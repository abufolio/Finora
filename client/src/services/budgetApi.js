import { fetchJson, buildHeaders } from "./api.js";

export const getBudgets = async () => {
  return fetchJson("/budgets", {
    method: "GET",
    headers: buildHeaders(),
  });
};

export const createBudget = async (budget) => {
  return fetchJson("/budgets", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(budget),
  });
};

export const updateBudget = async (id, budget) => {
  return fetchJson(`/budgets/${id}`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(budget),
  });
};

export const deleteBudget = async (id) => {
  return fetchJson(`/budgets/${id}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });
};
