// client/src/layout/RootLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RootLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Header / Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffffcc",
          backdropFilter: "saturate(180%) blur(8px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: ".7rem 1rem",
          }}
        >
          {/* Left: brand + nav */}
          <div className="row" style={{ gap: ".8rem" }}>
            <Link to="/" className="card__title" style={{ fontSize: "1.05rem" }}>
              ProjectHub-G
            </Link>
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Blog</Link>
          </div>

          {/* Right: auth area */}
          <div className="row" style={{ gap: ".6rem" }}>
            {user ? (
              <>
                <span className="muted">
                  Hi,{" "}
                  <Link to={`/profile/${user.id || user._id}`}>
                    {user.name || "User"}
                  </Link>
                </span>
                <Link className="btn btn--outline" to="/dashboard">
                  Dashboard
                </Link>
                <button
                  className="btn"
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                >
                  Dil
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--outline" to="/login">
                  Hyr
                </Link>
                <Link className="btn" to="/register">
                  Regjistrohu
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ paddingBottom: "2rem" }}>
        {children || <Outlet />}
      </main>
    </>
  );
}
