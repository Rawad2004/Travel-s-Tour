import api from "./api.js";

export async function getFechaServidor() {
  const { data } = await api.get("/meta/server-date");
  return data?.today ?? new Date().toISOString().split("T")[0];
}
