import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import TarjetaPaquete from "../components/TarjetaPaquete.jsx";
import { getTopRated } from "../services/paquetesService.js";

export default function HomePage() {
  const [topPaquetes, setTopPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  function normalizarPaquetes(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.packages)) return data.packages;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }

  useEffect(() => {
    getTopRated()
      .then((data) => {
        const arr = normalizarPaquetes(data);
        setTopPaquetes(arr.slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="hero-content">
                <div className="hero-labels mb-4">
                  <span className="hero-label">Mejor tarifa garantizada</span>
                  <span className="hero-label">Soporte 24/7</span>
                  <span className="hero-label">Rutas exclusivas</span>
                </div>
                <h1 className="display-5 fw-bold">
                  Viaja con confianza y descubre destinos inolvidables
                </h1>
                <p className="lead mb-4">
                  Encuentra paquetes exclusivos para tu próxima aventura, con ayuda personalizada y precios competitivos.
                </p>
                <div className="hero-actions d-flex flex-wrap gap-2">
                  <Button as={Link} to="/catalogo" variant="light" size="lg">
                    Ver paquetes
                  </Button>
                  <Button as={Link} to="/contacto" variant="outline-light" size="lg">
                    Contáctanos
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="hero-card shadow-lg">
                <strong>Paquetes destacados</strong>
                <div className="hero-stat">+120 destinos</div>
                <div className="hero-stat">Asistencia en español</div>
                <div className="hero-stat">Traslados incluidos</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="home-packages py-4 py-md-5 pb-5">
        <h2>Los más valorados</h2>
        <p className="section-intro">
          Reserva hoy tus viajes preferidos y aprovecha precios especiales en destinos nacionales e internacionales.
        </p>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : null}
        {!loading && topPaquetes.length === 0 ? (
          <p className="text-muted">Aún no hay paquetes destacados.</p>
        ) : null}
        {!loading && topPaquetes.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="paquete-list g-4">
            {topPaquetes.map((paquete) => (
              <Col key={paquete.id} className="d-flex">
                <TarjetaPaquete paquete={paquete} />
              </Col>
            ))}
          </Row>
        ) : null}
      </Container>
    </div>
  );
}
