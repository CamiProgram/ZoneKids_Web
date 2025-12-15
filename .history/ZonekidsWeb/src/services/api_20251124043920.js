import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// ============ INTERCEPTOR DE REQUEST ============
// Agregar token JWT a todos los requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const authUser = localStorage.getItem('authUser');
    const user = authUser ? JSON.parse(authUser) : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Logging diferenciado para FormData
      if (config.data instanceof FormData) {
        console.log('🔐 Request FormData:', config.url, '| Token:', !!token, '| Rol:', user?.rol);
        console.log('📦 Content-Type:', config.headers['Content-Type'] || 'será establecido automáticamente');
      } else {
        console.log('🔐 Request:', config.url, '| Token:', !!token, '| Rol:', user?.rol, '| Email:', user?.email);
      }
    } else {
      console.warn('⚠️ No hay token disponible para:', config.url);
    }
    
    // Si los datos son FormData, NO establecer Content-Type
    // Axios + navegador lo harán automáticamente con el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('🌐 FormData detectado - Eliminando Content-Type manual (navegador lo establecerá)');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ INTERCEPTOR DE RESPONSE ============
// Manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expira (401), limpiar localStorage y redirigir a login
    if (error.response?.status === 401) {
      console.error('❌ Error 401 - Token inválido o expirado');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('❌ Error 403 - Acceso denegado. Usuario no tiene permisos.');
      console.error('URL:', error.config?.url);
      console.error('Token presente:', !!localStorage.getItem('authToken'));
      const user = localStorage.getItem('authUser');
      if (user) {
        console.error('Rol del usuario:', JSON.parse(user).rol);
      }
    }
    
    // Para otros errores, pasar el error normalmente
    return Promise.reject(error);
  }
);

export default api;
