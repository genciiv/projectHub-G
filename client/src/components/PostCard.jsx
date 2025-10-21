// client/src/components/PostCard.jsx
import { Link } from "react-router-dom";

export default function PostCard(props) {
  // lexo si 'post' ose si 'p' për kompatibilitet me thirrjet e vjetra
  const p = props.post || props.p || {};

  const id = p._id;
  const title = p.title || "Untitled";
  const author = p.author?.name || "Anonim";
  const coverUrl = p.coverUrl || "";
  const created = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "";

  return (
    <div className="card card--hoverable" style={{ overflow: "hidden" }}>
      {/* Cover (opsional) */}
      {coverUrl ? (
        <Link to={`/blog/${id}`}>
          <img
            src={coverUrl}
            alt={title}
            style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }}
          />
        </Link>
      ) : null}

      <div className="card__body">
        <Link to={`/blog/${id}`} className="card__title" style={{ display: "block", marginBottom: ".3rem" }}>
          {title}
        </Link>

        <div className="muted" style={{ marginBottom: ".4rem" }}>
          {author}{created ? ` • ${created}` : ""}
        </div>

        {/* Tags (opsionale) */}
        {!!(p.tags && p.tags.length) && (
          <div className="row" style={{ gap: ".35rem", flexWrap: "wrap", marginTop: ".2rem" }}>
            {p.tags.slice(0, 4).map((t) => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
