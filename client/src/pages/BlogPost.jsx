import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api(`/api/posts/${id}`);
        setPost(data);
      } catch (e) {
        setError("Nuk u gjet postimi ose ndodhi një gabim.");
        console.error(e);
      }
    })();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Duke ngarkuar...</p>;

  return (
    <div className="container" style={{ maxWidth: 720, marginTop: "2rem" }}>
      {post.coverUrl && (
        <img
          src={post.coverUrl}
          alt={post.title}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
        />
      )}
      <h2>{post.title}</h2>
      <p style={{ opacity: 0.6 }}>nga {post.author?.name || "Anonim"}</p>
      <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{post.body}</div>
      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#eee",
                padding: "0.2rem 0.6rem",
                borderRadius: "4px",
                marginRight: "0.5rem",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
