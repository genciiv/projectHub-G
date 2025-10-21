// client/src/pages/PostProject.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import ImageUploader from "../components/ImageUploader";

export default function PostProject() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
    coverUrl: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");

    try {
      // backendi pret p.sh. {title, description, budget, skills:[]}
      const payload = {
        title: form.title,
        description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
        skills: (form.skills || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        coverUrl: form.coverUrl || "",
      };

      const created = await api("/api/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      nav(`/projects/${created._id}`);
    } catch (e) {
      setErr(e.message || "Gabim gjatë publikimit të projektit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 className="card__title">Posto një projekt</h2>
        {err && <div className="alert alert--danger" style={{ marginTop: ".6rem" }}>{err}</div>}

        <form className="form" onSubmit={submit} style={{ marginTop: ".6rem" }}>
          <label className="label">
            Titulli
            <input
              className="input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="label">
            Përshkrimi
            <textarea
              className="input"
              rows={6}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </label>

          <label className="label">
            Buxheti (opsional)
            <input
              className="input"
              type="number"
              min="0"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
            />
          </label>

          <label className="label">
            Skills (me presje) – p.sh. react, node, css
            <input
              className="input"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
            />
          </label>

          <ImageUploader
            value={form.coverUrl}
            onChange={(url) => setForm({ ...form, coverUrl: url })}
            label="Cover (opsionale)"
          />

          <div className="row" style={{ gap: ".6rem" }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Duke publikuar…" : "Publiko projektin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
