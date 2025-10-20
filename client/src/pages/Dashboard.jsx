import { useEffect, useState } from "react";
import { api } from "../utils/api";
import PostCard from "../components/PostCard";

export default function Blog() {
  const [query, setQuery] = useState({ q:"", tags:"" });
  const [data, setData] = useState({ items: [], page:1, pages:1, total:0 });
  const [loading, setLoading] = useState(true);

  function qs(obj){
    const u = new URLSearchParams();
    Object.entries(obj).forEach(([k,v])=>{ if(String(v||"").trim()!=="") u.set(k,v); });
    return u.toString();
  }

  async function load(page=1){
    setLoading(true);
    try{
      const q = qs({ ...query, page, limit: 9 });
      const res = await api(`/api/posts?${q}`);
      setData(res);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(1); /* eslint-disable-next-line */ }, [JSON.stringify(query)]);

  return (
    <div className="container">
      <div className="card card--hoverable" style={{ marginTop:"1rem" }}>
        <div className="spread">
          <div>
            <h2 className="card__title" style={{ fontSize:"1.35rem" }}>Blog & Announcements</h2>
            <div className="muted">Postime nga komuniteti.</div>
          </div>
          <a className="btn" href="/blog/new">Shkruaj postim</a>
        </div>
      </div>

      <div className="card" style={{ marginTop:"1rem" }}>
        <form className="form" onSubmit={(e)=>{e.preventDefault(); load(1);}}>
          <input className="input" placeholder="Kërko në postime..." value={query.q} onChange={e=>setQuery({...query, q:e.target.value})}/>
          <input className="input" placeholder="Tags (comma)" value={query.tags} onChange={e=>setQuery({...query, tags:e.target.value})}/>
          <button className="btn" type="submit">Filtro</button>
        </form>
      </div>

      <div className="section">
        {loading ? <p className="muted">Duke ngarkuar…</p> : (
          data.items.length === 0 ? (
            <div className="card">Asnjë postim.</div>
          ) : (
            <>
              <div className="grid grid--3">
                {data.items.map(p => <PostCard key={p._id} p={p} />)}
              </div>
              <div className="row" style={{ justifyContent:"center", marginTop:"1rem" }}>
                <button className="pill" disabled={data.page<=1} onClick={()=>load(data.page-1)}>← Prev</button>
                <span className="muted" style={{ padding: ".5rem .9rem" }}>Page {data.page}/{data.pages} • {data.total}</span>
                <button className="pill" disabled={data.page>=data.pages} onClick={()=>load(data.page+1)}>Next →</button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
