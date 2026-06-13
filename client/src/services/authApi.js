import { buildHeaders, fetchJson } from "./api.js";

export const login = async (email, password) => {
  return fetchJson("/auth/login", {
    method: "POST",
    headers: buildHeaders(false),
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (fullname, email, password) => {
  return fetchJson("/auth/register", {
    method: "POST",
    headers: buildHeaders(false),
    body: JSON.stringify({ fullname, email, password }),
  });
};

export const getProfile = async () => {
  return fetchJson("/auth/profile", {
    method: "GET",
    headers: buildHeaders(true),
  });
};
