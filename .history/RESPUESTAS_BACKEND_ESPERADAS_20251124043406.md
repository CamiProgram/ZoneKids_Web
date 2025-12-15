# 🔄 Respuestas Esperadas del Backend

## 📤 POST /api/v1/auth/register

### **Request:**
```javascript
POST /api/v1/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "MiPassword123"
}
```

### **Response - Éxito (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "estado": "activo",
    "fechaCreacion": "2025-11-24T15:30:45Z"
  },
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Email duplicado (400):**
```json
{
  "success": false,
  "message": "El email ya está registrado",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Email inválido (400):**
```json
{
  "success": false,
  "message": "El email no es válido",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Contraseña muy corta (400):**
```json
{
  "success": false,
  "message": "La contraseña debe tener mínimo 8 caracteres",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 🔐 POST /api/v1/auth/login

### **Request:**
```javascript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contrasena": "MiPassword123"
}
```

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "estado": "activo",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWFuQGV4YW1wbGUuY29tIiwiZW1haWwiOiJqdWFuQGV4YW1wbGUuY29tIiwicm9sIjoiQ0xJRU5URSIsImlhdCI6MTczMjM2NDQ0NSwiZXhwIjoxNzMyNDUxMDQ1fQ.ABC123...",
    "expiresIn": 86400
  },
  "timestamp": "2025-11-24T15:30:45Z"
}
```

**JWT Decodificado (para referencia):**
```json
{
  "sub": "juan@example.com",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "iat": 1732364445,
  "exp": 1732451045
}
```

### **Response - Error: Email no existe (401):**
```json
{
  "success": false,
  "message": "Email o contraseña incorrectos",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Contraseña incorrecta (401):**
```json
{
  "success": false,
  "message": "Email o contraseña incorrectos",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Cuenta deshabilitada (403):**
```json
{
  "success": false,
  "message": "Tu cuenta ha sido deshabilitada",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 📤 POST /api/v1/upload/imagenes

### **Request:**
```javascript
POST /api/v1/upload/imagenes
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body (FormData):
- imagen: [File1.jpg]
- imagen: [File2.jpg]
- imagen: [File3.jpg]
```

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Imágenes subidas correctamente",
  "data": [
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-001.jpg",
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-002.jpg",
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-003.jpg"
  ],
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Menos de 2 imágenes (400):**
```json
{
  "success": false,
  "message": "Se requiere un mínimo de 2 imágenes",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Más de 3 imágenes (400):**
```json
{
  "success": false,
  "message": "Se permite un máximo de 3 imágenes",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: No autenticado (401):**
```json
{
  "success": false,
  "message": "No está autenticado",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: No es ADMIN (403):**
```json
{
  "success": false,
  "message": "No tiene permisos para acceder a este recurso",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 🖼️ PATCH /api/v1/productos/{id}/imagenes

### **Request:**
```javascript
PATCH /api/v1/productos/42/imagenes
Content-Type: application/json
Authorization: Bearer <token>

{
  "imagenesUrl": [
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-001.jpg",
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-002.jpg",
    "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-003.jpg"
  ]
}
```

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Imágenes actualizadas correctamente",
  "data": {
    "id": 42,
    "nombre": "Producto Actualizado",
    "descripcion": "Descripción del producto",
    "precio": 50000,
    "stock": 10,
    "categoria": "Juguetes",
    "imagenesUrl": [
      "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-001.jpg",
      "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-002.jpg",
      "https://bucket.s3.amazonaws.com/productos/imagen-2025-11-24-003.jpg"
    ],
    "precioOriginal": null,
    "esNuevo": false,
    "enOferta": false,
    "estado": "activo"
  },
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Menos de 2 imágenes (400):**
```json
{
  "success": false,
  "message": "Se requiere un mínimo de 2 imágenes",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Más de 3 imágenes (400):**
```json
{
  "success": false,
  "message": "Se permite un máximo de 3 imágenes",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Producto no existe (404):**
```json
{
  "success": false,
  "message": "Producto no encontrado",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: No es ADMIN (403):**
```json
{
  "success": false,
  "message": "No tiene permisos para acceder a este recurso",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 📝 POST /api/v1/productos (Crear Producto)

### **Request:**
```javascript
POST /api/v1/productos
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Mi Producto",
  "descripcion": "Descripción",
  "precio": 50000,
  "stock": 10,
  "categoria": "Juguetes",
  "estado": "activo",
  "precioOriginal": null,
  "esNuevo": true,
  "enOferta": false
}
```

**IMPORTANTE:** NO incluir `imagenesUrl` en el body (estará vacío en el backend)

### **Response - Éxito (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 42,
    "nombre": "Mi Producto",
    "descripcion": "Descripción",
    "precio": 50000,
    "stock": 10,
    "categoria": "Juguetes",
    "estado": "activo",
    "imagenesUrl": [],
    "precioOriginal": null,
    "esNuevo": true,
    "enOferta": false,
    "fechaCreacion": "2025-11-24T15:30:45Z"
  },
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Validación (400):**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "nombre",
      "message": "El nombre es obligatorio"
    },
    {
      "field": "precio",
      "message": "El precio debe ser un número entero"
    }
  ],
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## ✏️ PUT /api/v1/productos/{id} (Actualizar Producto)

### **Request:**
```javascript
PUT /api/v1/productos/42
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Producto Actualizado",
  "descripcion": "Nueva descripción",
  "precio": 55000,
  "stock": 15,
  "categoria": "Juguetes",
  "precioOriginal": 65000,
  "esNuevo": false,
  "enOferta": true
}
```

**IMPORTANTE:** NO incluir `imagenesUrl` en el body (usar PATCH para actualizar imágenes)

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 42,
    "nombre": "Producto Actualizado",
    "descripcion": "Nueva descripción",
    "precio": 55000,
    "stock": 15,
    "categoria": "Juguetes",
    "estado": "activo",
    "imagenesUrl": ["url1", "url2", "url3"],
    "precioOriginal": 65000,
    "esNuevo": false,
    "enOferta": true,
    "fechaActualizacion": "2025-11-24T15:35:00Z"
  },
  "timestamp": "2025-11-24T15:35:00Z"
}
```

---

## 🔍 GET /api/v1/productos (Listar Productos)

### **Request:**
```javascript
GET /api/v1/productos
(Sin autenticación requerida - público)
```

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Producto 1",
      "descripcion": "Descripción",
      "precio": 50000,
      "stock": 10,
      "categoria": "Juguetes",
      "estado": "activo",
      "imagenesUrl": ["url1", "url2", "url3"],
      "precioOriginal": null,
      "esNuevo": true,
      "enOferta": false
    },
    {
      "id": 2,
      "nombre": "Producto 2",
      "descripcion": "Descripción 2",
      "precio": 75000,
      "stock": 5,
      "categoria": "Ropa",
      "estado": "activo",
      "imagenesUrl": ["url4", "url5"],
      "precioOriginal": 90000,
      "esNuevo": false,
      "enOferta": true
    }
  ],
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Significado | Causa |
|--------|-----------|-------|
| 200 | OK | Operación exitosa (GET, PUT, PATCH) |
| 201 | Created | Recurso creado (POST) |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o no autenticado |
| 403 | Forbidden | Sin permisos (rol requerido) |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

---

## 🧪 Cómo Validar en el Navegador

1. **Abrir Developer Tools:** F12
2. **Tab "Network":** Ver todas las requests
3. **Tab "Console":** Ver logs detallados
4. **Console de tu navegador mostrará:**

   ```
   🔐 Login: POST /auth/login
   📧 Email: juan@example.com
   ✅ Login exitoso
   👤 Usuario autenticado: { email, rol, nombre }
   💾 Token y usuario guardados en localStorage
   ```

---

## 💾 LocalStorage después de Login

```javascript
// En DevTools → Application → LocalStorage

authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

authUser: {
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "estado": "activo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

**Referencia:** Respuestas esperadas del Backend  
**Fecha:** 24 Noviembre 2025  
**Estado:** ✅ Documentado
