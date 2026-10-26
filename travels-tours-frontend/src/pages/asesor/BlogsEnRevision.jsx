import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from "react-bootstrap";
import {
  getMisBlogsEnRevision,
  blogSePuedeEditar,
} from "../../services/blogService.js";
import { sacarErrorApi } from "../../services/authService.js";
import { useAuthStore } from "../../store/authStore.js";

function resumenBlog(blog) {
  const texto = blog.content ?? "";
  if (texto.length <= 100) return texto;
  return `${texto.slice(0, 100)}…`;
}

function badgeRevision(status) {
  const s = String(status ?? "").toUpperCase();
  if (s === "REJECTED") {
    return <Badge bg="danger">Rechazado — edita y reenvía</Badge>;
  }
  return <Badge bg="warning" text="dark">En revisión</Badge>;
}

export default function BlogsEnRevision({ recargar }) {
  const user = useAuthStore((s) => s.user);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    cargarBlogs();
  }, [user?.id, recargar]);

  async function cargarBlogs() {
    setLoading(true);
    setError("");
    try {
      const lista = await getMisBlogsEnRevision(user.id);
      setBlogs(lista);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudieron cargar tus blogs en revisión"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-3 text-center">
        <Spinner animation="border" size="sm" />
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <h2 className="h4 mb-2">Blogs en revisión</h2>
      <p className="text-muted small mb-4">
        Pendientes de aprobación o rechazados por el administrador (puedes editarlos y
        reenviarlos).
      </p>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {!error && blogs.length === 0 ? (
        <p className="text-muted">No tienes blogs pendientes ni rechazados.</p>
      ) : null}
      {!error && blogs.length > 0 ? (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {blogs.map((blog) => (
            <Col key={blog.id} className="d-flex">
              <Card className="h-100 shadow-sm w-100">
                {blog.featuredImage ? (
                  <Card.Img
                    variant="top"
                    src={blog.featuredImage}
                    alt={blog.title}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                ) : null}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <Card.Title className="fs-6 mb-0">{blog.title}</Card.Title>
                    {badgeRevision(blog.status)}
                  </div>
                  <Card.Text className="small flex-grow-1">
                    {resumenBlog(blog)}
                  </Card.Text>
                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <Button
                      as={Link}
                      to={`/blog/${blog.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      Ver detalle
                    </Button>
                    {blogSePuedeEditar(blog, user) ? (
                      <Button
                        as={Link}
                        to={`/blog/${blog.id}/editar`}
                        variant="outline-primary"
                        size="sm"
                      >
                        Editar
                      </Button>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </Container>
  );
}
