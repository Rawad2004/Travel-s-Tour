import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getTodosPaquetes } from "../../services/paquetesService.js";
import FiltrosPaquetesAdmin from "../../components/FiltrosPaquetesAdmin.jsx";
import Paginador from "../../components/Paginador.jsx";
import TarjetaPaqueteGestion from "../../components/TarjetaPaqueteGestion.jsx";
import { filtrarPaquetes, paginarLista } from "../../utils/paquetesLista.js";

function MisPaquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    cargarPaquetes();
  }, []);

  const cargarPaquetes = async () => {
    try {
      const data = await getTodosPaquetes();
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Container className="py-3">
      <h1 className="h3 mb-3">Estado de paquetes</h1>
      <FiltrosPaquetesAdmin
        nombre={filtroNombre}
        estado={filtroEstado}
        onNombreChange={setFiltroNombre}
        onEstadoChange={setFiltroEstado}
      />
      {filtrados.length === 0 ? (
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
                <TarjetaPaqueteGestion paquete={paquete} variant="asesor" />
              </Col>
            ))}
          </Row>
          <Paginador page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </Container>
  );
}

export default MisPaquetes;
