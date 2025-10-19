import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import StarRating from "./StarRating";

export default function UserReviews({ userId }) {
  const [items, setItems] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api(`/api/reviews/user/${userId}`);
      setItems(res || []);
      if (res?.length) {
        const a =
          res.reduce((s, r) => s + Number(r.rating || 0), 0) / res.length;
        setAvg(a.toFixed(2));
      } else setAvg(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  if (loading) return <div className="muted">Duke ngarkuar reviews…</div>;

  return (
    <div className="stack-md">
      <div className="row" style={{ alignItems: "center", gap: ".6rem" }}>
        <strong>⭐ Reviews</strong>
        {avg && (
          <span className="muted">
            Mesatare: {avg} / 5 ({items.length})
          </span>
        )}
      </div>
      {!items || items.length === 0 ? (
        <div className="muted">S’ka ende vlerësime.</div>
      ) : (
        <div className="grid grid--2">
          {items.map((r) => (
            <div key={r._id} className="card">
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="row" style={{ gap: ".5rem" }}>
                  <StarRating value={r.rating} readOnly size={18} />
                  <span className="muted" style={{ fontSize: ".9rem" }}>
                    nga {r.from?.name || "User"}
                  </span>
                </div>
                <span className="muted" style={{ fontSize: ".85rem" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {r.comment && (
                <p style={{ marginTop: ".6rem", whiteSpace: "pre-wrap" }}>
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
