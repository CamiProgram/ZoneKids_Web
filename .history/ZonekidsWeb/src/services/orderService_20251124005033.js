import api from './api';

export const orderService = {
  /**
   * Obtener todas las órdenes (Solo ADMIN)
   * @returns {Promise} Array de órdenes
   */
  getAll: async () => {
    try {
      const response = await api.get('/ordenes');
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener una orden por ID
   * @param {number} id - ID de la orden
   * @returns {Promise} Objeto orden
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/ordenes/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crear nueva orden
   * @param {object} orderData - Datos de la orden
   * @returns {Promise} Orden creada
   */
  create: async (orderData) => {
    try {
      const response = await api.post('/ordenes', orderData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar estado de una orden (Solo ADMIN)
   * @param {number} id - ID de la orden
   * @param {string} estado - Nuevo estado
   * @returns {Promise} Orden actualizada
   */
  updateStatus: async (id, estado) => {
    try {
      const response = await api.patch(`/ordenes/${id}/estado`, { estado });
      return response.data.data || response.data;
    } catch (error) {
      // Si el endpoint PATCH no funciona, intentar con PUT
      try {
        const response = await api.put(`/ordenes/${id}`, { estado });
        return response.data.data || response.data;
      } catch (putError) {
        throw putError.response?.data || putError.message;
      }
    }
  },

  /**
   * Actualizar orden completa
   * @param {number} id - ID de la orden
   * @param {object} orderData - Datos a actualizar
   * @returns {Promise} Orden actualizada
   */
  update: async (id, orderData) => {
    try {
      const response = await api.put(`/ordenes/${id}`, orderData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar orden (Solo ADMIN)
   * @param {number} id - ID de la orden
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/ordenes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
