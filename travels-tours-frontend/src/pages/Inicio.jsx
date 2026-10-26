import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getTopRated } from '../services/paquetesService';
import TarjetaPaquete from '../components/TarjetaPaquete';

function Inicio() {
  const [topPaquetes, setTopPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopRated()
      .then(data => {
        setTopPaquetes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar top paquetes:', error);
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
                  Descubre destinos increíbles sin complicaciones
                </h1>
                <p className="lead mb-4">
                  Explora paquetes de viaje seleccionados para ti, con experiencias únicas y ofertas especiales.
                </p>
                <div className="hero-actions d-flex flex-wrap gap-2">
                  <button className="btn btn-light btn-lg">Ver paquetes</button>
                  <button className="btn btn-outline-light btn-lg">Contáctanos</button>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="hero-card shadow-lg">
                <strong>Paquetes destacados</strong>
                <div className="hero-stat">+120 destinos</div>
                <div className="hero-stat">Asistencia en español</div>
                <div className="hero-stat">Equipaje y traslado incluidos</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2>Paquetes Más Valorados</h2>
          <p className="section-intro">
            Reserva hoy tus viajes preferidos y aprovecha precios especiales en destinos nacionales e internacionales.
          </p>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row className="paquete-list">
              {topPaquetes.map(paquete => (
                <Col key={paquete.id} sm={12} md={6} lg={4}>
                  <TarjetaPaquete paquete={paquete} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
}

export default Inicio;