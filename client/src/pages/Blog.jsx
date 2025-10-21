import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/posts?page=1&limit=9");
        setPosts(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>📖 Blog Posts</h2>
        {user && (
          <Link className="btn" to="/blog/new">
            ✍️ Shkruaj postim
          </Link>
        )}
      </div>

      {loading ? (
        <p>Duke ngarkuar...</p>
      ) : posts.length === 0 ? (
        <p>Nuk ka asnjë postim ende.</p>
      ) : (
        <div
          className="grid"
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
