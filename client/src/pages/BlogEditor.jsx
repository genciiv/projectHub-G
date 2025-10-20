import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";
import ImageUploader from "../components/ImageUploader";

export default function BlogEditor(){
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title:"", body:"", tags:"", published:true, coverUrl:"" });
  const [err, setErr] = useState("");

  useEffect(()=>{
    (async ()=>{
      if (!isEdit) return;
      try{
        const p = await api(`/api/posts/${id}`);
        setForm({
          title: p.title,
          body: p.body,
          tags: (p.tags||[]).join(", "),
          published: !!p.published,
          coverUrl: p.coverUrl || ""
        });
      }catch(e){ setErr(e.message); }
    })();
  }, [id, isEdit]);

  async function submit(e){
    e.preventDefault();
    setErr("");

    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map(s=>s.trim()).filter(Boolean) : [],
    };

    try{
      if (isEdit){
        await api(`/api/posts/${id}`, { method:"PUT", body: JSON.stringify(payload) });
        nav(`/blog/${id}`);
      } else {
        const created = await api("/api/posts", { method:"POST", body: JSON.stringify(payload) });
        nav(`/blog/${created._id}`);
      }
    }catch(e){ setErr(e.message); }
  }

  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <div className="card" style={{ marginTop:"1rem" }}>
        <h2 className="card__title">{isEdit ? "Edito postim" : "Postim i ri"}</h2>
        {err && <div className="alert alert--danger" style={{ marginTop: ".6rem" }}>{err}</div>}

        <form className="form" onSubmit={submit}>
          <input className="input" placeholder="Titulli" value={form.title}
                 onChange={e=>setForm({...form, title: e.target.value})} required />
          <textarea className="input" rows="12" placeholder="Përmbajtja…"
                    value={form.body} onChange={e=>setForm({...form, body: e.target.value})} required />
          <input className="input" placeholder="Tags (comma)" value={form.tags}
                 onChange={e=>setForm({...form, tags: e.target.value})} />

          {/* Uploader i imazhit */}
          <ImageUploader
            value={form.coverUrl}
            onChange={(url)=>setForm({...form, coverUrl: url})}
            label="Cover image (opsionale)"
          />

          <label className="row" style={{ gap: ".5rem" }}>
            <input type="checkbox" checked={form.published}
                   onChange={e=>setForm({...form, published: e.target.checked})} />
            Publiko menjëherë
          </label>

          <div className="row" style={{ gap: ".6rem" }}>
            <button className="btn" type="submit">{isEdit ? "Ruaj" : "Publiko"}</button>
            <button className="btn btn--ghost" type="button" onClick={()=>nav(-1)}>Anulo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
