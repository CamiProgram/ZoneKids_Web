import api from './api';

export const userService = {
  /**
   * Obtener todos los usuarios (Requiere autenticación)
   * @returns {Promise} Array de usuarios
   */
  getAll: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener un usuario por ID (Requiere autenticación)
   * @param {number} id - ID del usuario
   * @returns {Promise} Objeto usuario
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crear nuevo usuario (Solo ADMIN)
   * @param {object} userData - Datos del usuario
   * @returns {Promise} Usuario creado
   */
  create: async (userData) => {
    try {
      const response = await api.post('/usuarios', userData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar usuario (Requiere autenticación)
   * Puede actualizar su propio perfil
   * @param {number} id - ID del usuario
   * @param {object} userData - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  update: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar usuario (Solo ADMIN)
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
