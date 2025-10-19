// client/src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({ p }) {
  return (
    <div className="card card--hoverable" style={{ padding: "1.2rem" }}>
      {/* Titulli */}
      <h3 className="card__title">{p.title}</h3>

      {/* Skills si "tags" */}
      <div
        className="row"
        style={{ margin: ".4rem 0 .8rem", flexWrap: "wrap", gap: ".4rem" }}
      >
        {(p.skills || []).slice(0, 4).map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
        {/* Nëse s'ka skills, shfaq një placeholder */}
        {(!p.skills || p.skills.length === 0) && (
          <span className="muted" style={{ fontSize: ".9rem" }}>
            No skills listed
          </span>
        )}
      </div>

      {/* Përshkrimi (i shkurtuar) */}
      <p style={{ marginBottom: ".8rem", color: "var(--text)" }}>
        {p.description?.length > 120
          ? p.description.slice(0, 120) + "..."
          : p.description}
      </p>

      {/* Info Meta */}
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <span className="muted" style={{ fontSize: ".9rem" }}>
          💰 €{p.budgetMin}–€{p.budgetMax}
        </span>
        <span
          className="muted"
          style={{
            fontSize: ".85rem",
            textTransform: "capitalize",
            background:
              p.status === "open"
                ? "rgba(75,210,143,.15)"
                : "rgba(255,173,58,.15)",
            color: p.status === "open" ? "#0d3a29" : "#774b00",
            padding: ".25rem .6rem",
            borderRadius: "8px",
          }}
        >
          {p.status}
        </span>
      </div>

      {/* Butoni View */}
      <Link
        to={`/projects/${p._id}`}
        className="btn"
        style={{ width: "100%", textAlign: "center" }}
      >
        View Project
      </Link>
    </div>
  );
}
