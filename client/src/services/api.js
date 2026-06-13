const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "finance_manager_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const buildHeaders = (includeAuth = true) => {
  const headers = { "Content-Type": "application/json" };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || response.statusText || "Request failed";
    throw new Error(message);
  }
  return body;
};
