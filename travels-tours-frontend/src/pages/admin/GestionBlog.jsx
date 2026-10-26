import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { getPendingBlogs, aprobarBlog, rechazarBlog } from "../../services/blogService.js";
import { sacarErrorApi } from "../../services/authService.js";

function resumenBlog(blog) {
  const texto = blog.content ?? "";
  if (texto.length <= 100) return texto;
  return `${texto.slice(0, 100)}…`;
}

function GestionBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    cargarBlogs();
  }, []);

  const cargarBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const lista = await getPendingBlogs();
      setBlogs(lista);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo cargar los blogs pendientes"));
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await aprobarBlog(id);
      await cargarBlogs();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo aprobar el blog"));
    } finally {
      setBusyId(null);
    }
  };

  const handleRechazar = async (id, titulo) => {
    if (!window.confirm(`¿Rechazar el blog "${titulo}"? El asesor podrá editarlo y reenviarlo.`)) {
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await rechazarBlog(id);
      await cargarBlogs();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo rechazar el blog"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Container className="px-0">
      <h2 className="h4 mb-3">Gestión de Blog — Artículos pendientes</h2>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {!error && blogs.length === 0 ? (
        <p className="text-muted">No hay blogs pendientes.</p>
      ) : null}
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
                  <Badge bg="warning" text="dark">
                    Pendiente
                  </Badge>
                </div>
                {blog.author?.name ? (
                  <Card.Text className="small text-muted mb-2">
                    Autor: {blog.author.name}
                  </Card.Text>
                ) : null}
                <Card.Text className="small flex-grow-1">{resumenBlog(blog)}</Card.Text>
                <div className="d-flex flex-wrap gap-2 mt-auto">
                  <Button
                    as={Link}
                    to={`/blog/${blog.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Ver detalle
                  </Button>
                  <Button
                    as={Link}
                    to={`/blog/${blog.id}/editar`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    disabled={busyId === blog.id}
                    onClick={() => handleAprobar(blog.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={busyId === blog.id}
                    onClick={() => handleRechazar(blog.id, blog.title)}
                  >
                    Rechazar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GestionBlog;
