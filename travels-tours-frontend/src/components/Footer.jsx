import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Travels Tours</h5>
            <p>Tu plataforma de viajes y reservas de tours.</p>
          </div>
          <div className="col-md-4">
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white-50">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/mis-reservas" className="text-white-50">
                  Mis reservas
                </Link>
              </li>
              <li>
                <Link to="/mi-cuenta" className="text-white-50">
                  Mi cuenta
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white-50">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contacto</h5>
            <p className="text-white-50">Email: info@travelstours.com</p>
            <p className="text-white-50">Teléfono: +1 (555) 123-4567</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center">
          <p className="text-white-50 mb-0">
            &copy; 2026 Travels Tours. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
