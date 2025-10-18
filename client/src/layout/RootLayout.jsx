import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RootLayout({ children }) {
  const { user } = useAuth();

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            ProjectHub
          </Link>
          <nav className="nav">
            <Link to="/projects" className="btn">
              Projects
            </Link>
            <Link to="/post-project" className="btn">
              Posto Projekt
            </Link>

            <Link to="/blog" className="btn">
              Blog
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn">
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
      <main>{children}</main>
    </>
  );
}
