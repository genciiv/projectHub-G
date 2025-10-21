// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  async function load(page = 1) {
    setLoading(true);
    try {
      const res = await api(`/api/feed?page=${page}&limit=12`);
      setData(res);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(1); }, []);

  return (
    <div className="container">
      <div className="card card--hoverable" style={{ marginTop: "1rem" }}>
        <h2 className="card__title" style={{ fontSize: "1.25rem" }}>Feed</h2>
        <div className="muted">Postime & projekte nga ti dhe miqtë e tu</div>
      </div>

      <div className="section">
        {loading ? (
          <div className="card">Duke ngarkuar…</div>
        ) : data.items.length === 0 ? (
          <div className="card">S’ka ende aktivitete. Shto miq dhe publiko diçka!</div>
        ) : (
          <>
            <div className="grid grid--3">
              {data.items.map(item => (
                <div key={`${item.type}-${item._id}`}>
                  {item.type === "post" ? (
                    <PostCard p={item.data} />
                  ) : (
                    <ProjectCard p={item.data} />
                  )}
                </div>
              ))}
            </div>

            <div className="row" style={{ justifyContent: "center", marginTop: "1rem" }}>
              <button className="pill" disabled={data.page <= 1} onClick={() => load(data.page - 1)}>← Prev</button>
              <span className="muted" style={{ padding: ".5rem .9rem" }}>
                Page {data.page}/{data.pages} • {data.total}
              </span>
              <button className="pill" disabled={data.page >= data.pages} onClick={() => load(data.page + 1)}>Next →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
