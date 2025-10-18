import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({ p }) {
  return (
    <div className="card">
      <h3 className="card__title">{p.title}</h3>
      <p className="muted" style={{ margin: ".25rem 0 .6rem" }}>
        {p.skills?.join(" • ") || "No skills"}
      </p>
      <p style={{ marginBottom: ".6rem" }}>
        {p.description.slice(0, 120)}
        {p.description.length > 120 ? "..." : ""}
      </p>
      <div
        className="muted"
        style={{ display: "flex", gap: "1rem", marginBottom: ".75rem" }}
      >
        <span>
          Budget: €{p.budgetMin}–€{p.budgetMax}
        </span>
        <span>Status: {p.status}</span>
      </div>
      <Link className="btn" to={`/projects/${p._id}`}>
        View
      </Link>
    </div>
  );
}
