import { ITEMS_POR_PAGINA } from "../constants/listado.js";
import { paginarLista } from "./paquetesLista.js";

export const BLOGS_POR_PAGINA = ITEMS_POR_PAGINA;

export function filtrarBlogs(lista, { nombre = "", estado = "" } = {}) {
  const term = nombre.trim().toLowerCase();
  const est = estado.trim().toUpperCase();

  return lista.filter((b) => {
    const matchNombre =
      !term ||
      String(b.title ?? "")
        .toLowerCase()
        .includes(term) ||
      String(b.author?.name ?? "")
        .toLowerCase()
        .includes(term);
    const matchEstado =
      !est || String(b.status ?? "").toUpperCase() === est;
    return matchNombre && matchEstado;
  });
}

export function paginarBlogs(lista, page, size = BLOGS_POR_PAGINA) {
  return paginarLista(lista, page, size);
}
