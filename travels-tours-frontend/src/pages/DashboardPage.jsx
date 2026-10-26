import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { TOKEN_KEY } from "../services/api.js";
import { esAdmin, esCliente, esAsesor } from "../utils/roles.js";
import PanelAdmin from "./admin/PanelAdmin.jsx";
import CrearPaquete from "./asesor/CrearPaquete.jsx";
import MisPaquetes from "./asesor/MisPaquetes.jsx";
import CrearBlog from "./asesor/CrearBlog.jsx";
import BlogsEnRevision from "./asesor/BlogsEnRevision.jsx";
import ListaBlogsGestion from "../components/ListaBlogsGestion.jsx";

export default function DashboardPage() {
  const [blogTick, setBlogTick] = useState(0);
  const user = useAuthStore((s) => s.user);
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (esAdmin(user)) {
    return (
      <>
        <PanelAdmin />
        <hr className="my-4" />
        <ListaBlogsGestion />
      </>
    );
  }

  if (esAsesor(user)) {
    return (
      <>
        <CrearPaquete />
        <hr className="my-4" />
        <CrearBlog onCreado={() => setBlogTick((n) => n + 1)} />
        <hr className="my-4" />
        <MisPaquetes />
        <hr className="my-4" />
        <BlogsEnRevision recargar={blogTick} />
        <hr className="my-4" />
        <ListaBlogsGestion />
      </>
    );
  }

  if (esCliente(user)) {
    return <Navigate to="/mis-reservas" replace />;
  }

  return (
    <div className="dashboard-page py-4">
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Panel no disponible para tu rol.</p>
    </div>
  );
}
