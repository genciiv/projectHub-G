// client/src/components/PostCard.jsx
import { Link } from "react-router-dom";

export default function PostCard({ p }) {
  const cover = p.coverUrl || null;

  return (
    <article className={`card card--hoverable ${cover ? "card--media" : "card--compact"}`}>

      {cover && (
        <img className="media" src={cover} alt="" loading="lazy" />
      )}

      <div className={cover ? "body" : ""}>
        <h3 className="card__title">
          <Link to={`/blog/${p._id}`}>{p.title}</Link>
        </h3>

        <p className="muted" style={{ marginTop: "-.2rem", marginBottom: ".4rem" }}>
          nga <Link to={p.author?._id ? `/u/${p.author._id}` : "#"}>{p.author?.name || "Anon"}</Link> • {new Date(p.createdAt).toLocaleDateString()}
        </p>

        {(p.tags?.length > 0) && (
          <div className="row" style={{ margin: ".2rem 0 .5rem" }}>
            {p.tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        <p style={{ margin: 0 }}>
          {(p.body || "").slice(0, 120)}{(p.body || "").length > 120 ? "…" : ""}
        </p>

        <div className="row" style={{ marginTop: ".7rem" }}>
          <Link className="btn btn--outline" to={`/blog/${p._id}`}>Lexo</Link>
        </div>
      </div>
    </article>
  );
}
