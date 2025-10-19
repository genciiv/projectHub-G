// import React...
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function RootLayout({ children }) {
  const { user } = useAuth();

  // Ruaj gjendjen e temës në localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark")
      document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  function toggleTheme() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            ProjectHub
          </Link>
          <nav className="nav">
            <Link to="/projects" className="btn btn--ghost">
              Projects
            </Link>
            <Link to="/blog" className="btn btn--ghost">
              Blog
            </Link>
            <button
              className="btn btn--outline"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              Theme
            </button>
            {user ? (
              <Link to="/dashboard" className="btn">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--outline">
                  Login
                </Link>
                <Link to="/register" className="btn">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="section">{children}</main>
    </>
  );
}
