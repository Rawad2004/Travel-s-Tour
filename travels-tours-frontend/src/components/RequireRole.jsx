import { Navigate, useLocation } from "react-router-dom";
import { TOKEN_KEY } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";
import { getRol, esAdmin, esAsesor } from "../utils/roles.js";

export default function RequireRole({ children, roles }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);
  const permitidos = (roles ?? []).map((r) => String(r).toUpperCase());

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const rol = getRol(user);
  if (!permitidos.includes(rol)) {
    if (esAdmin(user) || esAsesor(user)) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
