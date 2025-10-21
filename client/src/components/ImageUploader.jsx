// client/src/components/ImageUploader.jsx
import { useRef, useState } from "react";
import { api } from "../utils/api";

export default function ImageUploader({ value, onChange, label = "Imazh (opsionale)" }) {
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads/image", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload dështoi");
      onChange?.(data.url);
    } catch (e) {
      setErr(e.message || "Gabim gjatë ngarkimit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="uploader">
      <label className="label">{label}</label>
      {value ? (
        <div className="row" style={{ gap: ".6rem", alignItems: "center" }}>
          <img src={value} alt="" style={{ width: 96, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
          <button type="button" className="btn btn--outline" onClick={() => onChange?.("")}>
            Hiq
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Duke ngarkuar…" : "Zgjidh imazh"}
        </button>
      )}
      {err && <div className="alert alert--danger" style={{ marginTop: ".4rem" }}>{err}</div>}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </div>
  );
}
