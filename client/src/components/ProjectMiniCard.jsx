export default function ProjectMiniCard({ p }) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".35rem",
        }}
      >
        <strong>{p.title}</strong>
        <span className="muted">{p.status}</span>
      </div>
      <div className="muted" style={{ fontSize: ".9rem" }}>
        Budget: €{p.budgetMin}–€{p.budgetMax}
        {p.skills?.length ? " • " + p.skills.join(" • ") : ""}
      </div>
    </div>
  );
}
