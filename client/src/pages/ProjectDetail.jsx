// client/src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Komponentë
import ApplyModal from "../components/ApplyModal";
import ReviewForm from "../components/ReviewForm";
import UserReviews from "../components/UserReviews";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [p, setP] = useState(null); // projekt
  const [apps, setApps] = useState([]); // aplikimet (vetëm owner)
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const isLogged = !!user;
  const isOwner = isLogged && p?.owner && user.id === p.owner._id;

  async function load() {
    try {
      setLoading(true);
      const res = await api(`/api/projects/${id}`);
      setP(res);

      // Nëse je owner, merr aplikimet
      if (user && res?.owner && user.id === res.owner._id) {
        const list = await api(`/api/${id}/apps`);
        setApps(list);
      } else {
        setApps([]);
      }
    } catch (e) {
      console.error(e);
      setP(null);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id, user?.id]);

  if (loading || !p) {
    return (
      <div className="container">
        <div className="card" style={{ marginTop: "1rem" }}>
          Duke ngarkuar detajet e projektit…
        </div>
      </div>
    );
  }

  const winnerApp = apps.find((a) => a.applicant?._id === String(p.winner));
  const winnerName = winnerApp?.applicant?.name || "Freelancer";

  return (
    <div className="container">
      {/* Karta kryesore e projektit */}
      <div
        className="card card--hoverable"
        style={{ marginTop: "1rem", padding: "1.2rem" }}
      >
        <div className="spread" style={{ alignItems: "start" }}>
          <div className="stack-sm">
            <h2 className="card__title" style={{ fontSize: "1.35rem" }}>
              {p.title}
            </h2>
            <div className="row" style={{ gap: ".4rem", flexWrap: "wrap" }}>
              {(p.skills || []).slice(0, 6).map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
              {(!p.skills || p.skills.length === 0) && (
                <span className="muted">No skills listed</span>
              )}
            </div>
          </div>

          <div
            className="stack-sm"
            style={{ textAlign: "right", minWidth: "220px" }}
          >
            <div className="table-meta">Budget</div>
            <strong>
              €{p.budgetMin}–€{p.budgetMax}
            </strong>
            <div className="table-meta" style={{ marginTop: ".6rem" }}>
              Status
            </div>
            <span
              className="muted"
              style={{
                textTransform: "capitalize",
                background:
                  p.status === "open"
                    ? "rgba(75,210,143,.15)"
                    : p.status === "in_progress"
                    ? "rgba(58,102,255,.14)"
                    : p.status === "completed"
                    ? "rgba(60,200,120,.18)"
                    : "rgba(255,133,151,.18)",
                color:
                  p.status === "open"
                    ? "#0d3a29"
                    : p.status === "in_progress"
                    ? "#0b2a6b"
                    : p.status === "completed"
                    ? "#0d3a29"
                    : "#6b0f1a",
                padding: ".25rem .6rem",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              {p.status}
            </span>
            {p.deadline && (
              <>
                <div className="table-meta" style={{ marginTop: ".6rem" }}>
                  Deadline
                </div>
                <span className="muted">
                  {new Date(p.deadline).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        <p style={{ whiteSpace: "pre-wrap" }}>{p.description}</p>

        <div className="row" style={{ marginTop: "1rem" }}>
          {!isOwner && isLogged && p.status === "open" && (
            <button className="btn" onClick={() => setShowApply(true)}>
              Apliko për projekt
            </button>
          )}
          {!isLogged && (
            <span className="muted">
              Duhet të <Link to="/login">hysh</Link> për të aplikuar.
            </span>
          )}
          {isOwner && p.status === "open" && (
            <span className="muted">
              Je pronari i projektit. Shiko aplikimet më poshtë për të zgjedhur
              fitues.
            </span>
          )}
          {p.status === "completed" && p.winner && (
            <span className="muted">
              Fituesi: <strong>{winnerName}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Aplikimet — vetem per owner */}
      {isOwner && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <div className="spread" style={{ marginBottom: ".6rem" }}>
            <h3>Aplikimet ({apps.length})</h3>
            <div className="muted">Vetëm pronari i projektit i sheh këto</div>
          </div>

          {apps.length === 0 ? (
            <p className="muted">S’ka aplikime ende.</p>
          ) : (
            <div className="grid grid--2">
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

                  <div className="row" style={{ gap: ".5rem" }}>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await api(`/api/projects/${p._id}/winner`, {
                            method: "POST",
                            body: JSON.stringify({
                              applicantId: a.applicant?._id,
                            }),
                          });
                          await load();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      <button className="btn" disabled={p.status !== "open"}>
                        Zgjidh fitues
                      </button>
                    </form>
                    <a
                      className="btn btn--outline"
                      href={`mailto:${a.applicant?.email}`}
                    >
                      Kontakto
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review kur projekti është completed (owner → winner) */}
      {isOwner && p.status === "completed" && p.winner && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <div className="spread">
            <div>
              <h3 style={{ marginBottom: ".4rem" }}>Projekti u kompletua ✅</h3>
              <div className="muted">Zgjodhe fituesin: {winnerName}</div>
            </div>
            {!reviewMode ? (
              <button className="btn" onClick={() => setReviewMode(true)}>
                Lër një review
              </button>
            ) : (
              <button
                className="btn btn--ghost"
                onClick={() => setReviewMode(false)}
              >
                Mbyll
              </button>
            )}
          </div>

          {reviewMode && (
            <ReviewForm
              projectId={p._id}
              toUserId={p.winner}
              onSubmitted={() => {
                setReviewMode(false); /* mund të bësh load(); nëse do */
              }}
            />
          )}
        </div>
      )}

      {/* Reviews e fituesit (ose të kujtdo në të ardhmen) */}
      {p.winner && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <UserReviews userId={p.winner} />
        </div>
      )}

      {/* Modal Apliko */}
      {showApply && (
        <ApplyModal
          projectId={p._id}
          onClose={() => setShowApply(false)}
          onSuccess={() => {
            setShowApply(false);
            // opcionalisht: load();
          }}
        />
      )}
    </div>
  );
}
