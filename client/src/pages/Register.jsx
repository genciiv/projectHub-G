import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card" style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>Regjistrim</h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Krijo një llogari për të postuar ose aplikuar në projekte.
        </p>
        {error && (
          <div className="alert alert--danger" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Emri i plotë
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

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
            Fjalëkalimi
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </label>

          <label className="label">
            Roli
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </label>

          <button
            className="btn"
            type="submit"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Krijo llogari
          </button>
        </form>

        <div style={{ marginTop: "1rem" }}>
          Ke llogari? <Link to="/login">Hyr këtu</Link>
        </div>
      </div>
    </div>
  );
}
