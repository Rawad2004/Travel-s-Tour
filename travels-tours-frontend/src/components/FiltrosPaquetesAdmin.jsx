import { Form, Row, Col } from "react-bootstrap";

const ESTADOS = [
  { value: "", label: "Todos los estados" },
  { value: "APPROVED", label: "Aprobado" },
  { value: "PENDING", label: "Pendiente" },
  { value: "REJECTED", label: "Rechazado" },
];

export default function FiltrosPaquetesAdmin({
  nombre,
  estado,
  onNombreChange,
  onEstadoChange,
}) {
  return (
    <Row className="g-3 mb-4">
      <Col md={8}>
        <Form.Group>
          <Form.Label>Buscar por nombre</Form.Label>
          <Form.Control
            type="search"
            placeholder="Nombre o destino del paquete"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Select
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value)}
          >
            {ESTADOS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
}
