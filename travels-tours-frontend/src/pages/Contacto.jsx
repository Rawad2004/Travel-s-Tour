import { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { enviarContacto, sacarErrorApi } from "../services/authService.js";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await enviarContacto(formData);
      setSuccess("Mensaje enviado correctamente");
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (err) {
      setError(sacarErrorApi(err, "Error al enviar mensaje"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page page-content">
      <div className="page-header">
        <h1>Contacto</h1>
        <p>Escríbenos para recibir ayuda personalizada, resolver dudas o recibir una cotización.</p>
      </div>
      <Container>
        <Card className="contact-form shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>} 
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Contacto;