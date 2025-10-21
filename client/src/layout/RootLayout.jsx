// client/src/layout/RootLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

function Avatar({ name, url, size = 28 }) {
  const src =
    url ||
    `https://api.dicebear.com/7.4/initials/svg?seed=${encodeURIComponent(name || "User")}`;
  return (
    <img
      src={src}
      alt={name || "User"}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        objectFit: "cover",
      }}
    />
  );
}

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (to) =>
    pathname === to ? { color: "var(--accent)", fontWeight: 700 } : {};

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav-inner">
          {/* Brand + nav */}
          <nav className="nav-left">
            <Link to="/" className="brand">
              <span className="brand-dot" /> ProjectHub-G
            </Link>
            <div className="nav-links">
              <Link to="/feed" style={isActive("/feed")} className="nav-link">
                Feed
              </Link>
              <Link to="/projects" style={isActive("/projects")} className="nav-link">
                Projects
              </Link>
              <Link to="/blog" style={isActive("/blog")} className="nav-link">
                Blog
              </Link>
            </div>
          </nav>

          {/* Actions */}
          <div className="nav-right">
            <ThemeToggle />

            {user ? (
              <>
                <Link className="btn btn--outline hide-sm" to="/post-project">
                  + Projekt
                </Link>
                <Link className="btn btn--outline hide-sm" to="/blog/new">
                  + Postim
                </Link>

                <Link
                  to={`/profile/${user._id || user.id}`}
                  className="nav-profile"
                  title="Profili im"
                >
                  <Avatar name={user.name} url={user.avatarUrl} />
                  <span className="hide-sm">{user.name || "User"}</span>
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

      {/* CONTAINER */}
      <main className="main">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} ProjectHub-G</span>
          <div className="row" style={{ gap: ".75rem" }}>
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Blog</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
