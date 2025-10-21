// client/src/pages/BlogPost.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function BlogPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [comment, setComment] = useState("");
  const isOwner = user && post?.author && (user.id === post.author._id || user._id === post.author._id);

  async function load() {
    try {
      const res = await api(`/api/posts/${id}`);
      setPost(res);
      setErr("");
    } catch (e) {
      setPost(null);
      setErr(e.message || "Nuk u gjet postimi.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api(`/api/posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: comment }),
      });
      setComment("");
      await load();
    } catch (e) {
      setErr(e.message || "S’munda të shtoj komentin.");
    }
  }

  async function remove() {
    if (!confirm("Fshi këtë postim?")) return;
    try {
      await api(`/api/posts/${id}`, { method: "DELETE" });
      nav("/blog");
    } catch (e) {
      setErr(e.message || "S’munda të fshij postimin.");
    }
  }

  if (err) {
    return (
      <div className="container" style={{ paddingTop: "1rem" }}>
        <div className="card alert alert--danger">{err}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ paddingTop: "1rem" }}>
        <div className="card">Duke ngarkuar…</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "1rem", maxWidth: 860 }}>
      <div className="card card--hoverable">
        {/* Header */}
        <div className="spread" style={{ marginBottom: ".6rem" }}>
          <div>
            <h1 className="card__title" style={{ fontSize: "1.6rem", lineHeight: 1.25 }}>
              {post.title}
            </h1>
            <div className="muted">
              nga{" "}
              {post.author?._id ? (
                <Link to={`/u/${post.author._id}`}>{post.author?.name || "Anon"}</Link>
              ) : (
                post.author?.name || "Anon"
              )}{" "}
              • {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="row">
            <Link className="btn btn--outline" to="/blog">← Mbrapa</Link>
            {isOwner && <Link className="btn" to={`/blog/edit/${post._id}`}>Edito</Link>}
            {isOwner && <button className="btn btn--ghost" onClick={remove}>Fshi</button>}
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="row" style={{ gap: ".4rem", flexWrap: "wrap", marginBottom: ".8rem" }}>
            {post.tags.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        )}

        {/* Cover */}
        {post.coverUrl && (
          <div style={{ marginBottom: "1rem" }}>
            <img
              src={post.coverUrl}
              alt=""
              style={{ width: "100%", borderRadius: 12, border: "1px solid #e5e7eb", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Body */}
        <div style={{ whiteSpace: "pre-wrap" }}>{post.body}</div>
      </div>

      {/* Komentet */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: ".6rem" }}>Komente ({post.comments?.length || 0})</h3>

        {user ? (
          <form className="form" onSubmit={addComment} style={{ marginBottom: "1rem" }}>
            <textarea
              className="input"
              rows="4"
              placeholder="Shkruaj koment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn" type="submit">Dërgo</button>
          </form>
        ) : (
          <div className="muted">
            Duhet të <Link to="/login">hysh</Link> për të komentuar.
          </div>
        )}

        <div className="grid">
          {(post.comments || []).slice().reverse().map((c) => (
            <div className="card" key={c._id}>
              <div className="spread">
                <strong>{c.author?.name || "User"}</strong>
                <span className="muted" style={{ fontSize: ".9rem" }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={{ whiteSpace: "pre-wrap", marginTop: ".4rem" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
