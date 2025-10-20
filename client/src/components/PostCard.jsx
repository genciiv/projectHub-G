// client/src/components/PostCard.jsx
import { Link } from "react-router-dom";

export default function PostCard({ p }) {
  return (
    <div className="card card--hoverable">
      <h3 className="card__title">
        <Link to={`/blog/${p._id}`}>{p.title}</Link>
      </h3>
      <div className="row" style={{ gap: ".4rem", flexWrap: "wrap", margin: ".35rem 0 .7rem" }}>
        {(p.tags || []).slice(0,5).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <p className="muted" style={{ marginBottom: ".6rem" }}>
        nga {p.author?.name || "Anon"} • {new Date(p.createdAt).toLocaleDateString()}
      </p>
      <p>{(p.body || "").slice(0,140)}{(p.body || "").length>140?"…":""}</p>
      <div className="row" style={{ marginTop: ".8rem" }}>
        <Link className="btn btn--outline" to={`/blog/${p._id}`}>Lexo</Link>
      </div>
    </div>
  );
}
