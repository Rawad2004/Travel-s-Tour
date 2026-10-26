import { useEffect, useState, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import {
  getBlogs,
  getTodosBlogs,
  eliminarBlog,
  aprobarBlog,
  rechazarBlog,
} from "../services/blogService.js";
import { sacarErrorApi } from "../services/authService.js";
import { useAuthStore } from "../store/authStore.js";
import { esAdmin, esAsesor } from "../utils/roles.js";
import BlogsListadoPaginado from "../components/BlogsListadoPaginado.jsx";

export default function Blog() {
  const user = useAuthStore((s) => s.user);
  const admin = esAdmin(user);
  const asesor = esAsesor(user);
  const esStaff = admin || asesor;
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const lista = esStaff ? await getTodosBlogs() : await getBlogs();
      setBlogs(lista);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudieron cargar los blogs."));
    } finally {
      setLoading(false);
    }
  }, [esStaff]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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
    if (asesor) return String(blog.author?.id) === String(user?.id);
    return false;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="blog-page page-content">
      <Container className="py-4">
        <div className="page-header">
          <h1>Blog</h1>
          <p>
            {admin
              ? "Administra artículos: ver, editar, aprobar, rechazar o borrar."
              : asesor
                ? "Gestiona tus artículos: ver detalle, editar y reenviar a revisión."
                : "Lee artículos de viaje, recomendaciones y consejos para tu próxima aventura."}
          </p>
        </div>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        {!error && blogs.length === 0 ? (
          <p className="text-muted">
            {esStaff
              ? "No hay artículos registrados."
              : "No hay artículos publicados todavía."}
          </p>
        ) : null}
        {!error && blogs.length > 0 ? (
          <BlogsListadoPaginado
            blogs={blogs}
            modo={esStaff ? "gestion" : "publico"}
            mostrarFiltroEstado={esStaff}
            user={user}
            puedeBorrar={esStaff ? puedeBorrar : undefined}
            busyId={busyId}
            onEliminar={esStaff ? handleEliminar : undefined}
            onAprobar={admin ? handleAprobar : undefined}
            onRechazar={admin ? handleRechazar : undefined}
            vacio="No hay artículos que coincidan con tu búsqueda."
          />
        ) : null}
      </Container>
    </div>
  );
}
