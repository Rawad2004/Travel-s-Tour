import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { logout } from "../services/authService.js";
import { esAdmin, esCliente, esAsesor } from "../utils/roles.js";

function linkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function NavBar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const admin = esAdmin(user);
  const cliente = esCliente(user);
  const asesor = esAsesor(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="border-bottom app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Travels Tours
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={linkClass}>
              Catalogo
            </NavLink>
            {cliente && (
              <NavLink to="/mis-reservas" className={linkClass}>
                Mis Reservas
              </NavLink>
            )}
            {(admin || asesor) && (
              <NavLink to="/mis-reservas" className={linkClass}>
                Reservas
              </NavLink>
            )}
            {(admin || asesor) && (
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/blogs" className={linkClass}>
              Blogs
            </NavLink>
            {!user && (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/registro" className={linkClass}>
                  Registro
                </NavLink>
              </>
            )}
          </Nav>
          {user && (
            <Nav>
              <NavDropdown title={user.name || "Usuario"} id="user-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/mi-cuenta">Mi Cuenta</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesion
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}