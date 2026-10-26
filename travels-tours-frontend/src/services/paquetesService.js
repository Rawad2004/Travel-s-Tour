import api from "./api.js";
import { PAQUETES_POR_PAGINA } from "../constants/paquetes.js";

export async function getPaquetesAprobados(
  page = 0,
  size = PAQUETES_POR_PAGINA
) {
  const { data } = await api.get("/packages/approved", {
    params: { page, size },
  });
  if (data?.content) {
    return {
      content: data.content,
      page: data.number ?? page,
      totalPages: data.totalPages ?? 1,
      totalElements: data.totalElements ?? data.content.length,
    };
  }
  const lista = Array.isArray(data) ? data : [];
  return {
    content: lista,
    page: 0,
    totalPages: 1,
    totalElements: lista.length,
  };
}

export async function getPaquete(id) {
  const { data } = await api.get(`/packages/${id}`);
  return data;
}

export async function getTopRated() {
  const { data } = await api.get("/packages/top-rated");
  return data;
}

export async function getTodosPaquetes() {
  const { data } = await api.get("/packages");
  return data;
}

export async function aprobarPaquete(id) {
  const { data } = await api.post(`/packages/${id}/approve`);
  return data;
}

export async function rechazarPaquete(id) {
  const { data } = await api.post(`/packages/${id}/reject`);
  return data;
}

export async function crearPaquete(payload) {
  const { data } = await api.post("/packages", payload);
  return data;
}

export async function actualizarPaquete(id, payload) {
  const { data } = await api.put(`/packages/${id}`, payload);
  return data;
}

export async function eliminarPaquete(id) {
  await api.delete(`/packages/${id}`);
}

export async function getVistasPaquete(packageId) {
  const { data } = await api.get(`/analytics/packages/${packageId}/views`);
  return data;
}

export async function getMetricasPaquete(packageId) {
  const { data } = await api.get(`/analytics/packages/${packageId}/metrics`);
  return data;
}
