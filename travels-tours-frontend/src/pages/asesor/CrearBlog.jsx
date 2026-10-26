import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { crearBlog } from "../../services/blogService.js";
import { sacarErrorApi } from "../../services/authService.js";

export default function CrearBlog({ onCreado }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featuredImage: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const urlImagen = formData.featuredImage.trim();
      await crearBlog({
        title: formData.title.trim(),
        content: formData.content.trim(),
        featuredImage: urlImagen || undefined,
      });
      setSuccess("Blog enviado para aprobacion");
      setFormData({ title: "", content: "", featuredImage: "" });
      setPreviewImage("");
      if (onCreado) onCreado();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo crear el blog"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-3">
      <h2 className="h4">Crear blog</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titulo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contenido</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>URL de imagen (opcional)</Form.Label>
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
          <Form.Text className="text-muted">
            Imagen destacada que se verá en la lista de blogs.
          </Form.Text>
        </Form.Group>
        {previewImage ? (
          <div className="mb-4 text-center">
            <img
              src={previewImage}
              alt="Vista previa"
              className="img-fluid rounded"
              style={{ maxHeight: 200, objectFit: "cover" }}
              onError={() => setPreviewImage("")}
            />
          </div>
        ) : null}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Crear blog"}
        </Button>
      </Form>
    </Container>
  );
}
