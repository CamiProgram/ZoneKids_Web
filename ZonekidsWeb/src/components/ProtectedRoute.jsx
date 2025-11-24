import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Protege rutas que requieren autenticación y roles específicos
 * @param {React.ReactNode} children - Componentes a renderizar si el acceso es permitido
 * @param {string|string[]} requiredRoles - Rol(es) requerido(s) para acceder (opcional)
 */
export const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles requeridos, verificar permisos
  if (requiredRoles) {
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!rolesArray.includes(user?.rol)) {
      // No tiene permisos, redirigir a home
      return <Navigate to="/" replace />;
    }
  }

  return children;
};