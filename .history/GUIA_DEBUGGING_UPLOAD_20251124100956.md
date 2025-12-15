# 🔍 Guía de Debugging - Upload de Imágenes

## 📊 Flujo Completo con Puntos de Validación

```
┌─────────────────────────────────────────────────────────────┐
│              SELECCIONAR IMÁGENES EN FORMULARIO              │
└─────────────────────────────────────────────────────────────┘
                          ↓
         ✅ VALIDACIÓN 1: Verificar archivos
         - Console: "📦 Total de archivos: 3"
         - Console: "✅ Archivos válidos: 3"
                          ↓
         ✅ VALIDACIÓN 2: FormData correcto
         - Console: "📄 1. image1.jpg"
         - Console: "📄 2. image2.jpg"
         - Console: "📄 3. image3.jpg"
         - Clave: 'files' (NO 'imagen')
                          ↓
         ✅ VALIDACIÓN 3: Headers correctos
         - Console: "🔐 Request FormData: /upload/imagenes"
         - Console: "🌐 FormData detectado - Eliminando Content-Type"
         - Authorization: Bearer <token>
                          ↓
         ✅ VALIDACIÓN 4: Request enviado
         - Network tab: POST /upload/imagenes
         - Status: (pendiente...)
                          ↓
    ╔════════════════════╤════════════════════╗
    │                    │                    │
  ✅ ÉXITO (200)      ❌ ERROR (400/403)
    │                    │
    ↓                    ↓
Response ok:        Revisar error:
- Status: 200      - 400: parámetro inválido
- Data: URLs []    - 403: permisos insuficientes
- Console: ✅ URLs - 401: token inválido
    │                    │
    ↓                    ↓
  Crear/Editar    Mostrar error al usuario
  producto
    │
    ↓
  ✅ ÉXITO FINAL
```

---

## 🔧 Pasos de Debugging

### **PASO 1: Verificar Archivos Seleccionados**

**Qué buscar en Console:**
```
📤 uploadImages: Iniciando upload de imágenes
📦 Total de archivos: 3
✅ Archivos válidos (no null/undefined): 3
```

**Si ves "Total de archivos: 0":**
- ❌ No seleccionaste ninguna imagen
- ❌ Los archivos no se guardaron en el estado
- **Solución:** Hacer click en "Seleccionar Imagen" y elegir archivo

**Si ves "Archivos válidos: 0":**
- ❌ Los archivos son null o undefined
- ❌ Problema en handleImagenChange
- **Solución:** Revisar que los archivos se guardaron correctamente

---

### **PASO 2: Verificar FormData**

**Qué buscar en Console:**
```
📤 Agregando archivos al FormData con clave "files"
  📄 1. image1.jpg (2048.50 KB, image/jpeg)
  📄 2. image2.jpg (1512.25 KB, image/jpeg)
  📄 3. image3.jpg (1792.75 KB, image/jpeg)
📤 FormData preparado con 3 archivo(s)
```

**Si ves "Archivo X no es un File válido":**
- ❌ El objeto no es un File válido
- ❌ Problema en la captura del archivo
- **Solución:** Verificar que `file` es del tipo `File`

---

### **PASO 3: Verificar Headers**

**Qué buscar en Console:**
```
🔐 Request FormData: /upload/imagenes | Token: true | Rol: ADMIN
🌐 FormData detectado - Eliminando Content-Type manual
```

**Si ves "Token: false":**
- ❌ No hay token en localStorage
- ❌ Usuario no está autenticado
- **Solución:** Login y asegurar que eres ADMIN

**Si ves "Rol: CLIENTE":**
- ❌ Eres CLIENTE, no ADMIN
- ❌ No tienes permisos para upload
- **Solución:** Login como ADMIN

---

### **PASO 4: Verificar Network Request**

**Abrir DevTools Network tab:**

1. **Antes de hacer upload:**
   - Click en "Network" tab
   - Limpiar requests (click en 🚫)

2. **Hacer upload de imágenes**

3. **Buscar request:**
   - URL: `POST /upload/imagenes`
   - O buscar por "upload"

4. **Verificar details:**
   - **Headers:**
     ```
     Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
     Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
     ```
   - **Form Data (Payload):**
     ```
     files: (binary) image1.jpg
     files: (binary) image2.jpg
     files: (binary) image3.jpg
     ```
   - **Response:**
     - Status: 200 ✅ o 400/403 ❌

---

### **PASO 5: Interpretar Respuesta**

**Éxito (200):**
```
Console:
✅ Response recibida del servidor
📋 Status: 200
📋 Data: { success: true, data: [...] }
✅ URLs obtenidas: 3
  🔗 1. https://bucket.s3.amazonaws.com/...
  🔗 2. https://bucket.s3.amazonaws.com/...
  🔗 3. https://bucket.s3.amazonaws.com/...
```

**Error 400 - Parámetro inválido:**
```
Console:
❌ uploadImages: Error en upload
📋 Response status: 400
📋 Response data: { message: "parámetro 'files' no encontrado" }
```
**Solución:** Verificar que la clave es `'files'` (no `'imagen'`)

**Error 403 - Permisos insuficientes:**
```
Console:
❌ Error 403 - Acceso denegado
📋 Rol del usuario: CLIENTE
```
**Solución:** Login como ADMIN

**Error 401 - No autenticado:**
```
Console:
❌ Error 401 - Token inválido o expirado
```
**Solución:** Login nuevamente

---

## 🎯 Checklist de Debugging

### **Antes de hacer upload:**
- [ ] Estoy logueado como ADMIN
- [ ] Seleccioné exactamente 3 imágenes
- [ ] Las imágenes son válidas (JPG, PNG)
- [ ] Las imágenes no son muy grandes

### **Cuando hago upload:**
- [ ] Console muestra "Total de archivos: 3"
- [ ] Console muestra "FormData preparado con 3 archivo(s)"
- [ ] Console muestra "🔐 Request FormData: /upload/imagenes"
- [ ] Console muestra "🌐 FormData detectado - Eliminando Content-Type"

### **Después de enviar:**
- [ ] Network tab muestra POST /upload/imagenes
- [ ] Status es 200 (verde) ✅
- [ ] Console muestra "✅ Response recibida del servidor"
- [ ] Console muestra "✅ URLs obtenidas: 3"
- [ ] Console muestra 3 URLs diferentes

### **Si hay error:**
- [ ] Ver status exacto (400, 403, 401, 500)
- [ ] Ver mensaje de error en Response data
- [ ] Consultar tabla de errores arriba

---

## 🔍 Problemas Específicos y Soluciones

### **Problema 1: "Error 400 - parámetro files no encontrado"**

**Causas posibles:**
1. Clave FormData incorrecta
2. No se están agregando archivos a FormData
3. FormData se está enviando vacío

**Cómo verificar:**
```javascript
// En Console, copiar:
// (No se puede inspeccionar FormData directamente)
// Pero ver Network tab → Form Data
```

**Solución:**
- Verificar que `formData.append('files', file)` usa `'files'`
- No usar `'imagen'`, `'file'`, `'archivo'`
- Verificar que validFiles.length > 0

---

### **Problema 2: "Error 403 - No tiene permisos"**

**Causas posibles:**
1. No eres ADMIN
2. Token no incluye rol ADMIN
3. Token expirado

**Cómo verificar:**
```
Console:
🔐 Request FormData: /upload/imagenes | Token: true | Rol: CLIENTE
                                                      ↑ AQUÍ ESTÁ EL PROBLEMA
```

**Solución:**
- Logout y login como ADMIN
- Verificar rol en localStorage:
  ```javascript
  JSON.parse(localStorage.getItem('authUser')).rol
  // Debe ser: "ADMIN"
  ```

---

### **Problema 3: "Error 401 - Token inválido"**

**Causas posibles:**
1. No hay token
2. Token expirado
3. Token corrupto

**Cómo verificar:**
```
Console:
⚠️ No hay token disponible para: /upload/imagenes

O

❌ Error 401 - Token inválido o expirado
```

**Solución:**
- Verificar token en localStorage:
  ```javascript
  localStorage.getItem('authToken')
  // Debe ser: "eyJhbGc..."
  ```
- Si está vacío: hacer Login
- Si existe: hacer Logout y Login nuevamente

---

### **Problema 4: "Error 500 - Internal Server Error"**

**Causas posibles:**
1. Error en el backend
2. Problema con almacenamiento de imágenes
3. Ruta S3 incorrecta

**Cómo verificar:**
```
Network tab → Response:
{ "message": "... (error del servidor)" }
```

**Solución:**
- Revisar logs del backend
- Verificar que bucket S3 está configurado
- Contactar con equipo backend

---

## 📱 Comandos Rápidos en Console

```javascript
// Ver token
localStorage.getItem('authToken')

// Ver usuario y rol
JSON.parse(localStorage.getItem('authUser'))

// Ver rol específicamente
JSON.parse(localStorage.getItem('authUser')).rol

// Limpiar sesión (forzar logout)
localStorage.removeItem('authToken');
localStorage.removeItem('authUser');

// Recargar página
location.reload()
```

---

## 🎬 Grabación de Steps para Debugging

1. **Abrir DevTools:** F12
2. **Click en Console tab**
3. **Click en Network tab** (en paralelo)
4. **Ir a /admin/products → "+ Crear"**
5. **Seleccionar 3 imágenes**
6. **Llenar datos del producto**
7. **Click "Crear Producto"**
8. **Revisar Console:**
   - ¿Muestra "Archivos válidos: 3"?
   - ¿Muestra "✅ URLs obtenidas: 3"?
9. **Revisar Network tab:**
   - ¿POST /upload/imagenes en verde (200)?
   - ¿Form Data tiene 3 "files"?

---

## 🆘 Si Nada de Esto Funciona

1. **Capturar screenshot de:**
   - Console (errores)
   - Network tab (request/response)
   - Formulario (datos que ingresaste)

2. **Verificar:**
   - ¿Estás logueado como ADMIN?
   - ¿Seleccionaste 3 imágenes?
   - ¿Las imágenes son válidas (JPG, PNG)?
   - ¿El backend está corriendo en localhost:8080?

3. **Probar alternativa:**
   - Usar endpoint `/upload/subir-imagenes`
   - Usar endpoint `/upload/imagen` (1 imagen por request)

4. **Contactar:** Si todo falla, revisar configuración del backend

---

**Guía de Debugging Completa**  
**Fecha:** 24 Noviembre 2025  
**Estado:** ✅ Completa
