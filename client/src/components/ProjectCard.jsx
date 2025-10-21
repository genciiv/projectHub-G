// client/src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

export default function ProjectCard(props) {
  // Prano si props.project ose props.p (kompatibilitet me kodin ekzistues)
  const p = props.project || props.p || {};

  const id = p._id;
  const title = p.title || "Untitled project";
  const description = p.description || "";
  const coverUrl = p.coverUrl || "";
  const budget = typeof p.budget === "number" ? p.budget : (p.budget ? Number(p.budget) : 0);
  const ownerName = p.owner?.name || p.ownerName || "Anonim";
  const skills = Array.isArray(p.skills) ? p.skills : [];

  return (
    <div className="card card--hoverable" style={{ overflow: "hidden" }}>
      {coverUrl ? (
        <Link to={`/projects/${id}`}>
          <img
            src={coverUrl}
            alt={title}
            style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }}
          />
        </Link>
      ) : null}

      <div className="card__body">
        <Link to={`/projects/${id}`} className="card__title" style={{ display: "block", marginBottom: ".35rem" }}>
          {title}
        </Link>

        {ownerName && (
          <div className="muted" style={{ marginBottom: ".3rem" }}>
            nga {ownerName} {budget ? `• $${budget}` : ""}
          </div>
        )}

        {description && (
          <p className="muted" style={{ margin: 0 }}>
            {description.length > 120 ? description.slice(0, 117) + "..." : description}
          </p>
        )}

        {/* Tags/skills */}
        {!!skills.length && (
          <div className="row" style={{ margin: ".5rem 0 0", gap: ".35rem", flexWrap: "wrap" }}>
            {skills.slice(0, 4).map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
