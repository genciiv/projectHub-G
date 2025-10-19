// client/src/pages/Projects.jsx
import React, { useEffect, useMemo, useState } from "react";
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

  // Debounce i lehtë për filtrat (ul thirrjet)
  const debouncedQuery = useDebounce(query, 300);

  async function load(page = 1) {
    setLoading(true);
    try {
      const q = qs({ ...debouncedQuery, page, limit: 12 });
      const res = await api(`/api/projects?${q}`);
      setData(res);
    } catch (e) {
      console.error(e);
      setData({ items: [], page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }

  // ngarko kur ndryshojnë filtrat e debounced
  useEffect(() => {
    load(1); /* eslint-disable-next-line */
  }, [JSON.stringify(debouncedQuery)]);

  // header meta
  const subtitle = useMemo(() => {
    const parts = [];
    if (debouncedQuery.q) parts.push(`“${debouncedQuery.q}”`);
    if (debouncedQuery.skills) parts.push(`skills: ${debouncedQuery.skills}`);
    if (debouncedQuery.status) parts.push(`status: ${debouncedQuery.status}`);
    return parts.length ? parts.join(" • ") : "Browse latest open projects";
  }, [debouncedQuery]);

  return (
    <div className="container">
      {/* Hero / Header i faqes */}
      <div
        className="card card--hoverable"
        style={{ marginTop: "1rem", padding: "1.2rem" }}
      >
        <div className="spread">
          <div className="stack-sm">
            <h2 className="card__title" style={{ fontSize: "1.35rem" }}>
              Projects
            </h2>
            <div className="muted">{subtitle}</div>
          </div>
          <div className="row">
            <a className="btn" href="/post-project">
              Posto projekt
            </a>
          </div>
        </div>
      </div>

      {/* Filtër i kompaktuar */}
      <div className="card" style={{ marginTop: "1rem", padding: "1rem" }}>
        <ProjectFilters onChange={setQuery} initial={query} />
      </div>

      {/* Grid i kartave */}
      <div className="section">
        {loading ? (
          <SkeletonGrid />
        ) : data.items.length === 0 ? (
          <EmptyState onReset={() => setQuery({})} />
        ) : (
          <>
            <div className="grid grid--3">
              {data.items.map((p) => (
                <ProjectCard key={p._id} p={p} />
              ))}
            </div>

            {/* Pagination */}
            <div
              className="row"
              style={{ justifyContent: "center", marginTop: "1.2rem" }}
            >
              <button
                className="pill"
                disabled={data.page <= 1}
                onClick={() => load(data.page - 1)}
                aria-label="Previous page"
              >
                ← Prev
              </button>
              <span className="muted" style={{ padding: ".5rem .9rem" }}>
                Page {data.page} / {data.pages} • {data.total} results
              </span>
              <button
                className="pill"
                disabled={data.page >= data.pages}
                onClick={() => load(data.page + 1)}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ====== Komponentë ndihmës (në të njëjtin file) ====== */

function SkeletonGrid() {
  return (
    <div className="grid grid--3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card skeleton">
          <div className="s-line" style={{ width: "60%", height: "16px" }} />
          <div
            className="row"
            style={{ gap: ".4rem", margin: ".6rem 0 .9rem" }}
          >
            <div className="s-chip" />
            <div className="s-chip" />
            <div className="s-chip" />
          </div>
          <div
            className="s-line"
            style={{ width: "100%", height: "12px", marginBottom: ".35rem" }}
          />
          <div className="s-line" style={{ width: "85%", height: "12px" }} />
          <div
            className="row"
            style={{ justifyContent: "space-between", marginTop: ".9rem" }}
          >
            <div className="s-line" style={{ width: "30%", height: "12px" }} />
            <div className="s-line" style={{ width: "18%", height: "12px" }} />
          </div>
          <div className="s-btn" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
      <h3 className="card__title">No projects found</h3>
      <p className="muted" style={{ marginTop: ".4rem" }}>
        Provo ndrysho filtrat ose{" "}
        <a href="/post-project">posto një projekt të ri</a>.
      </p>
      <div
        className="row"
        style={{ justifyContent: "center", marginTop: ".9rem" }}
      >
        <button className="btn btn--outline" onClick={onReset}>
          Clear filters
        </button>
        <a className="btn" href="/projects">
          Refresh
        </a>
      </div>
    </div>
  );
}

/* Debounce hook i thjeshtë */
function useDebounce(value, delay = 300) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}
