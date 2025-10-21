// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Ngarko seancën në hyrje të aplikacionit
  useEffect(() => {
    (async () => {
      try {
        const me = await api("/api/auth/me");
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // ==== FUNKSIONE AUTH ====
  async function login(email, password) {
    // kthen user ose hedh error
    const res = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // disa backend-e kthejnë vetëm {id,name}; për siguri, rimerr /me
    const me = await api("/api/auth/me").catch(() => res);
    setUser(me);
    return me;
  }

  async function register({ name, email, password, role }) {
    await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    // auto-login pas regjistrimit
    return await login(email, password);
  }

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
  }

  const value = { user, setUser, ready, login, register, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
