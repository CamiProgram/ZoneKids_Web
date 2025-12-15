import api from './api';

export const authService = {
  /**
   * Login con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} contrasena - Contraseña del usuario
   * @returns {Promise} { token, email, rol, nombre, id }
   */
  login: async (email, contrasena) => {
    try {
      const response = await api.post('/auth/login', { email, contrasena });
      // La respuesta tiene estructura { success, message, data, timestamp }
      // Extraemos solo los datos del usuario
      const userData = response.data.data;
      
      // Almacenar token y datos del usuario
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      return userData;
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
   * @returns {Promise} { id, email, nombre, rol }
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
      // La respuesta tiene estructura { success, message, data, timestamp }
      // Retornamos solo los datos del usuario
      return response.data.data;
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
