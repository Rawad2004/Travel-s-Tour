import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getTodosPaquetes, getVistasPaquete, getMetricasPaquete } from "../../services/paquetesService.js";
import { sacarErrorApi } from "../../services/authService.js";

function Metricas() {
  const [metricas, setMetricas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarMetricas();
  }, []);

  async function cargarMetricas() {
    setLoading(true);
    setError("");
    try {
      const paquetes = await getTodosPaquetes();
      const lista = Array.isArray(paquetes) ? paquetes : [];
      const filas = [];

      for (const paquete of lista) {
        if (!paquete?.id) continue;
        let vistas = 0;
        let metricasApi = {};
        try {
          vistas = await getVistasPaquete(paquete.id);
        } catch {
          vistas = 0;
        }
        try {
          metricasApi = await getMetricasPaquete(paquete.id);
        } catch {
          metricasApi = {};
        }
        filas.push({
          paqueteId: paquete.id,
          nombrePaquete: paquete.name ?? paquete.destination ?? "Paquete",
          vistas: Number(vistas) || 0,
          metricasApi: metricasApi && typeof metricasApi === "object" ? metricasApi : {},
        });
      }

      setMetricas(filas);
    } catch (err) {
      setError(sacarErrorApi(err, "No se pudieron cargar las metricas"));
    } finally {
      setLoading(false);
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
    <Container>
      <h1>Metricas de paquetes</h1>
      {error ? <p className="text-danger">{error}</p> : null}
      <Row>
        {metricas.map((metrica) => (
          <Col key={metrica.paqueteId} sm={12} md={6} lg={4} className="mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{metrica.nombrePaquete}</h5>
                <p className="card-text">Vistas: {metrica.vistas}</p>
                {Object.keys(metrica.metricasApi).length > 0 ? (
                  Object.entries(metrica.metricasApi).map(([clave, valor]) => (
                    <p key={clave} className="card-text small mb-0">
                      {clave}: {String(valor)}
                    </p>
                  ))
                ) : (
                  <p className="card-text small text-muted">Sin metricas extra</p>
                )}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Metricas;
