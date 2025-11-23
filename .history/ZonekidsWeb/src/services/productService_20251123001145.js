import api from './api';

export const productService = {
  /**
   * Obtener todos los productos (público)
   * @returns {Promise} Array de productos
   */
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      // La respuesta tiene estructura { success, message, data, timestamp }
      // Retornamos solo el array de productos
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener un producto por ID (público)
   * @param {number} id - ID del producto
   * @returns {Promise} Objeto producto
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      // La respuesta tiene estructura { success, message, data, timestamp }
      // Retornamos solo el objeto producto
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crear nuevo producto (Solo ADMIN)
   * @param {object} productData - Datos del producto
   * @returns {Promise} Producto creado
   */
  create: async (productData) => {
    try {
      const response = await api.post('/productos', productData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar producto (Solo ADMIN)
   * @param {number} id - ID del producto
   * @param {object} productData - Datos a actualizar
   * @returns {Promise} Producto actualizado
   */
  update: async (id, productData) => {
    try {
      const response = await api.put(`/productos/${id}`, productData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar producto (Solo ADMIN)
   * @param {number} id - ID del producto
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
