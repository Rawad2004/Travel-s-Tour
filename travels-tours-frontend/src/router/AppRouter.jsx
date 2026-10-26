import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import Catalogo from "../pages/Catalogo.jsx";
import DetallePaquete from "../pages/DetallePaquete.jsx";
import Contacto from "../pages/Contacto.jsx";
import Login from "../pages/Login.jsx";
import Registro from "../pages/Registro.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import MiCuenta from "../pages/MiCuenta.jsx";
import MisReservas from "../pages/MisReservas.jsx";
import MisFavoritos from "../pages/MisFavoritos.jsx";
import Blog from "../pages/Blog.jsx";
import ArticuloBlog from "../pages/ArticuloBlog.jsx";
import EditarPaquete from "../pages/EditarPaquete.jsx";
import EditarBlog from "../pages/EditarBlog.jsx";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import RequireAuth from "../components/RequireAuth.jsx";
import RequireRole from "../components/RequireRole.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container-fluid px-3 px-md-4 pb-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/paquete/:id" element={<DetallePaquete />} />
          <Route
            path="/paquete/:id/editar"
            element={
              <RequireAuth>
                <RequireRole roles={["ADMIN", "ASESOR"]}>
                  <EditarPaquete />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/mi-cuenta"
            element={
              <RequireAuth>
                <MiCuenta />
              </RequireAuth>
            }
          />
          <Route
            path="/mis-reservas"
            element={
              <RequireAuth>
                <RequireRole roles={["CLIENTE", "ADMIN", "ASESOR"]}>
                  <MisReservas />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/mis-favoritos"
            element={
              <RequireAuth>
                <RequireRole roles={["CLIENTE"]}>
                  <MisFavoritos />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticuloBlog />} />
          <Route
            path="/blog/:id/editar"
            element={
              <RequireAuth>
                <RequireRole roles={["ASESOR", "ADMIN"]}>
                  <EditarBlog />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRouter;
