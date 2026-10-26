import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { getBlog, actualizarBlog } from "../services/blogService.js";
import { sacarErrorApi } from "../services/authService.js";

export default function EditarBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getBlog(id)
      .then((blog) => {
        setFormData({
          title: blog.title ?? "",
          content: blog.content ?? "",
          featuredImage: blog.featuredImage ?? "",
        });
        setPreviewImage(blog.featuredImage ?? "");
        setLoading(false);
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se pudo cargar el blog."));
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await actualizarBlog(id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        featuredImage: formData.featuredImage.trim() || undefined,
      });
      setSuccess(
        "Blog actualizado y enviado de nuevo a revisión del administrador."
      );
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo actualizar el blog."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!formData) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || "Blog no encontrado."}</Alert>
        <Link to="/dashboard">Volver al dashboard</Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Editar blog</h1>
      <Alert variant="info" className="small">
        Tras guardar, el artículo volverá a estado <strong>pendiente</strong> para
        aprobación del administrador.
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contenido</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>URL de imagen</Form.Label>
          <Form.Control
            type="url"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={(e) => {
              handleChange(e);
              setPreviewImage(e.target.value);
            }}
            placeholder="https://..."
          />
        </Form.Group>
        {previewImage ? (
          <div className="mb-4 text-center">
            <img
              src={previewImage}
              alt="Vista previa"
              className="img-fluid rounded"
              style={{ maxHeight: 200, objectFit: "cover" }}
            />
          </div>
        ) : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {success ? <Alert variant="success">{success}</Alert> : null}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar y reenviar"}
          </Button>
          <Button variant="outline-secondary" as={Link} to={`/blog/${id}`}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
