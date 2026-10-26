import api from "./api.js";

export async function confirmarPago(bookingId) {
  const { data } = await api.post("/payments/confirm", { bookingId });
  return data;
}
