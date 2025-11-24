# Integración Frontend - Sistema de Upload de Imágenes

## Resumen de Cambios

Se ha integrado completamente el nuevo sistema de **upload de imágenes** con los endpoints del backend:
- `POST /api/v1/upload/imagen` - Subir una sola imagen
- `POST /api/v1/upload/imagenes` - Subir múltiples imágenes

### Cambios Principales

#### 1. **Creación de Productos (`CrearProducto.jsx`)**
✅ **Cambios realizados:**
- Requiere **exactamente 3 imágenes** para crear un producto
- Validación obligatoria de 3 imágenes antes de enviar el formulario
- Vista previa de las imágenes seleccionadas con miniaturas
- Componente de previsualización con información del archivo (nombre, tamaño)
- Botones para eliminar imágenes individuales
- Estado de carga separado para subir imágenes (`uploadingImages`)
- Nuevo endpoint: `POST /api/v1/upload/imagenes`

**Flujo:**
1. Usuario selecciona 3 imágenes
2. Se muestra vista previa con miniaturas
3. Usuario completa datos del producto
4. Al enviar:
   - Se suben las 3 imágenes a `/api/v1/upload/imagenes`
   - Se obtienen las URLs de las imágenes
   - Se crea el producto con `POST /api/v1/productos` incluyendo el array `imagenes`

#### 2. **Edición de Productos (`EditarProducto.jsx`)**
✅ **Cambios realizados:**
- Muestra las imágenes actuales del producto
- Permite agregar nuevas imágenes (reemplazar algunas o todas)
- Valida que el producto siempre tenga exactamente 3 imágenes
- Vista previa separada para imágenes actuales y nuevas
- Botones para eliminar imágenes individuales
- Endpoint actualizado: `GET/PUT /api/v1/productos/{id}`

**Flujo:**
1. Se cargan las imágenes actuales del producto
2. Usuario puede reemplazar imágenes o mantener las existentes
3. Si agrega nuevas imágenes:
   - Se suben a `/api/v1/upload/imagenes`
   - Se actualiza el producto con todas las imágenes (viejas + nuevas)

#### 3. **Componente de Carrusel de Imágenes (`ImageCarousel.jsx`)**
✅ **Nuevo componente reutilizable**
- Muestra carrusel de imágenes del producto
- Navegación con botones siguiente/anterior
- Miniaturas para saltar a una imagen específica
- Contador de imagen actual
- Responsive para móviles
- Se utiliza en la página de detalles del producto

**Ubicación:** `src/components/ImageCarousel.jsx`

#### 4. **Página de Detalles del Producto (`ProductDetailPage.jsx`)**
✅ **Cambios realizados:**
- Usa el nuevo componente `ImageCarousel` para mostrar las 3 imágenes
- Endpoint actualizado: `GET /api/v1/productos/{id}`
- Muestra carrusel completo con navegación

#### 5. **Tarjeta de Producto (`ProductCard.jsx`)**
✅ **Cambios realizados:**
- Extrae la primera imagen del array `imagenes`
- Fallback a imagen por defecto si no hay imágenes
- Muestra `imagenes[0]` en lugar de `imagenUrl`

#### 6. **Tabla de Administración (`AdminProducts.jsx`)**
✅ **Cambios realizados:**
- Muestra todas las 3 imágenes en miniaturas en la tabla
- Estilos nuevos para mostrar múltiples imágenes en grid
- Indicador de imágenes adicionales si hay más de 3
- Endpoint actualizado: `GET /api/v1/productos`

#### 7. **Contexto del Carrito (`CartContext.jsx`)**
✅ **Cambios realizados:**
- Renombración: `cartItems` → `cart`
- Renombración: `quantity` → `cantidad`
- Nuevo método: `updateQuantity(productId, newQuantity)`
- Nuevo método: `clearCart()` para limpiar el carrito

#### 8. **Modal del Carrito (`CartModal.jsx`)**
✅ **Corregido completamente**
- Implementación correcta del componente
- Muestra imagen del producto (primera del array)
- Controles para aumentar/disminuir cantidad
- Cálculo de totales
- Botón de eliminar producto

#### 9. **Páginas de Usuario Actualizadas**
Actualizadas para usar nuevos endpoints:
- `HomePage.jsx` - `GET /api/v1/productos`
- `CategoryPage.jsx` - `GET /api/v1/productos` con filtrado
- `SearchPage.jsx` - `GET /api/v1/productos` con búsqueda

#### 10. **Estilos CSS**
✅ **Archivos CSS actualizados:**
- `crearProducto.css` - Estilos para vista previa de imágenes
- `editarProducto.css` - Estilos para imágenes actuales y nuevas
- `ImageCarousel.css` - Estilos completos del carrusel
- `AdminProducts.css` - Estilos para mostrar múltiples imágenes

---

## Validaciones Implementadas

### CrearProducto.jsx
- ✅ Exactamente 3 imágenes requeridas
- ✅ Botón deshabilitado si no hay 3 imágenes
- ✅ Formatos válidos: JPEG, PNG, GIF, WebP, AVIF
- ✅ Máximo 10MB por imagen (validación en backend)

### EditarProducto.jsx
- ✅ Total de imágenes debe ser exactamente 3
- ✅ Puede tener combinación de imágenes actuales + nuevas
- ✅ Botón deshabilitado si el total no es 3

### ImageCarousel.jsx
- ✅ Fallback si no hay imágenes
- ✅ Navegación fluida entre imágenes
- ✅ Miniaturas como segunda forma de navegación

---

## Integración con API

### Endpoints Utilizados

```
POST /api/v1/upload/imagen
  - Sube una sola imagen
  - Response: { success, fileName, size, contentType, url, message }

POST /api/v1/upload/imagenes
  - Sube múltiples imágenes
  - Response: { success, urls[], message }

POST /api/v1/productos
  - Crea producto con array de imágenes
  - Body: { ..., imagenes: [url1, url2, url3] }

GET /api/v1/productos
  - Obtiene lista de productos

GET /api/v1/productos/{id}
  - Obtiene detalle del producto

PUT /api/v1/productos/{id}
  - Actualiza producto con nuevo array de imágenes

DELETE /api/v1/productos/{id}
  - Elimina producto
```

---

## Características de la Vista Previa

### Creación de Producto
- Grid de 3 columnas con miniaturas
- Hover effect con zoom
- Botón de eliminar (X) en cada thumbnail
- Nombre y tamaño del archivo
- Indicador visual: "Imágenes seleccionadas: X/3"

### Administración
- Tabla con miniaturas de las 3 imágenes
- Muestra todas las imágenes lado a lado
- Badge con "+N" si hay más imágenes
- Responsive en móviles

---

## Flujos de Uso

### Crear Producto
```
1. Usuario selecciona exactamente 3 imágenes
2. Se muestran miniaturas de vista previa
3. Usuario completa datos del producto
4. Al enviar:
   - Las 3 imágenes se suben a /api/v1/upload/imagenes
   - Se obtienen 3 URLs
   - Se crea producto con POST /api/v1/productos
   - Se incluye array imagenes: [url1, url2, url3]
```

### Editar Producto
```
1. Se cargan las 3 imágenes actuales
2. Usuario puede reemplazar algunas/todas las imágenes
3. Al enviar:
   - Si hay nuevas imágenes: se suben a /api/v1/upload/imagenes
   - Se actualiza producto con PUT /api/v1/productos/{id}
   - Siempre debe haber exactamente 3 imágenes
```

### Ver Detalle de Producto
```
1. Se carga producto con GET /api/v1/productos/{id}
2. Se muestra carrusel con las 3 imágenes
3. Usuario puede navegar con:
   - Botones siguiente/anterior
   - Click en miniaturas
```

---

## Próximos Pasos (Recomendaciones)

1. **Optimización de imágenes**: Implementar lazy loading en los carruseles
2. **Validación adicional**: Asegurar que las imágenes sean válidas antes de enviar
3. **Drag and drop**: Permitir arrastrar y soltar imágenes en CrearProducto
4. **Zoom**: Agregar zoom al pasar el mouse sobre las imágenes
5. **Ordenamiento**: Permitir reordenar las imágenes antes de guardar
6. **Compresión**: Comprimir imágenes antes de subir para reducir tamaño

---

## Requisitos Cumplidos

✅ Upload de imágenes separado de la creación de productos
✅ Cada producto requiere exactamente 3 imágenes
✅ Vista previa de las imágenes insertadas
✅ Carrusel para navegar las imágenes en detalle
✅ Integración con endpoints `/api/v1/upload/`
✅ Manejo de errores con mensajes claros
✅ Estados de carga (`loading` y `uploadingImages`)
✅ Validación de formatos de imagen
✅ Máximo 10MB por imagen
✅ Respuestas JSON estructuradas

---

**Última actualización:** 23 de noviembre, 2025
**Version:** 1.0 - Integración completa de upload de imágenes
