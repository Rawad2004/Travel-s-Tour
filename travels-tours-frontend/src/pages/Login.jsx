import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { login as loginRequest, sacarErrorApi } from "../services/authService.js";
import { TOKEN_KEY } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";
import { esAdmin, esAsesor } from "../utils/roles.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = useAuthStore((s) => s.user);
  const from = location.state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
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
      const { user } = await loginRequest(email, password);
      if (esAdmin(user) || esAsesor(user)) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo iniciar sesión."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-3">Iniciar sesión</Card.Title>
          {error ? (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          ) : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Entrando…" : "Iniciar sesión"}
            </Button>
          </Form>
          <div className="text-center mt-3 small">
            <Link to="/registro" className="me-2">
              Crear cuenta
            </Link>
            · <Link to="/">Inicio</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
