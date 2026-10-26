import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children, rolPermitido = null }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolPermitido) {
    const rolActual = localStorage.getItem('rol');
    const rolesPermitidos = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido];

    if (!rolesPermitidos.includes(rolActual)) {
      return <Navigate to="/HomePage" replace />;
    }
  }

  return children;
};

export default RutaProtegida;
