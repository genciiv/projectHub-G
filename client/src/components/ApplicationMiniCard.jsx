export default function ApplicationMiniCard({ a }) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".35rem",
        }}
      >
        <strong>{a.project?.title || "Project"}</strong>
        <span className="muted">{a.status}</span>
      </div>
      <div
        className="muted"
        style={{ fontSize: ".9rem", marginBottom: ".4rem" }}
      >
        Bid: €{a.bidAmount} • ETA: {a.etaDays}d • {a.project?.status}
      </div>
      <p style={{ whiteSpace: "pre-wrap" }}>{a.coverLetter}</p>
    </div>
  );
}
