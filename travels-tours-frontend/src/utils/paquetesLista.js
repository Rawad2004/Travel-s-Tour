import { PAQUETES_POR_PAGINA } from "../constants/paquetes.js";

export function filtrarPaquetes(lista, { nombre = "", estado = "" } = {}) {
  const term = nombre.trim().toLowerCase();
  const est = estado.trim().toUpperCase();

  return lista.filter((p) => {
    const matchNombre =
      !term ||
      String(p.name ?? "")
        .toLowerCase()
        .includes(term) ||
      String(p.destination ?? "")
        .toLowerCase()
        .includes(term);
    const matchEstado =
      !est || String(p.status ?? "").toUpperCase() === est;
    return matchNombre && matchEstado;
  });
}

export function paginarLista(lista, page, size = PAQUETES_POR_PAGINA) {
  const totalPages = Math.max(1, Math.ceil(lista.length / size));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const inicio = safePage * size;
  return {
    items: lista.slice(inicio, inicio + size),
    page: safePage,
    totalPages,
    totalElements: lista.length,
  };
}
