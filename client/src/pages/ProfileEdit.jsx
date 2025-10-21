// client/src/pages/ProfileEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ImageUploader from "../components/ImageUploader";

export default function ProfileEdit() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", bio: "", avatarUrl: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = user?.id || user?._id;
        const u = await api(`/api/users/${id}`);
        setForm({ name: u.name || "", bio: u.bio || "", avatarUrl: u.avatarUrl || "" });
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const id = user?.id || user?._id;
      await api(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      nav(`/profile/${id}`);
    } catch (e) {
      setErr(e.message || "Gabim gjatë ruajtjes.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) return <div className="container"><div className="card" style={{ marginTop: "1rem" }}>Duhet të hysh.</div></div>;

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 className="card__title">Edit Profile</h2>
        {err && <div className="alert alert--danger" style={{ marginTop: ".6rem" }}>{err}</div>}

        <form className="form" onSubmit={submit} style={{ marginTop: ".6rem" }}>
          <label className="label">
            Emri
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </label>

          <label className="label">
            Bio
            <textarea className="input" rows={5} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </label>

          <ImageUploader
            value={form.avatarUrl}
            onChange={(url) => setForm({ ...form, avatarUrl: url })}
            label="Avatar (opsionale)"
          />

          <div className="row" style={{ gap: ".6rem" }}>
            <button className="btn" type="submit" disabled={busy}>{busy ? "Duke ruajtur…" : "Ruaj"}</button>
            <button className="btn btn--ghost" type="button" onClick={() => nav(-1)}>Anulo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
