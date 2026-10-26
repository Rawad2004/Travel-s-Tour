import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { getBlog } from "../services/blogService.js";
import { sacarErrorApi } from "../services/authService.js";

function fechaBlog(blog) {
  const raw = blog.createdAt ?? blog.updatedAt ?? "";
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return String(raw).slice(0, 10);
  return d.toLocaleDateString("es-CO");
}

export default function ArticuloBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getBlog(id)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se pudo cargar el artículo."));
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/blogs">Volver al blog</Link>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="py-4">
        <p className="text-muted">Artículo no encontrado.</p>
        <Link to="/blogs">Volver al blog</Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {blog.featuredImage ? (
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="img-fluid rounded mb-3 w-100"
          style={{ maxHeight: 320, objectFit: "cover" }}
        />
      ) : null}
      <h1 className="h3">{blog.title}</h1>
      {fechaBlog(blog) ? (
        <p className="text-muted small">{fechaBlog(blog)}</p>
      ) : null}
      {blog.author?.name ? (
        <p className="small text-muted">Por {blog.author.name}</p>
      ) : null}
      <div className="blog-contenido" style={{ whiteSpace: "pre-wrap" }}>
        {blog.content}
      </div>
      <div className="mt-4">
        <Link to="/blogs">← Volver al blog</Link>
      </div>
    </Container>
  );
}
