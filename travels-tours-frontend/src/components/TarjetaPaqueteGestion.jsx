import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import { imagenPaquete } from "../utils/imagenPaquete.js";

function badgeEstado(status) {
  const s = String(status ?? "").toUpperCase();
  if (s === "APPROVED") return <Badge bg="success">Aprobado</Badge>;
  if (s === "PENDING") return <Badge bg="warning" text="dark">Pendiente</Badge>;
  if (s === "REJECTED") return <Badge bg="danger">Rechazado</Badge>;
  return <Badge bg="secondary">{s || "—"}</Badge>;
}

export default function TarjetaPaqueteGestion({
  paquete,
  variant = "asesor",
  busyId,
  onAprobar,
  onRechazar,
  onEliminar,
}) {
  const pendiente = String(paquete.status).toUpperCase() === "PENDING";
  const nombre = paquete.name ?? paquete.destination ?? "Paquete";

  return (
    <Card className="h-100 shadow-sm tarjeta-paquete w-100">
      <Card.Img
        variant="top"
        src={imagenPaquete(paquete)}
        alt={nombre}
        style={{ height: 180, objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title className="fs-6 mb-0">{nombre}</Card.Title>
          {badgeEstado(paquete.status)}
        </div>
        <Card.Text className="text-muted small mb-2">
          {paquete.destination}
        </Card.Text>
        <Card.Text className="fw-bold mb-2">
          ${Number(paquete.price ?? 0).toLocaleString("es-CO")}
        </Card.Text>
        {paquete.viewCount != null ? (
          <Card.Text className="small text-muted mb-2">
            Vistas: {paquete.viewCount}
          </Card.Text>
        ) : null}
        <div className="d-flex flex-wrap gap-2 mt-auto">
          <Button
            variant="secondary"
            size="sm"
            as={Link}
            to={`/paquete/${paquete.id}`}
          >
            Ver detalle
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            as={Link}
            to={`/paquete/${paquete.id}/editar`}
          >
            Editar
          </Button>
          {variant === "admin" && pendiente ? (
            <>
              <Button
                variant="success"
                size="sm"
                disabled={busyId === paquete.id}
                onClick={() => onAprobar?.(paquete.id)}
              >
                Aprobar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                disabled={busyId === paquete.id}
                onClick={() => onRechazar?.(paquete.id)}
              >
                Rechazar
              </Button>
            </>
          ) : null}
          {variant === "admin" ? (
            <Button
              variant="danger"
              size="sm"
              disabled={busyId === paquete.id}
              onClick={() => onEliminar?.(paquete.id, nombre)}
            >
              {busyId === paquete.id ? "…" : "Borrar"}
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}
