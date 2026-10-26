import { create } from "zustand";
import { TOKEN_KEY } from "../services/api.js";

export const AUTH_USER_KEY = "auth_user";

function readUserFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: localStorage.getItem(TOKEN_KEY) ? readUserFromStorage() : null,

  setSession: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ user });
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    set({ user: null });
  },
}));
