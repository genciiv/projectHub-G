// client/src/components/FriendButton.jsx
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function FriendButton({ otherUserId }) {
  const { user } = useAuth();
  const [rel, setRel] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSelf = user?.id === otherUserId;

  async function load() {
    if (!user || !otherUserId) return;
    setLoading(true);
    try {
      const r = await api(`/api/friends/status/${otherUserId}`);
      setRel(r);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [otherUserId, user?.id]);

  if (!user || isSelf) return null;
  if (loading) return <button className="btn btn--outline" disabled>Duke kontrolluar…</button>;

  // pa lidhje ende
  if (!rel) {
    return (
      <button
        className="btn"
        onClick={async () => {
          await api("/api/friends/request", { method:"POST", body: JSON.stringify({ toUserId: otherUserId }) });
          await load();
        }}
      >
        ➕ Shto mik
      </button>
    );
  }

  // ekziston një marrëdhënie
  if (rel.status === "pending") {
    // nëse jam unë që e kam dërguar
    if (rel.from === user.id) {
      return <button className="btn btn--outline" disabled>⌛ Në pritje</button>;
    }
    // nëse tjetri ma ka dërguar mua → prano
    return (
      <button
        className="btn"
        onClick={async () => {
          await api(`/api/friends/${rel._id}/accept`, { method:"POST" });
          await load();
        }}
      >
        ✅ Prano kërkesën
      </button>
    );
  }

  if (rel.status === "accepted") {
    return (
      <button
        className="btn btn--ghost"
        onClick={async () => {
          await api(`/api/friends/${rel._id}`, { method:"DELETE" });
          await load();
        }}
      >
        ❌ Hiq mik
      </button>
    );
  }

  return null;
}
