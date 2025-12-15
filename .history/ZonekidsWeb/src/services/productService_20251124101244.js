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
      console.log('📤 uploadImages: Iniciando upload de imágenes');
      console.log('📦 Total de archivos:', files.length);
      
      const formData = new FormData();
      
      // Filtrar archivos válidos
      const validFiles = files.filter(f => f !== null && f !== undefined);
      
      console.log('✅ Archivos válidos (no null/undefined):', validFiles.length);
      
      if (validFiles.length === 0) {
        throw new Error('No hay imágenes para subir');
      }

      if (validFiles.length < 2) {
        throw new Error('Se requiere un mínimo de 2 imágenes');
      }

      // IMPORTANTE: Backend espera 'files' (no 'imagen')
      // Agregar cada archivo con la clave 'files'
      console.log('📤 Agregando archivos al FormData con clave "files"');
      validFiles.forEach((file, index) => {
        console.log(`  📄 ${index + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB, ${file.type})`);
        
        // Validar que sea un archivo válido
        if (!file instanceof File) {
          console.warn(`⚠️ Archivo ${index + 1} no es un File válido`);
        }
        
        // Agregar con clave 'files'
        formData.append('files', file);
      });

      console.log('📤 FormData preparado con', validFiles.length, 'archivo(s)');
      console.log('🌐 Enviando POST a /api/v1/upload/imagenes');
      
      // Axios elimina automáticamente Content-Type para FormData
      // Esto permite que el navegador establezca el boundary correcto
      const response = await api.post('/upload/imagenes', formData);
      
      console.log('✅ Response recibida del servidor');
      console.log('📋 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      // Backend retorna objeto con estructura: { uploadedFiles: [], uploadedCount, success, totalFiles, message }
      let imagenesUrl;
      
      if (response.data.uploadedFiles && Array.isArray(response.data.uploadedFiles)) {
        // Estructura: { uploadedFiles: [...], uploadedCount: 3, success: true, ... }
        imagenesUrl = response.data.uploadedFiles;
        console.log('✅ URLs extraídas de uploadedFiles');
      } else if (Array.isArray(response.data)) {
        // Estructura: Array directo
        imagenesUrl = response.data;
        console.log('✅ URLs extraídas directamente (array)');
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Estructura: { data: [...] }
        imagenesUrl = response.data.data;
        console.log('✅ URLs extraídas de data');
      } else {
        console.error('❌ Respuesta inesperada:', response.data);
        throw new Error('La respuesta de imágenes no tiene una estructura válida');
      }
      
      if (!Array.isArray(imagenesUrl) || imagenesUrl.length === 0) {
        throw new Error(`Se esperaba un array con URLs, pero se recibió: ${JSON.stringify(imagenesUrl)}`);
      }
      
      console.log('✅ URLs obtenidas:', imagenesUrl.length);
      imagenesUrl.forEach((url, idx) => {
        console.log(`  🔗 ${idx + 1}. ${url.substring(0, 60)}...`);
      });
      
      return imagenesUrl;
    } catch (error) {
      console.error('❌ uploadImages: Error en upload');
      console.error('📋 Error completo:', error);
      console.error('📋 Response data:', error.response?.data);
      console.error('📋 Response status:', error.response?.status);
      console.error('📋 Message:', error.message);
      
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar imágenes de un producto
   * PATCH /api/v1/productos/{id}/imagenes
   * @param {number} id - ID del producto
   * @param {string[]} imagenesUrl - Array de URLs de imágenes (mínimo 2, máximo 3)
   * @returns {Promise} Producto actualizado
   */
  updateImages: async (id, imagenesUrl) => {
    try {
      console.log('🖼️ updateImages: Actualizando imágenes del producto', id);
      
      if (!Array.isArray(imagenesUrl)) {
        throw new Error('Las URLs de imágenes deben ser un array');
      }

      if (imagenesUrl.length < 2 || imagenesUrl.length > 3) {
        throw new Error('Debe proporcionar entre 2 y 3 URLs de imágenes. Recibidas: ' + imagenesUrl.length);
      }

      console.log('📋 updateImages: URLs a enviar:', imagenesUrl.length);
      imagenesUrl.forEach((url, idx) => {
        console.log(`  ${idx + 1}. ${url}`);
      });

      const payload = { imagenesUrl };
      console.log('📤 updateImages: Enviando PATCH a /api/v1/productos/${id}/imagenes');
      
      const response = await api.patch(`/productos/${id}/imagenes`, payload);
      
      console.log('✅ updateImages: Respuesta exitosa');
      console.log('📋 Respuesta:', response.data);
      
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ updateImages: Error', error);
      throw error.response?.data || error.message;
    }
  },
};
