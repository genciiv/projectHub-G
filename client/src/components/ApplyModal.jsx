import React, { useState } from "react";
import { api } from "../utils/api";

export default function ApplyModal({ projectId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    coverLetter: "",
    bidAmount: "",
    etaDays: "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      await api(`/api/${projectId}/apply`, {
        method: "POST",
        body: JSON.stringify({
          coverLetter: form.coverLetter,
          bidAmount: Number(form.bidAmount),
          etaDays: Number(form.etaDays),
        }),
      });
      setOk("Application sent!");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="card"
      style={{
        position: "fixed",
        inset: "20% 50% auto 50%",
        transform: "translateX(-50%)",
        width: "min(560px,90%)",
        zIndex: 10,
      }}
    >
      <h3 style={{ marginBottom: ".5rem" }}>Apply to Project</h3>
      {error && (
        <div className="alert alert--danger" style={{ marginBottom: ".6rem" }}>
          {error}
        </div>
      )}
      {ok && (
        <div className="alert" style={{ marginBottom: ".6rem" }}>
          {ok}
        </div>
      )}
      <form className="form" onSubmit={submit}>
        <textarea
          className="input"
          rows="5"
          placeholder="Cover letter"
          value={form.coverLetter}
          onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
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
            placeholder="Bid €"
            value={form.bidAmount}
            onChange={(e) => setForm({ ...form, bidAmount: e.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            placeholder="ETA days"
            value={form.etaDays}
            onChange={(e) => setForm({ ...form, etaDays: e.target.value })}
            required
          />
        </div>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <button className="btn" type="submit">
            Send
          </button>
          <button className="btn btn--ghost" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
