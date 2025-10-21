// client/src/components/FollowButton.jsx
import { useState } from "react";
import { api } from "../utils/api";

export default function FollowButton({ userId, following = false, onDone }) {
  const [busy, setBusy] = useState(false);

  async function follow() {
    setBusy(true);
    try {
      await api(`/api/social/follow/${userId}`, { method: "POST" });
      onDone?.();
    } finally { setBusy(false); }
  }

  async function unfollow() {
    setBusy(true);
    try {
      await api(`/api/social/follow/${userId}`, { method: "DELETE" });
      onDone?.();
    } finally { setBusy(false); }
  }

  // Nuk e dimë saktë në këtë listë nëse e ndjekim, kështu default “Follow”
  return (
    <button className="btn btn--outline" onClick={follow} disabled={busy}>
      {busy ? "..." : "Follow"}
    </button>
  );
}
