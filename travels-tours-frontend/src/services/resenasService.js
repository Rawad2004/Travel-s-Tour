import api from "./api.js";

export async function crearResena(payload) {
  const { data } = await api.post("/reviews", payload);
  return data;
}

export async function getResenasPaquete(packageId) {
  const { data } = await api.get(`/reviews/package/${packageId}`);
  return data;
}
