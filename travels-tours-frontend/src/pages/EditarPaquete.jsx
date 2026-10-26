import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { getPaquete, actualizarPaquete } from "../services/paquetesService.js";
import { sacarErrorApi } from "../services/authService.js";

export default function EditarPaquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getPaquete(id)
      .then((pkg) => {
        setFormData({
          name: pkg.name ?? "",
          destination: pkg.destination ?? "",
          price: String(pkg.price ?? ""),
          description: pkg.description ?? "",
          itinerary: pkg.itinerary ?? "",
          durationDays: String(pkg.durationDays ?? ""),
          maxParticipants: String(pkg.maxParticipants ?? "1"),
          imageUrl: pkg.images ?? "",
        });
        setPreviewImage(pkg.images ?? "");
        setLoading(false);
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se pudo cargar el paquete."));
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
      await actualizarPaquete(id, {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        itinerary: formData.itinerary.trim(),
        durationDays: Number(formData.durationDays),
        maxParticipants: Number(formData.maxParticipants) || 1,
        images: formData.imageUrl.trim() || undefined,
      });
      setSuccess(
        "Cambios guardados. El paquete quedó en estado pendiente para revisión del administrador."
      );
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo actualizar el paquete."));
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
        <Alert variant="danger">{error || "Paquete no encontrado."}</Alert>
        <Link to="/dashboard">Volver al dashboard</Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="h3 mb-3">Editar paquete</h1>
      <Alert variant="info" className="small">
        Al guardar, el paquete pasará a estado <strong>pendiente</strong> hasta que un
        administrador lo apruebe o rechace.
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Destino</Form.Label>
          <Form.Control
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Itinerario</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="itinerary"
            value={formData.itinerary}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Duración (días)</Form.Label>
          <Form.Control
            type="number"
            name="durationDays"
            value={formData.durationDays}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Máx. participantes</Form.Label>
          <Form.Control
            type="number"
            min="1"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>URL de imagen</Form.Label>
          <Form.Control
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
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
              style={{ maxHeight: 240, objectFit: "cover" }}
            />
          </div>
        ) : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {success ? <Alert variant="success">{success}</Alert> : null}
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
          <Button variant="outline-secondary" as={Link} to={`/paquete/${id}`}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
