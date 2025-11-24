import api from './api';

export const authService = {
  /**
   * Login con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} contrasena - Contraseña del usuario
   * @returns {Promise} { token, email, rol }
   */
  login: async (email, contrasena) => {
    try {
      const response = await api.post('/auth/login', { email, contrasena });
      // Almacenar token y datos del usuario
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('authUser', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {string} nombre - Nombre completo
   * @param {string} email - Email del usuario
   * @param {string} contrasena - Contraseña (mínimo 8 caracteres)
   * @param {string} rol - Rol del usuario (default: CLIENTE)
   * @returns {Promise} { id, email, mensaje }
   */
  register: async (nombre, email, contrasena, rol = 'CLIENTE') => {
    try {
      console.log('Enviando registro:', { nombre, email, contrasena, rol });
      const response = await api.post('/auth/register', {
        nombre,
        email,
        contrasena,
        rol,
      });
      return response.data;
    } catch (error) {
      console.error('Error en register:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout - limpiar datos del usuario
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  },

  /**
   * Obtener usuario autenticado desde localStorage
   */
  getAuthUser: () => {
    const userJson = localStorage.getItem('authUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Obtener token desde localStorage
   */
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};
