import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function BlogPost(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [comment, setComment] = useState("");
  const isOwner = user && p?.author && user.id === p.author._id;

  async function load(){
    const res = await api(`/api/posts/${id}`);
    setP(res);
  }
  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [id]);

  async function addComment(e){
    e.preventDefault();
    if (!comment.trim()) return;
    await api(`/api/posts/${id}/comments`, { method:"POST", body: JSON.stringify({ body: comment }) });
    setComment("");
    await load();
  }

  async function del(){
    if (!confirm("Fshi këtë postim?")) return;
    await api(`/api/posts/${id}`, { method:"DELETE" });
    nav("/blog");
  }

  if (!p) return <div className="container"><div className="card" style={{marginTop:"1rem"}}>Duke ngarkuar…</div></div>;

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="card" style={{ marginTop:"1rem" }}>
        <div className="spread" style={{ marginBottom: ".6rem" }}>
          <div>
            <h1 className="card__title" style={{ fontSize:"1.6rem" }}>{p.title}</h1>
            <div className="muted">nga {p.author?.name || "Anon"} • {new Date(p.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="row">
            <Link className="btn btn--outline" to="/blog">← Mbrapa</Link>
            {isOwner && <Link className="btn" to={`/blog/edit/${p._id}`}>Edito</Link>}
            {isOwner && <button className="btn btn--ghost" onClick={del}>Fshi</button>}
          </div>
        </div>

        <div className="row" style={{ gap: ".4rem", flexWrap: "wrap", marginBottom: ".8rem" }}>
          {(p.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}
        </div>

        <div style={{ whiteSpace:"pre-wrap" }}>{p.body}</div>
      </div>

      {/* Komentet */}
      <div className="card" style={{ marginTop:"1rem" }}>
        <h3 style={{ marginBottom: ".6rem" }}>Komente ({p.comments?.length || 0})</h3>

        {user ? (
          <form className="form" onSubmit={addComment} style={{ marginBottom: "1rem" }}>
            <textarea className="input" rows="4" placeholder="Shkruaj koment…" value={comment} onChange={e=>setComment(e.target.value)} />
            <button className="btn" type="submit">Dërgo</button>
          </form>
        ) : (
          <div className="muted">Duhet të <Link to="/login">hysh</Link> për të komentuar.</div>
        )}

        <div className="grid">
          {(p.comments || []).slice().reverse().map(c => (
            <div className="card" key={c._id}>
              <div className="spread">
                <strong>{c.author?.name || "User"}</strong>
                <span className="muted" style={{ fontSize: ".9rem" }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={{ whiteSpace:"pre-wrap", marginTop: ".4rem" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
