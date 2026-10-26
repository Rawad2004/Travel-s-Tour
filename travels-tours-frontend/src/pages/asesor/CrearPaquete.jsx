import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { crearPaquete } from "../../services/paquetesService.js";
import { sacarErrorApi } from "../../services/authService.js";

function CrearPaquete() {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    price: "",
    description: "",
    itinerary: "",
    durationDays: "",
    maxParticipants: "1",
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const urlImagen = formData.imageUrl.trim();

    try {
      await crearPaquete({
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        itinerary: formData.itinerary.trim(),
        durationDays: Number(formData.durationDays),
        maxParticipants: Number(formData.maxParticipants) || 1,
        images: urlImagen || undefined,
      });
      setSuccess("Paquete creado correctamente");
      setFormData({
        name: "",
        destination: "",
        price: "",
        description: "",
        itinerary: "",
        durationDays: "",
        maxParticipants: "1",
        imageUrl: "",
      });
      setPreviewImage("");
    } catch (err) {
      setError(sacarErrorApi(err, "Error al crear paquete"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Crear Paquete</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destino</Form.Label>
          <Form.Control
            type="text"
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
          <Form.Label>URL de imagen (opcional)</Form.Label>
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
          <Form.Text className="text-muted">
            Pega la URL de una imagen pública para mostrarla en el catálogo y en inicio.
          </Form.Text>
        </Form.Group>

        {previewImage ? (
          <div className="mb-4 text-center">
            <img
              src={previewImage}
              alt="Vista previa"
              className="img-fluid rounded"
              style={{ maxHeight: 240, objectFit: "cover" }}
              onError={() => setPreviewImage("")}
            />
          </div>
        ) : null}

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Paquete"}
        </Button>
      </Form>
    </Container>
  );
}

export default CrearPaquete;
