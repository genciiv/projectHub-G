import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ApplyModal from "../components/ApplyModal";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [apps, setApps] = useState([]);

  async function load() {
    const res = await api(`/api/projects/${id}`);
    setP(res);
    // nëse je owner, merr aplikimet
    if (user && res.owner && user.id === res.owner._id) {
      const list = await api(`/api/${id}/apps`);
      setApps(list);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [id, user?.id]);

  if (!p)
    return (
      <div className="container">
        <div className="card" style={{ marginTop: "1rem" }}>
          Duke ngarkuar...
        </div>
      </div>
    );

  const isOwner = user && p.owner && user.id === p.owner._id;

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginBottom: ".5rem" }}>{p.title}</h2>
        <p className="muted" style={{ marginBottom: ".6rem" }}>
          {p.skills?.join(" • ")}
        </p>
        <p style={{ whiteSpace: "pre-wrap", marginBottom: ".8rem" }}>
          {p.description}
        </p>
        <div
          className="muted"
          style={{ display: "flex", gap: "1rem", marginBottom: ".8rem" }}
        >
          <span>
            Budget: €{p.budgetMin}–€{p.budgetMax}
          </span>
          <span>Status: {p.status}</span>
          {p.deadline && (
            <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
          )}
        </div>

        {!isOwner && user && p.status === "open" && (
          <button className="btn" onClick={() => setShowApply(true)}>
            Apliko
          </button>
        )}
        {!user && (
          <p className="muted">
            Duhet të <a href="/login">hysh</a> për të aplikuar.
          </p>
        )}
      </div>

      {isOwner && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3 style={{ marginBottom: ".6rem" }}>Aplikimet ({apps.length})</h3>
          {apps.length === 0 ? (
            <p className="muted">S’ka aplikime ende.</p>
          ) : (
            <div className="grid">
              {apps.map((a) => (
                <div className="card" key={a._id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: ".4rem",
                    }}
                  >
                    <strong>{a.applicant?.name}</strong>
                    <span className="muted">
                      €{a.bidAmount} • {a.etaDays} ditë
                    </span>
                  </div>
                  <p style={{ whiteSpace: "pre-wrap", marginBottom: ".6rem" }}>
                    {a.coverLetter}
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await api(`/api/projects/${p._id}/winner`, {
                        method: "POST",
                        body: JSON.stringify({ applicantId: a.applicant?._id }),
                      });
                      await load();
                    }}
                  >
                    <button className="btn" disabled={p.status !== "open"}>
                      Zgjidh fitues
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showApply && (
        <ApplyModal
          projectId={p._id}
          onClose={() => setShowApply(false)}
          onSuccess={() => {
            setShowApply(false);
          }}
        />
      )}
    </div>
  );
}
