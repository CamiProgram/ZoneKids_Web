# 🖼️ Flujo Correcto de Manejo de Imágenes - Implementado

## 📋 Endpoints Disponibles del Backend

```
1️⃣ POST /api/v1/upload/imagenes        → Subir múltiples imágenes
2️⃣ PATCH /api/v1/productos/{id}/imagenes → Actualizar imágenes del producto
```

---

## 🔄 Flujo Implementado en Frontend

### **1. CREAR PRODUCTO** (`CrearProducto.jsx`)

```
┌─────────────────────────────────────────────────────────────┐
│                    CREAR NUEVO PRODUCTO                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
                   ┌─────────────────────┐
                   │ ✅ Validación Input │
                   └──────────┬──────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │ 📤 PASO 1: POST /upload/imagenes        │
        │ • Enviar 3 archivos .jpg/.png           │
        │ • FormData con claves 'imagen'          │
        │ • Respuesta: Array de URLs              │
        └────────────────┬────────────────────────┘
                         ↓
              ✅ Si: imagenesSubidas.length >= 2
                         ↓
        ┌─────────────────────────────────────────┐
        │ 📝 PASO 2: POST /productos              │
        │ • Datos: nombre, precio, stock, etc.    │
        │ • NO incluir imagenesUrl (campo vacío)  │
        │ • Respuesta: Producto con ID            │
        └────────────────┬────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────┐
        │ 🖼️ PASO 3: PATCH /productos/{id}/imagenes│
        │ • Enviar: { imagenesUrl: [...] }        │
        │ • Mínimo 2, Máximo 3 imágenes           │
        │ • Respuesta: Producto actualizado       │
        └────────────────┬────────────────────────┘
                         ↓
                  ✅ ¡ÉXITO!
```

### **2. EDITAR PRODUCTO** (`EditarProducto.jsx`)

```
┌─────────────────────────────────────────────────────────────┐
│                   EDITAR PRODUCTO EXISTENTE                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
           ┌──────────────────────────────┐
           │ ¿Hay nuevas imágenes?        │
           └──────────┬───────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
       SÍ                           NO
        │                            │
        ↓                            ↓
  📤 PASO 1:              🔍 Usar imágenes
  POST                    actuales del
  /upload/               producto
  imagenes
        │                            │
        └─────────────┬──────────────┘
                      ↓
          ✅ Validar: 2-3 imágenes
                      ↓
        ┌─────────────────────────────────────────┐
        │ 📝 PASO 2: PUT /productos/{id}          │
        │ • Actualizar: nombre, precio, stock     │
        │ • NO actualizar imagenesUrl aquí        │
        └────────────────┬────────────────────────┘
                         ↓
        ┌─────────────────────────────────────────┐
        │ 🖼️ PASO 3: PATCH /productos/{id}/imagenes│
        │ • SIEMPRE se ejecuta (nuevas + actuales)│
        │ • Endpoint específico para imágenes     │
        └────────────────┬────────────────────────┘
                         ↓
                  ✅ ¡ÉXITO!
```

---

## 💻 Cambios Implementados

### **1. productService.js**

#### Método: `uploadImages(files)`
```javascript
/**
 * POST /api/v1/upload/imagenes
 * Sube múltiples imágenes
 */
uploadImages: async (files) => {
  const formData = new FormData();
  const validFiles = files.filter(f => f !== null && f !== undefined);
  
  if (validFiles.length < 2) {
    throw new Error('Se requiere un mínimo de 2 imágenes');
  }
  
  // Agregar archivos con clave 'imagen'
  validFiles.forEach((file) => {
    formData.append('imagen', file);
  });
  
  const response = await api.post('/upload/imagenes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.data || response.data; // Array de URLs
}
```

#### Método: `updateImages(id, imagenesUrl)`
```javascript
/**
 * PATCH /api/v1/productos/{id}/imagenes
 * Actualiza las imágenes de un producto
 */
updateImages: async (id, imagenesUrl) => {
  if (imagenesUrl.length < 2 || imagenesUrl.length > 3) {
    throw new Error('Debe proporcionar entre 2 y 3 URLs de imágenes');
  }
  
  const response = await api.patch(
    `/productos/${id}/imagenes`, 
    { imagenesUrl }
  );
  
  return response.data.data || response.data;
}
```

### **2. CrearProducto.jsx**

**Cambios:**
- ✅ Paso 1: POST /upload/imagenes (subir archivos)
- ✅ Paso 2: POST /productos (crear sin imagenesUrl)
- ✅ Paso 3: PATCH /productos/{id}/imagenes (actualizar imágenes)
- ✅ Logging detallado con emojis
- ✅ Validación de mínimo 2 imágenes

**Flujo de errores:**
```javascript
try {
  // 1. Subir imágenes
  const imagenesSubidas = await productService.uploadImages(imagenes);
  
  // 2. Crear producto
  const productData = { nombre, precio, stock, ... }; // Sin imagenesUrl
  const productoCreado = await productService.create(productData);
  
  // 3. Actualizar imágenes
  await productService.updateImages(productoCreado.id, imagenesSubidas);
  
  alert('✅ ¡Producto creado exitosamente!');
} catch (err) {
  // Captura y muestra errores detallados
}
```

### **3. EditarProducto.jsx**

**Cambios:**
- ✅ Detecta si hay nuevas imágenes
- ✅ Si hay nuevas: POST /upload/imagenes
- ✅ Si no hay nuevas: usa imágenes actuales
- ✅ Siempre ejecuta: PATCH /productos/{id}/imagenes
- ✅ Valida mínimo 2 imágenes
- ✅ Logging detallado

**Lógica:**
```javascript
// Determinar imágenes finales
if (newImagesCount > 0) {
  // Subir nuevas
  const imagenesSubidas = await productService.uploadImages(imagenes);
  finalImagenesUrl = imagenesSubidas;
} else {
  // Usar actuales
  finalImagenesUrl = previews.filter(p => p && !p.startsWith('data:'));
}

// Validar cantidad
if (finalImagenesUrl.length < 2) {
  throw 'Mínimo 2 imágenes';
}

// Actualizar producto (datos generales)
await productService.update(id, productData);

// Actualizar imágenes (PATCH específico)
await productService.updateImages(id, finalImagenesUrl);
```

---

## 📊 Validaciones Implementadas

### **En Frontend:**

| Campo | Validación | Mensaje |
|-------|-----------|---------|
| Imágenes (Crear) | Exactamente 3 | "Debes subir exactamente 3 imágenes" |
| Imágenes (Editar) | Mínimo 2, Máximo 3 | "Entre 2 y 3 imágenes" |
| Precio | Números enteros | "Sin decimales, solo enteros" |
| Stock | Número entero | "Sin decimales" |
| Campos obligatorios | nombre, precio, stock, categoria | "Por favor completa todos los campos" |

### **En Backend:**

| Endpoint | Validación | Error |
|----------|-----------|-------|
| POST /upload/imagenes | Mínimo 2 imágenes | 400 - "Menos de 2 imágenes" |
| POST /upload/imagenes | Máximo 3 imágenes | 400 - "Más de 3 imágenes" |
| PATCH /productos/{id}/imagenes | 2-3 URLs | 400 - "Validación de cantidad" |
| PATCH /productos/{id}/imagenes | Producto existe | 404 - "Producto no encontrado" |
| PATCH /productos/{id}/imagenes | Es ADMIN | 403 - "No es ADMIN" |

---

## 🎯 Casos de Uso

### **Caso 1: Crear Producto (3 imágenes nuevas)**
```
1. Seleccionar 3 imágenes en formulario
2. Click en "Crear Producto"
3. → POST /upload/imagenes (archivos)
4. → POST /productos (datos)
5. → PATCH /productos/{id}/imagenes (URLs)
✅ Producto creado con 3 imágenes
```

### **Caso 2: Editar Producto (sin cambiar imágenes)**
```
1. Abrir formulario de edición
2. Cambiar: nombre, precio, stock
3. Click en "Actualizar Producto"
4. Sin nuevas imágenes → usar actuales
5. → PUT /productos/{id} (datos)
6. → PATCH /productos/{id}/imagenes (imágenes actuales)
✅ Producto actualizado, imágenes sin cambios
```

### **Caso 3: Editar Producto (reemplazar 1 imagen)**
```
1. Abrir formulario de edición
2. Reemplazar imagen #1
3. Mantener imágenes #2 y #3 (actuales)
4. Click en "Actualizar Producto"
5. → POST /upload/imagenes (1 archivo nuevo)
6. → PUT /productos/{id} (datos)
7. → PATCH /productos/{id}/imagenes (1 nueva + 2 actuales)
✅ Producto actualizado con 3 imágenes
```

---

## 📝 Logging Detallado

### **Crear Producto - Consola:**
```
📤 Iniciando creación de producto...
📤 Paso 1: Subiendo 3 imágenes...
📄 Archivo 1: image1.jpg | 2048000 bytes | image/jpeg
📄 Archivo 2: image2.jpg | 1524000 bytes | image/jpeg
📄 Archivo 3: image3.jpg | 1792000 bytes | image/jpeg
📤 uploadImages: Enviando POST a /api/v1/upload/imagenes
✅ Imágenes subidas: 3 ['url1', 'url2', 'url3']
📝 Paso 2: Creando producto sin imágenes...
📦 Datos del producto: { nombre, precio, stock, ... }
✅ Producto creado con ID: 42
🖼️ Paso 3: Actualizando imágenes del producto con PATCH...
✅ Imágenes actualizadas correctamente
✅ ¡Producto creado exitosamente!
```

### **Editar Producto - Consola (sin cambios de imágenes):**
```
📝 Iniciando actualización de producto...
📸 No hay nuevas imágenes, usando las actuales
✅ Total de imágenes válidas: 3
📝 Paso 2: Actualizando datos del producto (PUT)...
📦 Datos del producto: { nombre, precio, stock, ... }
✅ Producto actualizado
🖼️ Paso 3: Actualizando imágenes con PATCH...
✅ Imágenes actualizadas correctamente
✅ ¡Producto actualizado exitosamente!
```

---

## ✅ Checklist de Verificación

- [x] `productService.js` - Métodos `uploadImages()` y `updateImages()` implementados
- [x] `CrearProducto.jsx` - Flujo: Upload → Create → UpdateImages
- [x] `EditarProducto.jsx` - Flujo: Detectar nuevas → Upload si necesario → Update → UpdateImages
- [x] Validaciones de cantidad de imágenes (2-3)
- [x] Validaciones de tipos de datos (integer para precios)
- [x] Logging detallado con emojis
- [x] Manejo de errores con mensajes claros
- [x] FormData con clave 'imagen' correcta

---

## 🚀 Próximos Pasos

1. **Probar en navegador:**
   - Crear producto (3 imágenes)
   - Verificar consola: 3 URLs retornadas
   - Editar producto (cambiar 1 imagen)
   - Verificar que mantiene las 2 existentes

2. **Si hay errores:**
   - Revisar Console (F12)
   - Ver Network tab para ver requests
   - Comparar con respuestas esperadas del backend

3. **Optimizaciones futuras:**
   - Compresión de imágenes antes de upload
   - Preview de imágenes más grandes
   - Soporte drag-and-drop
   - Indicador de progreso de upload

---

## 📚 Referencias Rápidas

**Endpoints disponibles:**
```bash
POST   /api/v1/upload/imagen                 # 1 imagen
POST   /api/v1/upload/imagenes               # Múltiples ✅ USAMOS ESTE
POST   /api/v1/upload/subir-imagenes         # Alternativo
PATCH  /api/v1/productos/{id}/imagenes       # Actualizar ✅ USAMOS ESTE
```

**Respuesta POST /upload/imagenes (éxito):**
```json
{
  "success": true,
  "message": "Imágenes subidas correctamente",
  "data": [
    "https://bucket.com/imagen1.jpg",
    "https://bucket.com/imagen2.jpg",
    "https://bucket.com/imagen3.jpg"
  ],
  "timestamp": "2024-11-24T15:30:45"
}
```

**Respuesta PATCH /productos/{id}/imagenes (éxito):**
```json
{
  "success": true,
  "message": "Imágenes actualizadas correctamente",
  "data": {
    "id": 42,
    "nombre": "Producto Actualizado",
    "imagenesUrl": ["url1", "url2", "url3"],
    ...
  },
  "timestamp": "2024-11-24T15:31:00"
}
```

---

**Implementado por:** Frontend Team  
**Fecha:** 24 de Noviembre de 2025  
**Estado:** ✅ Completado y Listo para Pruebas
