import api from "./api.js";
import { esAdmin, esAsesor } from "../utils/roles.js";

export async function getMisReservas() {
  const { data } = await api.get("/bookings/user/my-bookings");
  return data;
}

export async function getReservasPorEstado(status) {
  const { data } = await api.get(`/bookings/status/${status}`);
  return data;
}

export async function getReservasAdmin() {
  const estados = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const listas = await Promise.all(
    estados.map((estado) => getReservasPorEstado(estado))
  );
  const todas = [];
  for (const data of listas) {
    if (Array.isArray(data)) {
      todas.push(...data);
    }
  }
  return todas;
}

export function getStatusReserva(reserva) {
  const raw = reserva?.status ?? reserva?.bookingStatus ?? "";
  let s = String(raw).toUpperCase().trim();
  if (s === "CANCELED") s = "CANCELLED";
  return s;
}

export async function crearReserva(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function getReserva(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
}

export async function cambiarEstadoReserva(id, status) {
  const { data } = await api.patch(`/bookings/${id}/status/${status}`);
  return data;
}

export function rolPuedeGestionarReservas(user) {
  return esAdmin(user) || esAsesor(user);
}

export function rolPuedeCancelarReservas(user) {
  return rolPuedeGestionarReservas(user);
}

export async function eliminarReserva(id) {
  await api.delete(`/bookings/${id}`);
}

export async function cancelarReservaAdmin(id) {
  return cambiarEstadoReserva(id, "CANCELLED");
}

export function fechaHoy() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

export function soloFechaViaje(travelDate) {
  if (!travelDate) return null;
  return String(travelDate).slice(0, 10);
}

export function compararFechaViaje(travelDate) {
  const fecha = soloFechaViaje(travelDate);
  const hoy = fechaHoy();
  if (!fecha) return "sin-fecha";
  if (fecha < hoy) return "pasado";
  if (fecha === hoy) return "hoy";
  return "futuro";
}

export function estadoParaMostrar(reserva) {
  const statusApi = getStatusReserva(reserva);
  if (statusApi === "CANCELLED") return "CANCELLED";
  if (statusApi === "COMPLETED") return "COMPLETED";

  const cuando = compararFechaViaje(reserva?.travelDate);
  if (cuando === "hoy" && statusApi !== "CANCELLED") return "IN_PROGRESS";
  if (cuando === "pasado" && statusApi !== "CANCELLED") return "COMPLETED";
  return statusApi;
}

export function puedeCancelarReserva(reserva) {
  const api = getStatusReserva(reserva);
  if (api === "CANCELLED" || api === "COMPLETED" || api === "IN_PROGRESS") {
    return false;
  }
  if (compararFechaViaje(reserva?.travelDate) !== "futuro") return false;
  return api === "PENDING" || api === "CONFIRMED";
}
