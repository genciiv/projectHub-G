// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ngarko sesionin
  useEffect(() => {
    (async () => {
      try {
        const me = await api("/api/auth/me");
        setUser(me); // me._id duhet të ekzistojë
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const res = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // pas login, rimerr /me që të kemi objektin e plotë
    const me = await api("/api/auth/me").catch(() => res);
    setUser(me);
    return me;
  }

  async function register({ name, email, password, role = "Freelancer" }) {
    await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    return await login(email, password);
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
