import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email.trim(), form.password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card" style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>Hyrje</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Fut kredencialet për të vazhduar.
        </p>
        {error && (
          <div className="alert alert--danger" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Email
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </label>
          <button
            className="btn"
            type="submit"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Hyr
          </button>
        </form>
        <div style={{ marginTop: "1rem" }}>
          S’ke llogari? <Link to="/register">Regjistrohu</Link>
        </div>
      </div>
    </div>
  );
}
