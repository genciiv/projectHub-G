// client/src/pages/Feed.jsx
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import FollowButton from "../components/FollowButton";
import { Link } from "react-router-dom";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api("/api/feed?page=1&limit=12");
      setItems(res.items || []);
      const sug = await api("/api/social/suggested?limit=6");
      setSuggested(sug || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleLike(item) {
    try {
      if (item._type === "post") {
        const r = await api(`/api/posts/${item._id}/like`, { method: "POST" });
        item.likes = updateLikes(item.likes, r);
      } else {
        const r = await api(`/api/projects/${item._id}/like`, { method: "POST" });
        item.likes = updateLikes(item.likes, r);
      }
      setItems([...items]);
    } catch (e) { console.error(e); }
  }

  function updateLikes(prev = [], r) {
    // thjesht kthe numrin e ri; mund të rifreskosh me /feed për saktësi absolute
    return Array.from({ length: r.likesCount || 0 });
  }

  async function toggleSavePost(id) {
    try {
      await api(`/api/posts/${id}/save`, { method: "POST" });
      // mund të shfaqësh toast; nuk ka UI ndryshim kritik
    } catch (e) { console.error(e); }
  }

  return (
    <div className="container" style={{ marginTop: "1rem" }}>
      <div className="spread" style={{ marginBottom: ".6rem" }}>
        <h2>Feed</h2>
        <div className="row" style={{ gap: ".5rem" }}>
          <Link className="btn btn--outline" to="/post-project">Posto projekt</Link>
          <Link className="btn btn--outline" to="/blog/new">Shkruaj postim</Link>
        </div>
      </div>

      {/* Layout: kolonë e madhe (feed) + anë (suggested) */}
      <div className="row" style={{ alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: "1 1 0" }}>
          {loading ? (
            <div className="card">Duke ngarkuar…</div>
          ) : items.length === 0 ? (
            <div className="card">Feed bosh. Ndiq disa përdorues nga “Suggested”.</div>
          ) : (
            <div className="grid grid--2">
              {items.map((it) =>
                it._type === "post" ? (
                  <div key={`p-${it._id}`} className="card">
                    <PostCard post={it} />
                    <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                      <button className="btn btn--outline" onClick={() => toggleLike(it)}>Like ({it.likes?.length || 0})</button>
                      <button className="btn btn--ghost" onClick={() => toggleSavePost(it._id)}>Save</button>
                    </div>
                  </div>
                ) : (
                  <div key={`prj-${it._id}`} className="card">
                    <ProjectCard p={it} />
                    <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                      <button className="btn btn--outline" onClick={() => toggleLike(it)}>Like ({it.likes?.length || 0})</button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <aside style={{ width: 320 }}>
          <div className="card">
            <h3 className="card__title">Suggested Users</h3>
            <div className="col" style={{ gap: ".6rem" }}>
              {suggested.map(u => (
                <div key={u._id} className="spread" style={{ alignItems: "center" }}>
                  <div className="row" style={{ gap: ".6rem", alignItems: "center" }}>
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      style={{ width: 36, height: 36, borderRadius: "50%" }}
                    />
                    <div>
                      <div><strong>{u.name}</strong></div>
                      <div className="muted">{u.role}</div>
                    </div>
                  </div>
                  <FollowButton userId={u._id} onDone={load} />
                </div>
              ))}
              {suggested.length === 0 && <div className="muted">Asnjë sugjerim për momentin.</div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
