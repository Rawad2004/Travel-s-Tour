import api, { TOKEN_KEY } from "./api.js";
import { useAuthStore } from "../store/authStore.js";

export function sacarErrorApi(err, fallback) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (Array.isArray(d?.errors)) {
    return d.errors.map((e) => e.defaultMessage ?? e.message).join(". ");
  }
  return d?.message ?? d?.error ?? err?.message ?? fallback;
}

function normalizeLoginPayload(data, fallbackEmail) {
  const token =
    data?.accessToken ?? data?.token ?? data?.jwt ?? data?.access_token;

  if (!token) {
    throw new Error("La respuesta del servidor no incluye un token válido.");
  }

  let user = data?.user;
  if (!user || typeof user !== "object") {
    user = {
      name: data?.name ?? data?.fullName ?? data?.username ?? "",
      email: data?.email ?? fallbackEmail,
      role: data?.role ?? data?.authorities?.[0] ?? "",
    };
  }

  return { token, user };
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  const { token, user } = normalizeLoginPayload(data, email);
  useAuthStore.getState().setSession(user, token);

  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored || stored !== token) {
    throw new Error("El token no se almacenó correctamente en localStorage.");
  }

  return { token, user };
}

export async function register(name, email, password, phone) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    phone: phone?.trim() || undefined,
  });
  const { token, user } = normalizeLoginPayload(data, email);
  useAuthStore.getState().setSession(user, token);
  return { token, user };
}

export function logout() {
  useAuthStore.getState().clearSession();
}

export async function getPerfil() {
  const { data } = await api.get("/users/profile");
  return data;
}

export async function actualizarUsuario(id, datos) {
  const { data } = await api.put(`/users/${id}`, datos);
  return data;
}

export async function enviarContacto({ nombre, email, mensaje }) {
  const { data } = await api.post("/contacts", {
    name: nombre,
    email,
    message: mensaje,
  });
  return data;
}
