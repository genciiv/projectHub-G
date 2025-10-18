import React, { useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function PostProject() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    skills: "",
    deadline: "",
  });
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        budgetMin: Number(form.budgetMin || 0),
        budgetMax: Number(form.budgetMax || 0),
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        deadline: form.deadline || undefined,
      };
      const p = await api("/api/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      nav(`/projects/${p._id}`);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginBottom: ".6rem" }}>Posto projekt</h2>
        {err && (
          <div
            className="alert alert--danger"
            style={{ marginBottom: ".6rem" }}
          >
            {err}
          </div>
        )}
        <form className="form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Titulli"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input"
            rows="6"
            placeholder="Përshkrimi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: ".6rem",
            }}
          >
            <input
              className="input"
              type="number"
              placeholder="Budget min €"
              value={form.budgetMin}
              onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Budget max €"
              value={form.budgetMax}
              onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Skills (comma)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <button className="btn" type="submit">
            Publiko
          </button>
        </form>
      </div>
    </div>
  );
}
