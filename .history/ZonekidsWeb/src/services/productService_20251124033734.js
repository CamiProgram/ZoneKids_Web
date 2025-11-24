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

  /**
   * Cambiar estado del producto (activo/inactivo)
   * @param {number} id - ID del producto
   * @param {string} estado - "activo" o "inactivo"
   * @returns {Promise} Producto actualizado
   */
  updateStatus: async (id, estado) => {
    try {
      const response = await api.patch(`/productos/${id}/estado`, { estado });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crear orden (descuenta stock automáticamente)
   * @param {object} orderData - Datos de la orden { usuarioId, detalles }
   * @returns {Promise} Orden creada
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/ordenes', orderData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Subir imágenes (máximo 3)
   * @param {File[]} files - Array de archivos de imagen
   * @returns {Promise} Array de URLs de imágenes
   */
  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        if (file) {
          formData.append(`imagen${index + 1}`, file);
        }
      });

      const response = await api.post('/upload/imagenes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar imágenes de un producto
   * @param {number} id - ID del producto
   * @param {string[]} imagenesUrl - Array de URLs de imágenes (mínimo 2, máximo 3)
   * @returns {Promise} Producto actualizado
   */
  updateImages: async (id, imagenesUrl) => {
    try {
      if (!Array.isArray(imagenesUrl) || imagenesUrl.length < 2 || imagenesUrl.length > 3) {
        throw new Error('Debe proporcionar entre 2 y 3 URLs de imágenes');
      }

      const response = await api.patch(`/productos/${id}/imagenes`, { imagenesUrl });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
