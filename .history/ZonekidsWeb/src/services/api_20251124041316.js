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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token enviado en request:', config.url);
    } else {
      console.warn('⚠️ No hay token disponible para:', config.url);
    }
    
    // Si los datos son FormData, no establecer Content-Type
    // Axios + navegador lo harán automáticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    
    // Para otros errores, pasar el error normalmente
    return Promise.reject(error);
  }
);

export default api;
