/**
 * Utilidades para manejo de imágenes de productos
 */

/**
 * Obtiene la URL de imagen correcta con fallback
 * @param {string|array} imagenesUrl - URL única o array de URLs
 * @param {number} index - Índice si es array (por defecto 0)
 * @returns {string} URL válida de imagen
 */
export const getImageUrl = (imagenesUrl, index = 0) => {
  // Imagen por defecto si no hay URL
  const defaultImage = '/assets/Zonekids_logo_web.webp';
  
  if (!imagenesUrl) return defaultImage;

  // Si es array, obtener el elemento en el índice especificado
  let imageUrl = imagenesUrl;
  if (Array.isArray(imagenesUrl)) {
    if (imagenesUrl.length === 0) return defaultImage;
    imageUrl = imagenesUrl[index] || imagenesUrl[0];
  }

  if (!imageUrl) return defaultImage;

  // Si es una URL absoluta (http/https), devolverla tal cual
  if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }

  // Si es una ruta relativa, agregar la base URL del backend
  if (typeof imageUrl === 'string' && imageUrl.length > 0) {
    return `http://localhost:8080${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  return defaultImage;
};

/**
 * Valida si una URL de imagen es accesible
 * @param {string} url - URL a validar
 * @returns {Promise<boolean>}
 */
export const isImageAccessible = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0; // El status 0 ocurre con CORS en no-cors mode
  } catch {
    return false;
  }
};

/**
 * Obtiene URLs de imágenes de respaldo en caso de que las principales fallen
 * @param {number} index - Índice para variar imágenes
 * @returns {array} Array de URLs de fallback
 */
export const getFallbackImages = (index = 0) => {
  // Imágenes placeholder de Picsum que funcionan mejor con CORS
  const picSumUrl = (seed) => `https://picsum.photos/300/300?random=${seed}`;
  
  return [
    picSumUrl(1000 + index),
    picSumUrl(2000 + index),
    picSumUrl(3000 + index),
  ];
};
