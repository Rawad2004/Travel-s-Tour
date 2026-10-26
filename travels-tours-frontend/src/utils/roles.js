export function getRol(user) {
  return String(user?.role ?? "").toUpperCase();
}

export function esCliente(user) {
  return getRol(user) === "CLIENTE";
}

export function esAdmin(user) {
  return getRol(user) === "ADMIN";
}

export function esAsesor(user) {
  return getRol(user) === "ASESOR";
}
