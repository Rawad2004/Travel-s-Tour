import api from "./api.js";
import { esAdmin, esAsesor } from "../utils/roles.js";

function sacarLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

export async function getBlogs() {
  const { data } = await api.get("/blogs/approved");
  return sacarLista(data);
}

export async function getBlog(id) {
  const { data } = await api.get(`/blogs/${id}`);
  return data;
}

export async function getTodosBlogs() {
  const { data } = await api.get("/blogs");
  return sacarLista(data);
}

export async function getPendingBlogs() {
  const { data } = await api.get("/blogs/pending");
  return sacarLista(data);
}

export async function crearBlog(payload) {
  const { data } = await api.post("/blogs", payload);
  return data;
}

export async function actualizarBlog(id, payload) {
  const { data } = await api.put(`/blogs/${id}`, payload);
  return data;
}

export async function aprobarBlog(id) {
  const { data } = await api.post(`/blogs/${id}/approve`);
  return data;
}

export async function rechazarBlog(id) {
  const { data } = await api.post(`/blogs/${id}/reject`);
  return data;
}

export async function eliminarBlog(id) {
  await api.delete(`/blogs/${id}`);
}

export async function getBlogsPorAutor(authorId) {
  const { data } = await api.get(`/blogs/author/${authorId}`);
  return sacarLista(data);
}

export async function getMisBlogsEnRevision(authorId) {
  const lista = await getBlogsPorAutor(authorId);
  const estado = (b) => String(b.status ?? "").toUpperCase();
  return lista.filter((b) => estado(b) === "PENDING" || estado(b) === "REJECTED");
}

export function blogSePuedeEditar(blog, user) {
  if (!user) return false;
  const st = String(blog?.status ?? "").toUpperCase();
  if (st !== "PENDING" && st !== "REJECTED" && st !== "APPROVED") return false;
  if (esAdmin(user)) return true;
  if (esAsesor(user)) {
    return String(blog?.author?.id) === String(user.id);
  }
  return false;
}

export function blogAdminPuedeModerar(user) {
  return esAdmin(user);
}
