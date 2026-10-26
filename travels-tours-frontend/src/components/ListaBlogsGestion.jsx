import { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import {
  getTodosBlogs,
  eliminarBlog,
  aprobarBlog,
  rechazarBlog,
} from "../services/blogService.js";
import { sacarErrorApi } from "../services/authService.js";
import { useAuthStore } from "../store/authStore.js";
import { esAdmin, esAsesor } from "../utils/roles.js";
import BlogsListadoPaginado from "./BlogsListadoPaginado.jsx";

export default function ListaBlogsGestion() {
  const user = useAuthStore((s) => s.user);
  const admin = esAdmin(user);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      setBlogs(await getTodosBlogs());
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudieron cargar los blogs."));
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id, titulo) {
    if (!window.confirm(`¿Eliminar el blog "${titulo}"?`)) return;
    setBusyId(id);
    setError("");
    try {
      await eliminarBlog(id);
      await cargar();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo eliminar el blog."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleAprobar(id) {
    setBusyId(id);
    setError("");
    try {
      await aprobarBlog(id);
      await cargar();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo aprobar el blog."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleRechazar(id, titulo) {
    if (
      !window.confirm(
        `¿Rechazar el blog "${titulo}"? El asesor podrá editarlo y reenviarlo.`
      )
    ) {
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await rechazarBlog(id);
      await cargar();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo rechazar el blog."));
    } finally {
      setBusyId(null);
    }
  }

  function puedeBorrar(blog) {
    if (admin) return true;
    if (esAsesor(user)) {
      return String(blog.author?.id) === String(user?.id);
    }
    return false;
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <Container className="py-3 px-0">
      <h2 className="h4 mb-3">Gestión de blogs</h2>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <BlogsListadoPaginado
        blogs={blogs}
        modo="gestion"
        mostrarFiltroEstado
        user={user}
        puedeBorrar={puedeBorrar}
        busyId={busyId}
        onEliminar={handleEliminar}
        onAprobar={admin ? handleAprobar : undefined}
        onRechazar={admin ? handleRechazar : undefined}
        vacio="No hay blogs que coincidan con la búsqueda."
      />
    </Container>
  );
}
