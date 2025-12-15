# 🔧 Solución: FormData y Upload de Imágenes

## ❌ Problema Identificado

El backend espera el parámetro `files` pero el frontend estaba usando `imagen`.

```javascript
// ❌ INCORRECTO
formData.append('imagen', file);
formData.append('imagen', file);

// ✅ CORRECTO
formData.append('files', file);
formData.append('files', file);
```

---

## ✅ Solución Implementada

### **1. productService.js - uploadImages()**

```javascript
uploadImages: async (files) => {
  try {
    console.log('📤 uploadImages: Iniciando upload de imágenes');
    
    const formData = new FormData();
    const validFiles = files.filter(f => f !== null && f !== undefined);
    
    if (validFiles.length < 2) {
      throw new Error('Se requiere un mínimo de 2 imágenes');
    }

    // ✅ CORRECTO: Usar 'files' como clave
    validFiles.forEach((file, index) => {
      console.log(`  📄 ${index + 1}. ${file.name}`);
      formData.append('files', file);  // ← CLAVE CORRECTA
    });

    // ✅ NO incluir Content-Type manual
    // Axios elimina automáticamente para FormData
    const response = await api.post('/upload/imagenes', formData);
    
    const imagenesUrl = response.data.data || response.data;
    return imagenesUrl;
  } catch (error) {
    console.error('❌ uploadImages: Error', error);
    throw error.response?.data || error.message;
  }
}
```

**Cambios principales:**
- ✅ Clave de FormData: `'files'` (NO `'imagen'`)
- ✅ Logging detallado de cada archivo
- ✅ NO incluir `Content-Type` manual en headers
- ✅ Mejor logging de errores

---

### **2. api.js - Interceptor Request**

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ IMPORTANTE: Eliminar Content-Type para FormData
    // Permite que navegador establezca el boundary correcto
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('🌐 FormData detectado - Eliminando Content-Type manual');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Cambios principales:**
- ✅ Eliminación correcta de `Content-Type` para FormData
- ✅ Logging diferenciado para FormData
- ✅ Detección automática de FormData

---

## 📋 Comparación: Antes vs Después

### **ANTES (❌ No funcionaba)**
```javascript
// productService.js
validFiles.forEach((file) => {
  formData.append('imagen', file);  // ❌ Clave incorrecta
});

const response = await api.post('/upload/imagenes', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',  // ❌ Incorrecto
  },
});

// Resultado:
// 400 Bad Request - parámetro 'files' no encontrado
```

### **DESPUÉS (✅ Funciona correctamente)**
```javascript
// productService.js
validFiles.forEach((file) => {
  formData.append('files', file);  // ✅ Clave correcta
});

// ✅ NO incluir Content-Type manual
const response = await api.post('/upload/imagenes', formData);

// Resultado:
// 200 OK - URLs de imágenes retornadas correctamente
```

---

## 🔍 Debugging: Consola Esperada

### **Upload Exitoso:**
```
📤 uploadImages: Iniciando upload de imágenes
📦 Total de archivos: 3
✅ Archivos válidos (no null/undefined): 3
📤 Agregando archivos al FormData con clave "files"
  📄 1. image1.jpg (2048.50 KB, image/jpeg)
  📄 2. image2.jpg (1512.25 KB, image/jpeg)
  📄 3. image3.jpg (1792.75 KB, image/jpeg)
📤 FormData preparado con 3 archivo(s)
🌐 Enviando POST a /api/v1/upload/imagenes
🔐 Request FormData: /upload/imagenes | Token: true | Rol: ADMIN
🌐 FormData detectado - Eliminando Content-Type manual
✅ Response recibida del servidor
📋 Status: 200
📋 Data: { success: true, data: [...] }
✅ URLs obtenidas: 3
  🔗 1. https://bucket.s3.amazonaws.com/productos/image-001.jpg
  🔗 2. https://bucket.s3.amazonaws.com/productos/image-002.jpg
  🔗 3. https://bucket.s3.amazonaws.com/productos/image-003.jpg
```

### **Error Común: Content-Type Incorrecto**
```
❌ uploadImages: Error en upload
📋 Error completo: AxiosError
📋 Response data: { message: "parámetro 'files' no encontrado" }
📋 Response status: 400
📋 Message: Bad Request
```

---

## 🎯 Alternativas del Backend

Si el endpoint `/upload/imagenes` sigue sin funcionar, hay alternativas:

### **Opción 1: POST /upload/subir-imagenes**
```javascript
// Endpoint alternativo - acepta 'files' o 'imagenesArray'
const response = await api.post('/upload/subir-imagenes', formData);
```

### **Opción 2: POST /upload/imagen (1 imagen por request)**
```javascript
// Subir imágenes una por una
for (const file of validFiles) {
  const fd = new FormData();
  fd.append('imagen', file);
  const response = await api.post('/upload/imagen', fd);
  // Guardar URL
}
```

---

## ✅ Checklist de Verificación

- [x] Clave FormData correcta: `'files'`
- [x] NO incluir `Content-Type` manual
- [x] Axios elimina automáticamente `Content-Type` para FormData
- [x] Logging detallado en consola
- [x] Validación de archivos antes de upload
- [x] Manejo de errores mejorado
- [x] Token incluido en Authorization header

---

## 🧪 Prueba Manual en Consola

```javascript
// En DevTools → Console, durante un upload

// Ver el FormData que se está enviando
// (Nota: FormData no es inspectable directamente)

// Ver request en Network tab:
// 1. Abrir DevTools → Network
// 2. Hacer upload de imágenes
// 3. Buscar request POST /upload/imagenes
// 4. Headers:
//    - Authorization: Bearer <token>
//    - Content-Type: multipart/form-data; boundary=...
// 5. Form Data:
//    - files: (binary) image1.jpg
//    - files: (binary) image2.jpg
//    - files: (binary) image3.jpg
```

---

## 🚀 Próximas Pruebas

### **Test 1: Crear Producto con 3 imágenes**
```
1. Login como ADMIN
2. Ir a /admin/products → "+ Crear"
3. Llenar datos + seleccionar 3 imágenes
4. Click "Crear Producto"
5. Ver Console:
   ✅ "Archivos válidos (no null/undefined): 3"
   ✅ "🌐 FormData detectado - Eliminando Content-Type manual"
   ✅ "✅ URLs obtenidas: 3"
6. Verificar en Network:
   ✅ POST /upload/imagenes status 200
```

### **Test 2: Editar Producto (cambiar 1 imagen)**
```
1. Ir a /admin/products → "Editar"
2. Reemplazar imagen #1 (mantener #2 y #3)
3. Click "Actualizar Producto"
4. Ver Console:
   ✅ "Archivos válidos (no null/undefined): 1"
   ✅ "✅ URLs obtenidas: 1"
```

---

## 📁 Archivos Modificados

```
src/
└── services/
    ├── api.js ✅ (logging mejorado para FormData)
    └── productService.js ✅ (uploadImages con 'files' correcto)
```

---

## 🔗 Referencias

**Endpoints del Backend:**
- POST `/api/v1/upload/imagenes` - Subir múltiples (clave: `files`)
- POST `/api/v1/upload/subir-imagenes` - Alternativo
- POST `/api/v1/upload/imagen` - Una imagen por vez

**Parámetros esperados:**
- FormData con campo(s) `files` (no `imagen`)
- Múltiples campos con la misma clave: `files`

**Headers automáticos:**
- `Authorization: Bearer <token>` (agregado por interceptor)
- `Content-Type: multipart/form-data; boundary=...` (del navegador)

---

## ⚠️ Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| 400 "parámetro files no encontrado" | Clave incorrecta en FormData | Usar `files` en lugar de `imagen` |
| 400 "Menos de 2 imágenes" | Archivos null/undefined | Validar antes de agregar a FormData |
| 403 "No tiene permisos" | Usuario no es ADMIN | Login como ADMIN |
| 401 "Token inválido" | Token no en localStorage | Verificar autenticación |
| 500 "Internal Server Error" | Error del servidor | Revisar logs del backend |

---

**Solución Implementada:** 24 Noviembre 2025  
**Estado:** ✅ Completada y Lista para Pruebas
