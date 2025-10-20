// client/src/components/PostCard.jsx
import { Link } from "react-router-dom";

export default function PostCard({ p }) {
  return (
    <div className="card card--hoverable" style={{ overflow: "hidden" }}>
      {/* Cover image (opsionale) */}
      {p.coverUrl && (
        <div style={{ margin: "-.6rem -.6rem .8rem", overflow: "hidden", borderRadius: 12 }}>
          <img
            src={p.coverUrl}
            alt=""
            style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 220 }}
          />
        </div>
      )}

      {/* Titulli */}
      <h3 className="card__title" style={{ lineHeight: 1.25 }}>
        <Link to={`/blog/${p._id}`}>{p.title}</Link>
      </h3>

      {/* Tags */}
      <div className="row" style={{ gap: ".4rem", flexWrap: "wrap", margin: ".35rem 0 .7rem" }}>
        {(p.tags || []).slice(0, 5).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* Meta */}
      <p className="muted" style={{ marginBottom: ".6rem" }}>
        nga {p.author?.name || "Anon"} • {new Date(p.createdAt).toLocaleDateString()}
      </p>

      {/* Përmbledhje */}
      <p>
        {(p.body || "").slice(0, 140)}
        {(p.body || "").length > 140 ? "…" : ""}
      </p>

      <div className="row" style={{ marginTop: ".8rem" }}>
        <Link className="btn btn--outline" to={`/blog/${p._id}`}>Lexo</Link>
      </div>
    </div>
  );
}
