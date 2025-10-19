import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import ProjectMiniCard from "../components/ProjectMiniCard";
import ApplicationMiniCard from "../components/ApplicationMiniCard";
import ProfileEditor from "../components/ProfileEditor";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(
    user?.role === "client" ? "projects" : "applications"
  );
  const [myProjects, setMyProjects] = useState([]);
  const [myApps, setMyApps] = useState([]);

  async function loadProjects() {
    const res = await api("/api/users/me/projects");
    setMyProjects(res);
  }
  async function loadApps() {
    const res = await api("/api/users/me/applications");
    setMyApps(res);
  }

  useEffect(() => {
    if (!user) return;
    if (user.role === "client") loadProjects();
    loadApps(); // edhe freelancer-ët e kanë të vlefshme
    // eslint-disable-next-line
  }, [user?.id]);

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ marginBottom: ".2rem" }}>
              Përshëndetje, {user?.name} 👋
            </h2>
            <div className="muted">
              {user?.email} • Roli: {user?.role}
            </div>
          </div>
          <button className="btn btn--ghost" onClick={logout}>
            Dil
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: ".5rem", marginBottom: ".8rem" }}>
          {user?.role === "client" && (
            <button
              className={`btn ${tab === "projects" ? "" : "btn--ghost"}`}
              onClick={() => setTab("projects")}
            >
              Projektet e mia
            </button>
          )}
          <button
            className={`btn ${tab === "applications" ? "" : "btn--ghost"}`}
            onClick={() => setTab("applications")}
          >
            Aplikimet e mia
          </button>
          <button
            className={`btn ${tab === "profile" ? "" : "btn--ghost"}`}
            onClick={() => setTab("profile")}
          >
            Profile Settings
          </button>
        </div>

        {tab === "projects" && (
          <>
            {myProjects.length === 0 ? (
              <p className="muted">
                S’ke ende projekte.{" "}
                <a href="/post-project">Posto një projekt</a>.
              </p>
            ) : (
              <div className="grid grid--3">
                {myProjects.map((p) => (
                  <ProjectMiniCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "applications" && (
          <>
            {myApps.length === 0 ? (
              <p className="muted">
                S’ke aplikuar ende. Shfleto <a href="/projects">projektet</a>.
              </p>
            ) : (
              <div className="grid grid--3">
                {myApps.map((a) => (
                  <ApplicationMiniCard key={a._id} a={a} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "profile" && <ProfileEditor />}
      </div>
    </div>
  );
}
