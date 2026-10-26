import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { register as registerRequest, sacarErrorApi } from "../services/authService.js";
import { TOKEN_KEY } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function Registro() {
  const navigate = useNavigate();
  const sessionUser = useAuthStore((s) => s.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem(TOKEN_KEY) && sessionUser) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerRequest(name.trim(), email.trim(), password, phone.trim());
      navigate("/", { replace: true });
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo registrar."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="registro-page login-page py-5">
      <Card className="mx-auto shadow-sm registro-card" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">Crear cuenta cliente</Card.Title>
          <p className="small text-muted mb-3">
            Regístrate para reservar paquetes y guardar favoritos.
          </p>
          {error ? (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          ) : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                autoComplete="new-password"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 btn-registro"
              disabled={loading}
            >
              {loading ? "Creando cuenta…" : "Registrarme"}
            </Button>
          </Form>
          <div className="text-center mt-3 small">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
