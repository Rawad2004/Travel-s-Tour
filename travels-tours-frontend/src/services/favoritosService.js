import api from "./api.js";

export async function getMisFavoritos() {
  const { data } = await api.get("/favorites/my-favorites");
  return data;
}

export async function agregarFavorito(packageId) {
  const { data } = await api.post(`/favorites/${packageId}`);
  return data;
}

export async function quitarFavorito(packageId) {
  await api.delete(`/favorites/package/${packageId}`);
}

export async function esFavorito(packageId) {
  const { data } = await api.get(`/favorites/${packageId}/is-favorite`);
  return data;
}
