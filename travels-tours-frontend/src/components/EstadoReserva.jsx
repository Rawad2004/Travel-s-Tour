import Badge from "react-bootstrap/Badge";

const STATUS_TO_BOOTSTRAP = {
  PENDING: "secondary",
  CONFIRMED: "primary",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const STATUS_LABEL = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

export default function EstadoReserva({ status }) {
  const key = typeof status === "string" ? status.toUpperCase() : "";
  const bg = STATUS_TO_BOOTSTRAP[key] ?? "secondary";
  const label = STATUS_LABEL[key] ?? status ?? "—";
  const textClass = bg === "warning" ? "text-dark" : "";

  return (
    <Badge bg={bg} className={`text-uppercase ${textClass}`.trim()}>
      {label}
    </Badge>
  );
}
