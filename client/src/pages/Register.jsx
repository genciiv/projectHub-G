// client/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Freelancer", // ose "Client" nëse ke dy role
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await register(form);        // <<< këtu thirret nga AuthContext
      nav("/");                    // pas suksesit kthehu në Home (ose /dashboard)
    } catch (e) {
      setErr(e.message || "Gabim regjistrimi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 580 }}>
      <div className="card card--hoverable" style={{ marginTop: "1rem" }}>
        <h2 className="card__title">Regjistrim</h2>
        <p className="muted">Krijo një llogari për të postuar ose aplikuar në projekte.</p>

        {err && (
          <div className="alert alert--danger" style={{ marginTop: ".8rem" }}>
            {err}
          </div>
        )}

        <form className="form" onSubmit={submit} style={{ marginTop: ".8rem" }}>
          <input
            className="input"
            placeholder="Emri i plotë"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Fjalëkalimi"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <label className="label">
            Roli
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Freelancer</option>
              <option>Client</option>
            </select>
          </label>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Duke krijuar…" : "Krijo llogari"}
          </button>
        </form>
      </div>
    </div>
  );
}
