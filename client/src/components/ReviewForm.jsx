import React, { useState } from "react";
import { api } from "../utils/api";
import StarRating from "./StarRating";

export default function ReviewForm({ projectId, toUserId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setOk("");
    try {
      await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ projectId, to: toUserId, rating, comment }),
      });
      setOk("Review u dërgua. Faleminderit!");
      setComment("");
      onSubmitted?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: ".6rem" }}>Lër një vlerësim</h3>
      {err && (
        <div className="alert alert--danger" style={{ marginBottom: ".6rem" }}>
          {err}
        </div>
      )}
      {ok && (
        <div className="alert" style={{ marginBottom: ".6rem" }}>
          {ok}
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <label className="label">
          Rating
          <StarRating value={rating} onChange={setRating} />
        </label>
        <label className="label">
          Koment (opsional)
          <textarea
            className="input"
            rows="4"
            placeholder="Si shkoi bashkëpunimi?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button className="btn" type="submit" disabled={busy}>
          Dërgo review
        </button>
      </form>
    </div>
  );
}
