import { fetchJson, buildHeaders } from "./api.js";

export const analyticsApi = {
  getSummary: async () => {
    return await fetchJson("/analytics", {
      method: "GET",
      headers: buildHeaders(),
    });
  },
};
