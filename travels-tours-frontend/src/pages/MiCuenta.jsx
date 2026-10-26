import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { TOKEN_KEY } from "../services/api.js";
import {
  getPerfil,
  actualizarUsuario,
  sacarErrorApi,
} from "../services/authService.js";
import { useAuthStore } from "../store/authStore.js";

export default function MiCuenta() {
  const token = localStorage.getItem(TOKEN_KEY);
  const [perfil, setPerfil] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getPerfil()
      .then((data) => {
        setPerfil(data);
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se pudo cargar el perfil"));
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!perfil?.id) return;
    if (!password.trim()) {
      setError("Escribe tu contraseña actual para guardar los cambios");
      return;
    }
    setGuardando(true);
    setError("");
    setOk("");
    try {
      const actualizado = await actualizarUsuario(perfil.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        role: perfil.role,
      });
      useAuthStore.getState().setSession(actualizado, token);
      setPerfil(actualizado);
      setPassword("");
      setOk("Datos guardados en la base de datos");
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo actualizar el usuario"));
    } finally {
      setGuardando(false);
    }
  }

  if (!token) {
    return (
      <div className="mi-cuenta-page page-content">
        <p className="text-muted">Inicia sesión para ver tu cuenta.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mi-cuenta-page page-content text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const rol = perfil?.role ?? "—";

  return (
    <div className="mi-cuenta-page page-content">
      <div className="page-header">
        <h1>Mi cuenta</h1>
        <p>Actualiza tus datos y mantén tu perfil listo para reservar con tranquilidad.</p>
      </div>
      <Card style={{ maxWidth: 480 }}>
        <Card.Header>Actualizar datos</Card.Header>
        <Card.Body>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          {ok ? <Alert variant="success">{ok}</Alert> : null}
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Form.Text className="text-muted">
                Pon la misma con la que entras al sistema.
              </Form.Text>
            </Form.Group>
            <p className="small text-muted mb-3">
              Rol: <strong>{String(rol)}</strong>
            </p>
            <Button type="submit" variant="primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
