import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import TarjetaPaquete from "../components/TarjetaPaquete.jsx";
import Paginador from "../components/Paginador.jsx";
import { getPaquetesAprobados } from "../services/paquetesService.js";
import { sacarErrorApi } from "../services/authService.js";

export default function Catalogo() {
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getPaquetesAprobados(page)
      .then((data) => {
        setLista(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalElements(data.totalElements ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se pudo cargar el catálogo."));
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="catalogo-page page-content">
      <div className="page-header">
        <h1>Catálogo de viajes</h1>
        <p>Explora nuestros paquetes disponibles con precios, destino y reseñas destacadas.</p>
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {!loading && !error && lista.length === 0 ? (
        <p className="text-muted">No hay paquetes publicados.</p>
      ) : null}
      {!loading && !error && lista.length > 0 ? (
        <>
          <p className="text-muted small mb-3">
            {totalElements} paquete{totalElements !== 1 ? "s" : ""} · Página{" "}
            {page + 1} de {totalPages}
          </p>
          <Row xs={1} sm={2} lg={3} className="paquete-list g-4">
            {lista.map((p) => (
              <Col key={p.id} className="d-flex">
                <TarjetaPaquete paquete={p} />
              </Col>
            ))}
          </Row>
          <Paginador
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  );
}
