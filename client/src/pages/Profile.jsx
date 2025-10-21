// client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [info, setInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState("posts");
  const [err, setErr] = useState("");

  const isOwner = user && (user._id === id || user.id === id);

  async function loadAll() {
    try {
      const [u, p1, p2] = await Promise.all([
        api(`/api/users/${id}`),
        api(`/api/posts?author=${id}&limit=100`),
        api(`/api/projects?owner=${id}&limit=100`),
      ]);
      setInfo(u);
      setPosts(p1.items || []);
      setProjects(p2.items || []);
      setErr("");
    } catch (e) {
      setErr(e.message || "Gabim gjatë ngarkimit të profilit.");
    }
  }

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, [id]);

  async function deleteAccount() {
    if (!confirm("Je i sigurt që do të fshish llogarinë? Kjo është e pakthyeshme.")) return;
    try {
      await api(`/api/users/${id}`, { method: "DELETE" });
      // opsionale: godit /api/auth/logout — por pas fshirjes llogaria s'ekziston
      nav("/");
      location.reload();
    } catch (e) {
      alert(e.message || "S’munda të fshij llogarinë.");
    }
  }

  if (err) {
    return (
      <div className="container" style={{ marginTop: "1rem" }}>
        <div className="card alert alert--danger">{err}</div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="container" style={{ marginTop: "1rem" }}>
        <div className="card">Duke ngarkuar…</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "1rem" }}>
      {/* Header */}
      <div className="card card--hoverable">
        <div className="row" style={{ gap: "1rem", alignItems: "center" }}>
          <img
            src={info.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(info.name)}`}
            alt={info.name}
            style={{ width: 80, height: 80, borderRadius: "50%", border: "1px solid #e5e7eb", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <h2 className="card__title" style={{ margin: 0 }}>{info.name}</h2>
            <div className="muted">
              {info.role} • Anëtar që prej {new Date(info.createdAt).toLocaleDateString()}
            </div>
            {info.bio && <p style={{ marginTop: ".5rem" }}>{info.bio}</p>}
          </div>

          <div className="row" style={{ gap: ".5rem" }}>
            {isOwner && <Link className="btn btn--outline" to="/profile/edit">Edit Profile</Link>}
            {isOwner && <button className="btn btn--ghost" onClick={deleteAccount}>Delete Account</button>}
          </div>
        </div>

        {/* Tabs */}
        <div className="row" style={{ gap: ".5rem", marginTop: ".8rem" }}>
          <button className={`pill${tab==="posts"?" active":""}`} onClick={() => setTab("posts")}>📝 Postime</button>
          <button className={`pill${tab==="projects"?" active":""}`} onClick={() => setTab("projects")}>📦 Projekte</button>
        </div>
      </div>

      {/* Lista */}
      <div className="section">
        {tab === "posts" ? (
          posts.length ? (
            <div className="grid grid--3">
              {posts.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          ) : <div className="card">S’ka postime.</div>
        ) : (
          projects.length ? (
            <div className="grid grid--3">
              {projects.map((p) => <ProjectCard key={p._id} p={p} />)}
            </div>
          ) : <div className="card">S’ka projekte.</div>
        )}
      </div>
    </div>
  );
}
