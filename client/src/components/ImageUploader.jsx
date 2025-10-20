import { useState } from "react";
import { api } from "../utils/api";

export default function ImageUploader({ value, onChange, label = "Cover image" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(""); setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);

      // përdor API direkt (pa api() sepse api() vendos Content-Type: json)
      const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${BASE}/api/uploads/image`, {
        method: "POST",
        body: form,
        credentials: "include", // cookie JWT
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");
      onChange?.(data.url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <label className="label">
        {label}
        <input className="input" type="file" accept="image/*" onChange={onFile} disabled={busy} />
      </label>
      {err && <div className="alert alert--danger" style={{ marginTop: ".6rem" }}>{err}</div>}
      {value && (
        <div style={{ marginTop: ".6rem" }}>
          <img src={value} alt="cover" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
        </div>
      )}
    </div>
  );
}
