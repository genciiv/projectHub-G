import { useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileEditor() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: (user?.skills || []).join(", "),
    avatarUrl: user?.avatarUrl || "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const updated = await api("/api/users/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setMsg("Profili u përditësua me sukses.");
      console.log(updated);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: ".6rem" }}>Edit Profile</h3>
      {msg && (
        <div className="alert" style={{ marginBottom: ".6rem" }}>
          {msg}
        </div>
      )}
      {err && (
        <div className="alert alert--danger" style={{ marginBottom: ".6rem" }}>
          {err}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <label className="label">
          Full name
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="label">
          Bio
          <textarea
            className="input"
            rows="5"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </label>
        <label className="label">
          Skills (comma)
          <input
            className="input"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </label>
        <label className="label">
          Avatar URL (optional)
          <input
            className="input"
            value={form.avatarUrl}
            onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
          />
        </label>
        <button className="btn" type="submit">
          Ruaj
        </button>
      </form>
    </div>
  );
}
