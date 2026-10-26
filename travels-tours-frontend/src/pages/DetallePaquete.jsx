import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import { getPaquete } from "../services/paquetesService.js";
import { crearReserva, getMisReservas } from "../services/reservasService.js";
import { confirmarPago } from "../services/pagosService.js";
import { crearResena, getResenasPaquete } from "../services/resenasService.js";
import { useRequestState } from "../hooks/useRequestState.js";
import { TOKEN_KEY } from "../services/api.js";
import { sacarErrorApi } from "../services/authService.js";
import { getFechaServidor } from "../services/metaService.js";
import EstrellaRating from "../components/EstrellaRating.jsx";
import { imagenPaquete } from "../utils/imagenPaquete.js";
import { useAuthStore } from "../store/authStore.js";
import { esAdmin, esAsesor } from "../utils/roles.js";
import Badge from "react-bootstrap/Badge";

function imagenesPaquete(p) {
  const raw = p?.images ?? p?.image ?? p?.featuredImage ?? p?.thumbnail ?? "";
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    const list = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return list.length ? list : [raw];
  }
  return [];
}

function imagenPrincipal(p) {
  const imgs = imagenesPaquete(p);
  return imgs[0] ?? "https://placehold.co/800x400?text=Paquete";
}

export default function DetallePaquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const esStaff = esAdmin(user) || esAsesor(user);

  const [paquete, setPaquete] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [travelDate, setTravelDate] = useState("");
  const [participantes, setParticipantes] = useState(1);
  const [notas, setNotas] = useState("");

  const [reservaPendiente, setReservaPendiente] = useState(null);
  const reservaRequest = useRequestState();
  const pagoRequest = useRequestState();

  const [reservaOk, setReservaOk] = useState(null);

  const [bookingParaResena, setBookingParaResena] = useState(null);
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState("");
  const [resenaBusy, setResenaBusy] = useState(false);
  const [resenaMsg, setResenaMsg] = useState("");

  const [fechaMinima, setFechaMinima] = useState("");

  useEffect(() => {
    getFechaServidor()
      .then(setFechaMinima)
      .catch(() => {
        setFechaMinima(new Date().toISOString().split("T")[0]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      getPaquete(id),
      getResenasPaquete(id).catch(() => []),
    ])
      .then(([pkg, revs]) => {
        setPaquete(pkg);
        setResenas(Array.isArray(revs) ? revs : []);
        const imgs = imagenesPaquete(pkg);
        setGalleryImages(imgs);
        setSelectedImage(imgs[0] || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(sacarErrorApi(err, "No se encontró el paquete."));
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !paquete?.id) return;
    getMisReservas()
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        const found = lista.find((b) => {
          const pkgId = b.travelPackage?.id ?? b.packageId;
          return (
            String(pkgId) === String(paquete.id) &&
            String(b.status).toUpperCase() === "COMPLETED"
          );
        });
        if (found && !found.review) setBookingParaResena(found);
      })
      .catch(() => {});
  }, [paquete?.id]);

  function irLogin() {
    navigate("/login", { state: { from: { pathname: `/paquete/${id}` } } });
  }

  async function handleReservar(e) {
    e.preventDefault();
    reservaRequest.reset();
    if (!localStorage.getItem(TOKEN_KEY)) {
      irLogin();
      return;
    }
    if (fechaMinima && travelDate && travelDate < fechaMinima) {
      reservaRequest.failure(
        "La fecha no puede ser anterior a la fecha actual del servidor."
      );
      return;
    }
    reservaRequest.start();
    try {
      const nueva = await crearReserva({
        packageId: Number(id),
        travelDate,
        numberOfParticipants: Number(participantes),
        specialRequests: notas || undefined,
      });
      setReservaPendiente(nueva);
      reservaRequest.success("Reserva creada");
    } catch (err) {
      reservaRequest.failure(sacarErrorApi(err, "No se pudo crear la reserva"));
    }
  }

  async function handlePagar() {
    if (!reservaPendiente?.id) return;
    pagoRequest.reset();
    pagoRequest.start();
    try {
      const confirmada = await confirmarPago(reservaPendiente.id);
      setReservaOk(confirmada);
      setReservaPendiente(null);
      pagoRequest.success("Pago confirmado");
    } catch (err) {
      pagoRequest.failure(sacarErrorApi(err, "El pago no se completo"));
    }
  }

  async function handleResena(e) {
    e.preventDefault();
    if (!bookingParaResena?.id) return;
    setResenaMsg("");
    setResenaBusy(true);
    try {
      await crearResena({
        bookingId: bookingParaResena.id,
        rating: Number(rating),
        comment: comentario,
      });
      setResenaMsg("Reseña enviada.");
      setBookingParaResena(null);
      const revs = await getResenasPaquete(id);
      setResenas(Array.isArray(revs) ? revs : []);
    } catch (err) {
      setResenaMsg(sacarErrorApi(err, "No se pudo guardar la reseña."));
    } finally {
      setResenaBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}{" "}
        <Link to="/catalogo">Volver al catálogo</Link>
      </Alert>
    );
  }

  if (reservaOk) {
    const num = reservaOk.id ?? reservaOk.bookingId;
    return (
      <Card className="text-center py-5 shadow-sm">
        <Card.Body>
          <h2 className="h4 text-success">Pago confirmado</h2>
          <p className="mb-1">Tu reserva quedó registrada.</p>
          <p className="fs-5 fw-bold">Número de reserva: #{num}</p>
          <Button as={Link} to="/mis-reservas" variant="primary" className="me-2">
            Ver mis reservas
          </Button>
          <Button as={Link} to="/catalogo" variant="outline-secondary">
            Seguir viendo paquetes
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const maxP = paquete.maxParticipants ?? 10;
  const estadoPkg = String(paquete.status ?? "APPROVED").toUpperCase();
  const paqueteAprobado = estadoPkg === "APPROVED";
  const puedeReservar = paqueteAprobado && !esStaff;

  return (
    <div className="detalle-paquete-page page-content py-3 position-relative">
      <Row className="g-4">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="h3 mb-0">{paquete.name}</h1>
              {!paqueteAprobado ? (
                <Badge
                  bg={
                    estadoPkg === "PENDING"
                      ? "warning"
                      : estadoPkg === "REJECTED"
                        ? "danger"
                        : "secondary"
                  }
                  text={estadoPkg === "PENDING" ? "dark" : undefined}
                  className="mt-2"
                >
                  {estadoPkg === "PENDING"
                    ? "Pendiente de aprobación"
                    : estadoPkg === "REJECTED"
                      ? "Rechazado"
                      : estadoPkg}
                </Badge>
              ) : null}
            </div>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="rounded-circle"
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              &times;
            </Button>
          </div>
          <div className="detalle-imagenes mb-3">
            <img
              src={selectedImage || imagenPrincipal(paquete)}
              alt={paquete.name}
              className="img-fluid rounded w-100"
              style={{ maxHeight: 420, objectFit: "cover" }}
            />
            {galleryImages.length > 1 ? (
              <div className="gallery-thumbs d-flex flex-wrap gap-2 mt-3">
                {galleryImages.map((src, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`gallery-thumb btn p-0 border rounded ${
                      src === selectedImage ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(src)}
                  >
                    <img
                      src={src}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: 80,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <p className="text-muted">{paquete.destination}</p>
          <p>{paquete.description}</p>
          {paquete.itinerary ? (
            <>
              <h2 className="h5">Itinerario</h2>
              <p className="small">{paquete.itinerary}</p>
            </>
          ) : null}
          <p className="small text-muted">
            {paquete.durationDays} días · máx. {maxP} personas
          </p>

          <hr />
          <h2 className="h5">Opiniones</h2>
          {resenas.length === 0 ? (
            <p className="text-muted small">Sin reseñas aún.</p>
          ) : (
            resenas.map((r) => (
              <div key={r.id} className="mb-2 border-bottom pb-2">
                <EstrellaRating rating={r.rating} />
                <p className="small mb-0">{r.comment}</p>
              </div>
            ))
          )}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: 80 }}>
            <Card.Body>
              <p className="fs-4 fw-bold mb-3">
                ${Number(paquete.price ?? 0).toLocaleString("es-CO")}
              </p>

              {esStaff ? (
                <div className="d-grid gap-2 mb-3">
                  <Button as={Link} to={`/paquete/${id}/editar`} variant="outline-primary">
                    Editar paquete
                  </Button>
                  {!paqueteAprobado ? (
                    <p className="small text-muted mb-0">
                      Vista previa del equipo. Los clientes solo reservan paquetes
                      aprobados.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {!puedeReservar && !esStaff ? (
                <Alert variant="warning" className="small">
                  Este paquete no está disponible para reserva en este momento.
                </Alert>
              ) : null}

              {puedeReservar && reservaPendiente ? (
                <>
                  <Alert variant="info" className="small">
                    Reserva #{reservaPendiente.id} creada. Simula el pago para
                    confirmarla.
                  </Alert>
                  {pagoRequest.error ? (
                    <Alert variant="danger" className="py-2 small">
                      {pagoRequest.error}
                    </Alert>
                  ) : null}
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={handlePagar}
                    disabled={pagoRequest.loading}
                  >
                    {pagoRequest.loading ? "Procesando..." : "Pagar (simulado)"}
                  </Button>
                </>
              ) : puedeReservar ? (
                <Form onSubmit={handleReservar}>
                  {reservaRequest.error ? (
                    <Alert variant="danger" className="py-2 small">
                      {reservaRequest.error}
                    </Alert>
                  ) : null}
                  <Form.Group className="mb-2">
                    <Form.Label>Fecha de viaje</Form.Label>
                    <Form.Control
                      type="date"
                      min={fechaMinima || undefined}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Participantes</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      max={maxP}
                      value={participantes}
                      onChange={(e) => setParticipantes(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Notas (opcional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={reservaRequest.loading}
                  >
                    {reservaRequest.loading ? "Reservando..." : "Reservar"}
                  </Button>
                </Form>
              ) : null}
            </Card.Body>
          </Card>

          {bookingParaResena ? (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <Card.Title className="h6">Deja tu reseña</Card.Title>
                <p className="small text-muted">
                  Viajaste este paquete. Cuéntanos cómo fue.
                </p>
                <Form onSubmit={handleResena}>
                  <Form.Group className="mb-2">
                    <Form.Label>Calificación</Form.Label>
                    <Form.Select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={3}>3</option>
                      <option value={2}>2</option>
                      <option value={1}>1</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      required
                    />
                  </Form.Group>
                  {resenaMsg ? (
                    <p className="small text-muted">{resenaMsg}</p>
                  ) : null}
                  <Button type="submit" size="sm" disabled={resenaBusy}>
                    Enviar reseña
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}
