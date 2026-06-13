import { buildHeaders, fetchJson } from "./api.js";

export const authApi = {
  login: async (credentials) => {
    return fetchJson("/auth/login", {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify(credentials),
    });
  },

  register: async (data) => {
    return fetchJson("/auth/register", {
      method: "POST",
      headers: buildHeaders(false),
      body: JSON.stringify(data),
    });
  },
};
