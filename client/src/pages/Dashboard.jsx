import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>Përshëndetje, {user?.name} 👋</h2>
        <p>
          Email: {user?.email} — Roli: {user?.role}
        </p>
        <button className="btn" style={{ marginTop: "1rem" }} onClick={logout}>
          Dil
        </button>
      </div>
    </div>
  );
}
