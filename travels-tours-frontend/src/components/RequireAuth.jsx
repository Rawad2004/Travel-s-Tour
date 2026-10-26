import { Navigate, useLocation } from "react-router-dom";
import { TOKEN_KEY } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
