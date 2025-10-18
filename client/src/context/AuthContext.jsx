import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, name, email, role}
  const [loading, setLoading] = useState(true); // për /me në mount

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await api("/api/auth/me");
        if (mounted) setUser(me);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  async function login(email, password) {
    const { user } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(user);
    return user;
  }

  async function register(payload) {
    await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // pas register → auto-login për komoditet (opsionale)
    return login(payload.email, payload.password);
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
