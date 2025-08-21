import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const isAuthenticated = !!token;

  const saveAuth = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const clearAuth = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async ({ email, username, password, confirmPassword }) => {
    const res = await API.post("/api/user/register", {
      email,
      username,
      password,
      confirmPassword,
    });
    const { token: t, user: u } = res.data;
    saveAuth(t, u);
    return u;
  };

  const login = async ({ email, password }) => {
    const res = await API.post("/api/user/login", { email, password });
    const { token: t, user: u } = res.data;
    saveAuth(t, u);
    return u;
  };

  const logout = () => clearAuth();

  // optional: keep profile in sync
  useEffect(() => {
    const syncProfile = async () => {
      if (!token) return;
      try {
        const res = await API.get("/api/user/profile");
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (e) {
        // token invalid/expired
        clearAuth();
      }
    };
    syncProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ isAuthenticated, token, user, register, login, logout }), [isAuthenticated, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
