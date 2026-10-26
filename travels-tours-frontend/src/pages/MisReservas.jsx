import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  getMisReservas,
  getReservasAdmin,
  cancelarReservaAdmin,
  eliminarReserva,
  compararFechaViaje,
  estadoParaMostrar,
  getStatusReserva,
  puedeCancelarReserva,
  rolPuedeCancelarReservas,
  rolPuedeGestionarReservas,
} from "../services/reservasService.js";
import { esAdmin, esAsesor } from "../utils/roles.js";
import { getMisFavoritos } from "../services/favoritosService.js";
import { confirmarPago } from "../services/pagosService.js";
import { sacarErrorApi } from "../services/authService.js";
import { useAuthStore } from "../store/authStore.js";
import EstadoReserva from "../components/EstadoReserva.jsx";
import TarjetaPaquete from "../components/TarjetaPaquete.jsx";

function asReservasList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function FilaReserva({ reserva, onActualizar, mostrarCliente }) {
  const user = useAuthStore((s) => s.user);
  const [pagando, setPagando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorAccion, setErrorAccion] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const statusApi = getStatusReserva(reserva);
  const statusVista = estadoParaMostrar(reserva);
  const cancelada = statusApi === "CANCELLED";
  const pendiente = statusApi === "PENDING";
  const gestionaReservas = rolPuedeGestionarReservas(user);
  const cancelable = gestionaReservas && puedeCancelarReserva(reserva);
  const esHoy = compararFechaViaje(reserva.travelDate) === "hoy";

  async function handlePagar() {
    setErrorAccion("");
    setOkMsg("");
    setPagando(true);
    try {
      await confirmarPago(reserva.id);
      setOkMsg(`Reserva #${reserva.id} pagada.`);
      onActualizar();
    } catch (err) {
      setErrorAccion(sacarErrorApi(err, "No se pudo confirmar el pago."));
    } finally {
      setPagando(false);
    }
  }

  async function handleCancelar() {
    if (!window.confirm("¿Cancelar este viaje?")) return;
    setErrorAccion("");
    setOkMsg("");
    setCancelando(true);
    try {
      await cancelarReservaAdmin(reserva.id);
      setOkMsg(`Reserva #${reserva.id} cancelada.`);
      onActualizar();
    } catch (err) {
      setErrorAccion(sacarErrorApi(err, "No se pudo cancelar."));
    } finally {
      setCancelando(false);
    }
  }

  async function handleEliminar() {
    if (!window.confirm(`¿Eliminar permanentemente la reserva #${reserva.id}?`)) return;
    setErrorAccion("");
    setOkMsg("");
    setEliminando(true);
    try {
      await eliminarReserva(reserva.id);
      onActualizar();
    } catch (err) {
      setErrorAccion(sacarErrorApi(err, "No se pudo eliminar la reserva."));
    } finally {
      setEliminando(false);
    }
  }

  const total = reserva.totalPrice ?? reserva.total;

  return (
    <tr>
      <td className="fw-semibold">#{reserva.id ?? "—"}</td>
      <td>
        <EstadoReserva status={statusVista} />
        {esHoy && statusVista === "IN_PROGRESS" && !cancelada ? (
          <div className="small text-muted mt-1">Viaje hoy</div>
        ) : null}
        {okMsg ? <div className="small text-success mt-1">{okMsg}</div> : null}
        {errorAccion ? (
          <div className="small text-danger mt-1">{errorAccion}</div>
        ) : null}
      </td>
      <td>
        {mostrarCliente ? (
          <div className="small bg-light p-2 rounded mb-2 border">
            <div className="fw-bold">Informacion del Cliente:</div>
            <div>Nombre: {reserva.user?.name ?? "—"}</div>
            <div>Email: {reserva.user?.email ?? "—"}</div>
            <div>Telefono: {reserva.user?.phone ?? "—"}</div>
          </div>
        ) : null}
        <div>{reserva.travelPackage?.name ?? "Paquete"}</div>
        <div className="small text-muted">
          {reserva.travelPackage?.destination ?? ""}
        </div>
        <div className="small">
          Viaje: {reserva.travelDate ?? "—"} · {reserva.numberOfParticipants ?? "?"}{" "}
          pers.
        </div>
        {total != null ? (
          <div className="small fw-semibold text-primary">
            Total: ${Number(total).toLocaleString("es-CO")}
          </div>
        ) : null}
      </td>
      <td className="text-end">
        <div className="d-flex flex-column gap-1 align-items-end">
          {pendiente && !mostrarCliente ? (
            <Button
              variant="success"
              size="sm"
              onClick={handlePagar}
              disabled={pagando || cancelando || eliminando}
            >
              {pagando ? "Pagando…" : "Pagar"}
            </Button>
          ) : null}
          {cancelable ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleCancelar}
              disabled={pagando || cancelando || eliminando}
            >
              {cancelando ? "Cancelando…" : "Cancelar viaje"}
            </Button>
          ) : null}
          {gestionaReservas ? (
            <Button
              variant="danger"
              size="sm"
              onClick={handleEliminar}
              disabled={pagando || cancelando || eliminando}
            >
              {eliminando ? "Eliminando…" : "Eliminar"}
            </Button>
          ) : null}
          {gestionaReservas && esHoy && !cancelable && statusApi !== "CANCELLED" ? (
            <span className="small text-muted">Hoy no se cancela</span>
          ) : null}
          {cancelada && !gestionaReservas ? (
            <span className="small text-muted">Cancelada</span>
          ) : null}
          {!gestionaReservas && !pendiente && !cancelable && !cancelada ? (
            <span className="small text-muted">—</span>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export default function MisReservas() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const admin = esAdmin(user);
  const asesor = esAsesor(user);
  const administradorOAsesor = admin || asesor;

  const reservasQuery = useQuery({
    queryKey: ["mis-reservas", administradorOAsesor ? "admin" : "cliente"],
    queryFn: administradorOAsesor ? getReservasAdmin : getMisReservas,
  });

  const favoritosQuery = useQuery({
    queryKey: ["mis-favoritos"],
    queryFn: getMisFavoritos,
    enabled: !administradorOAsesor,
  });

  const reservas = asReservasList(reservasQuery.data);
  const favoritos = Array.isArray(favoritosQuery.data) ? favoritosQuery.data : [];

  function actualizarTodo() {
    queryClient.invalidateQueries({ queryKey: ["mis-reservas"] });
    queryClient.invalidateQueries({ queryKey: ["mis-favoritos"] });
    reservasQuery.refetch();
    favoritosQuery.refetch();
  }

  return (
    <div className="mis-reservas-page py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">
          {administradorOAsesor ? "Reservas de clientes" : "Mis reservas"}
        </h1>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={actualizarTodo}
        >
          Actualizar
        </button>
      </div>

      <div className="estado-leyenda mb-3 small">
        <span className="me-2">
          <EstadoReserva status="PENDING" /> pendiente de pago
        </span>
        <span className="me-2">
          <EstadoReserva status="CONFIRMED" /> confirmada
        </span>
        <span className="me-2">
          <EstadoReserva status="IN_PROGRESS" /> en curso (viaje hoy)
        </span>
        <span className="me-2">
          <EstadoReserva status="COMPLETED" /> completada
        </span>
        <span>
          <EstadoReserva status="CANCELLED" /> cancelada
        </span>
      </div>

      {reservasQuery.isPending ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : null}

      {reservasQuery.isError ? (
        <Alert variant="danger">
          {sacarErrorApi(reservasQuery.error, "No se pudieron cargar las reservas.")}
        </Alert>
      ) : null}

      {!reservasQuery.isPending && !reservasQuery.isError && reservas.length === 0 ? (
        <p className="text-muted">No tienes reservas todavía.</p>
      ) : null}

      {!reservasQuery.isPending && !reservasQuery.isError && reservas.length > 0 ? (
        <Table responsive hover bordered className="bg-white mis-reservas-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Estado</th>
              <th>Detalle</th>
              <th className="text-end">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <FilaReserva
                key={r.id ?? JSON.stringify(r)}
                reserva={r}
                onActualizar={actualizarTodo}
                mostrarCliente={administradorOAsesor}
              />
            ))}
          </tbody>
        </Table>
      ) : null}

      {!administradorOAsesor ? (
        <>
      <hr className="my-5" />

      <h2 className="h4 mb-3" id="favoritos">
        Mis favoritos
      </h2>

      {favoritosQuery.isPending ? (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </div>
      ) : null}

      {favoritosQuery.isError ? (
        <Alert variant="danger">
          {sacarErrorApi(favoritosQuery.error, "No se pudieron cargar favoritos.")}
        </Alert>
      ) : null}

      {!favoritosQuery.isPending && !favoritosQuery.isError && favoritos.length === 0 ? (
        <p className="text-muted">No guardaste paquetes todavía.</p>
      ) : null}

      {!favoritosQuery.isPending && !favoritosQuery.isError && favoritos.length > 0 ? (
        <Row xs={1} sm={2} lg={3} className="paquete-list g-4">
          {favoritos.map((f) => (
            <Col key={f.id ?? f.travelPackage?.id} className="d-flex">
              <TarjetaPaquete
                paquete={f.travelPackage ?? f}
                favoritoInicial={true}
              />
            </Col>
          ))}
        </Row>
      ) : null}
        </>
      ) : null}
    </div>
  );
}
