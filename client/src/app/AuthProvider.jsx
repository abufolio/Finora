import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, removeToken, setToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  useEffect(() => {
    if (token) {
      setToken(token);
    } else {
      removeToken();
    }
  }, [token]);

  const login = (newToken) => {
    setTokenState(newToken);
  };

  const logout = () => {
    setTokenState(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
