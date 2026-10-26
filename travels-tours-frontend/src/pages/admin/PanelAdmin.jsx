import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import TarjetaPaqueteGestion from "../../components/TarjetaPaqueteGestion.jsx";
import {
  getTodosPaquetes,
  aprobarPaquete,
  rechazarPaquete,
  eliminarPaquete,
} from "../../services/paquetesService.js";
import { sacarErrorApi } from "../../services/authService.js";
import FiltrosPaquetesAdmin from "../../components/FiltrosPaquetesAdmin.jsx";
import Paginador from "../../components/Paginador.jsx";
import { filtrarPaquetes, paginarLista } from "../../utils/paquetesLista.js";
import GestionBlog from "./GestionBlog.jsx";

export default function PanelAdmin() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(0);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  async function cargarPaquetes() {
    setLoading(true);
    setError("");
    try {
      const data = await getTodosPaquetes();
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudieron cargar los paquetes."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPaquetes();
  }, []);

  const filtrados = useMemo(
    () => filtrarPaquetes(paquetes, { nombre: filtroNombre, estado: filtroEstado }),
    [paquetes, filtroNombre, filtroEstado]
  );

  const { items: paginaActual, totalPages, totalElements } = useMemo(
    () => paginarLista(filtrados, page),
    [filtrados, page]
  );

  useEffect(() => {
    setPage(0);
  }, [filtroNombre, filtroEstado]);

  async function handleAprobar(id) {
    setBusyId(id);
    try {
      await aprobarPaquete(id);
      await cargarPaquetes();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo aprobar."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleRechazar(id) {
    setBusyId(id);
    try {
      await rechazarPaquete(id);
      await cargarPaquetes();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo rechazar."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleEliminar(id, nombre) {
    if (!window.confirm(`¿Borrar el paquete "${nombre}"?`)) return;
    setBusyId(id);
    setError("");
    try {
      await eliminarPaquete(id);
      await cargarPaquetes();
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudo borrar el paquete."));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-3">
      <h1 className="h3 mb-2">Panel de administración</h1>
      <p className="text-muted mb-4">
        Aprueba pendientes o borra paquetes que ya no quieras en el sistema.
      </p>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <FiltrosPaquetesAdmin
        nombre={filtroNombre}
        estado={filtroEstado}
        onNombreChange={setFiltroNombre}
        onEstadoChange={setFiltroEstado}
      />

      {paquetes.length === 0 ? (
        <p className="text-muted">No hay paquetes registrados.</p>
      ) : filtrados.length === 0 ? (
        <p className="text-muted">No hay paquetes que coincidan con la búsqueda.</p>
      ) : (
        <>
          <p className="text-muted small mb-3">
            {totalElements} paquete{totalElements !== 1 ? "s" : ""} · Página{" "}
            {page + 1} de {totalPages}
          </p>
          <Row xs={1} sm={2} lg={3} className="paquete-list g-4">
            {paginaActual.map((paquete) => (
              <Col key={paquete.id} className="d-flex">
                <TarjetaPaqueteGestion
                  paquete={paquete}
                  variant="admin"
                  busyId={busyId}
                  onAprobar={handleAprobar}
                  onRechazar={handleRechazar}
                  onEliminar={handleEliminar}
                />
              </Col>
            ))}
          </Row>
          <Paginador page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
      <hr className="my-4" />
      <GestionBlog />
    </Container>
  );
}
