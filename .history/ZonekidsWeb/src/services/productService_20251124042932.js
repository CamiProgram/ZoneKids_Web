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
   * POST /api/v1/upload/imagenes
   * @param {File[]} files - Array de archivos de imagen
   * @returns {Promise} Array de URLs de imágenes
   */
  uploadImages: async (files) => {
    try {
      console.log('📤 uploadImages: Procesando', files.length, 'archivos');
      
      const formData = new FormData();
      
      // Filtrar archivos válidos y agregarlos
      const validFiles = files.filter(f => f !== null && f !== undefined);
      
      if (validFiles.length === 0) {
        throw new Error('No hay imágenes para subir');
      }

      if (validFiles.length < 2) {
        throw new Error('Se requiere un mínimo de 2 imágenes');
      }

      console.log('📤 uploadImages: Agregando', validFiles.length, 'archivos válidos a FormData');
      
      // Agregar cada archivo con la clave 'imagen'
      // El backend espera múltiples campos con la clave 'imagen'
      validFiles.forEach((file, index) => {
        console.log(`📄 Archivo ${index + 1}:`, file.name, '|', file.size, 'bytes', '|', file.type);
        formData.append('imagen', file);
      });

      console.log('📤 uploadImages: Enviando POST a /api/v1/upload/imagenes');
      
      const response = await api.post('/upload/imagenes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ uploadImages: Respuesta exitosa');
      console.log('📋 Respuesta:', response.data);
      
      const imagenesUrl = response.data.data || response.data;
      
      if (!Array.isArray(imagenesUrl)) {
        console.error('❌ uploadImages: Respuesta no es un array:', imagenesUrl);
        throw new Error('La respuesta de imágenes no es válida');
      }
      
      console.log('✅ uploadImages: URLs de imágenes:', imagenesUrl.length);
      return imagenesUrl;
    } catch (error) {
      console.error('❌ uploadImages: Error', error);
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
