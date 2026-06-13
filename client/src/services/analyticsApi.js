import { fetchJson, buildHeaders } from "./api.js";

export const getSummary = async () => {
  return fetchJson("/analytics", {
    method: "GET",
    headers: buildHeaders(),
  });
};
