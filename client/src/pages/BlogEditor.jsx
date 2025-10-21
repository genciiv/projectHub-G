// client/src/pages/BlogEditor.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import ImageUploader from "../components/ImageUploader";

export default function BlogEditor() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: "",
    published: true,
    coverUrl: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");

    try {
      const payload = {
        title: form.title,
        body: form.body,
        tags: (form.tags || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        published: !!form.published,
        coverUrl: form.coverUrl || "",
      };

      const created = await api("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      nav(`/blog/${created._id}`);
    } catch (e) {
      setErr(e.message || "Gabim gjatë publikimit të postimit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 className="card__title">Shkruaj postim</h2>
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
            Përmbajtja
            <textarea
              className="input"
              rows={10}
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              required
            />
          </label>

          <label className="label">
            Tags (me presje)
            <input
              className="input"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
            />
          </label>

          <label className="row" style={{ justifyContent: "flex-start" }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
            />
            <span>Publiko menjëherë</span>
          </label>

          <ImageUploader
            value={form.coverUrl}
            onChange={(url) => setForm({ ...form, coverUrl: url })}
            label="Cover (opsionale)"
          />

          <div className="row" style={{ gap: ".6rem" }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Duke publikuar…" : "Publiko postimin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
