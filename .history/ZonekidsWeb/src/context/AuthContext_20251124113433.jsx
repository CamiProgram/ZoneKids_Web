import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  // Inicializar usuario desde localStorage si existe
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login con email y contraseña
   * Guarda token y usuario en localStorage
   */
  const login = async (email, contrasena) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 AuthContext.login: Iniciando...');
      
      const userData = await authService.login(email, contrasena);
      
      console.log('✅ AuthContext.login: Datos recibidos del backend');
      console.log('👤 Usuario:', { email: userData.email, rol: userData.rol, nombre: userData.nombre });
      
      // Verificar que la cuenta no esté deshabilitada
      if (userData.estado === 'inactivo') {
        console.warn('⚠️ Cuenta deshabilitada');
        throw new Error('Tu cuenta ha sido deshabilitada.');
      }
      
      setUser(userData);
      console.log('💾 Usuario guardado en state de AuthContext');
      
      return userData;
    } catch (err) {
      console.error('❌ AuthContext.login: Error', err);
      
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout - limpia estado y localStorage
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string|string[]} roles - Rol o array de roles a verificar
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    if (!user) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.rol);
  };

  /**
   * Verificar si el usuario es administrador
   */
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  /**
   * Dev only: Cambiar rol del usuario localmente
   */
  const setUserRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, rol: newRole };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        error,
        hasRole,
        isAdmin,
        isAuthenticated: !!user,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};