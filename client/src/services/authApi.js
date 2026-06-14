import { buildHeaders, buildFormDataHeaders, fetchJson } from "./api.js";

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

export const updateProfile = async (fullname, email) => {
  return fetchJson("/auth/profile", {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify({ fullname, email }),
  });
};

export const updatePassword = async (currentPassword, newPassword) => {
  return fetchJson("/auth/password", {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const uploadAvatar = async (formData) => {
  return fetchJson("/auth/avatar", {
    method: "POST",
    headers: buildFormDataHeaders(true),
    body: formData,
  });
};
