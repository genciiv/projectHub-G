import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import ProjectCard from "../components/ProjectCard";
import ProjectFilters from "../components/ProjectFilters";

export default function Projects() {
  const [query, setQuery] = useState({});
  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  function qs(obj) {
    const out = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "")
        out.set(k, v);
    });
    return out.toString();
  }

  async function load(page = 1) {
    setLoading(true);
    try {
      const q = qs({ ...query, page, limit: 12 });
      const res = await api(`/api/projects?${q}`);
      setData(res);
    } catch (e) {
      console.error(e);
      setData({ items: [], page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1); /* eslint-disable-next-line */
  }, [JSON.stringify(query)]);

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>Projects</h2>
        <ProjectFilters onChange={setQuery} initial={query} />
        {loading ? (
          <p>Duke ngarkuar...</p>
        ) : (
          <>
            <div className="grid grid--3">
              {data.items.map((p) => (
                <ProjectCard key={p._id} p={p} />
              ))}
            </div>
            <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
              <button
                className="btn btn--ghost"
                disabled={data.page <= 1}
                onClick={() => load(data.page - 1)}
              >
                Prev
              </button>
              <div className="muted">
                Page {data.page} / {data.pages} — {data.total} total
              </div>
              <button
                className="btn btn--ghost"
                disabled={data.page >= data.pages}
                onClick={() => load(data.page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
