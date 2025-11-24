# 🔄 RESPUESTAS DEL BACKEND REQUERIDAS

## 📋 Estructura General de Respuestas

El frontend espera respuestas JSON con esta estructura base:

```javascript
{
  "success": true,           // Opcional pero recomendado
  "message": "...",          // Mensaje de éxito
  "data": { ... },           // Datos principales
  "timestamp": "2025-11-22T..." // Opcional
}
```

Para errores:
```javascript
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    { "field": "email", "defaultMessage": "Email ya existe" }
  ],
  "timestamp": "2025-11-22T..."
}
```

---

## 🔐 AUTH ENDPOINTS

### POST `/api/v1/auth/login`

**Request:**
```javascript
{
  "email": "user@example.com",
  "contrasena": "password123"
}
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "user@example.com",
    "id": 1,
    "nombre": "Juan Pérez",
    "rol": "ADMIN",                // O "VENDEDOR" o "CLIENTE"
    "activo": true
  }
}
```

**Response Error (401):**
```javascript
{
  "success": false,
  "message": "Email o contraseña incorrectos",
  "timestamp": "2025-11-22T..."
}
```

**Response Error - Usuario Inactivo (403):**
```javascript
{
  "success": false,
  "message": "La cuenta ha sido desactivada",
  "timestamp": "2025-11-22T..."
}
```

**Notas:**
- El token debe estar en formato JWT
- Se almacena en `localStorage.authToken`
- Los datos se almacenan en `localStorage.authUser` (JSON)
- El frontend agrega automáticamente: `Authorization: Bearer <token>` en todos los requests

---

### POST `/api/v1/auth/register`

**Request:**
```javascript
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "password123"        // Mínimo 8 caracteres
}
```

**Response Exitosa (201):**
```javascript
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "id": 1,
    "email": "juan@example.com",
    "nombre": "Juan Pérez",
    "rol": "CLIENTE",               // Por defecto para nuevos usuarios
    "activo": true,
    "fechaCreacion": "2025-11-22T..."
  }
}
```

**Response Error - Email duplicado (400):**
```javascript
{
  "success": false,
  "message": "El email ya está registrado",
  "errors": [
    { "field": "email", "defaultMessage": "Email ya existe" }
  ]
}
```

**Response Error - Validación (400):**
```javascript
{
  "success": false,
  "message": "Error en la validación",
  "errors": [
    { "field": "nombre", "defaultMessage": "El nombre es obligatorio" },
    { "field": "contrasena", "defaultMessage": "Mínimo 8 caracteres" }
  ]
}
```

**Notas:**
- NO devuelve token (usuario debe ir a login después)
- El nuevo usuario por defecto tiene rol "CLIENTE"
- El frontend muestra alerta y redirige a `/login`

---

## 📦 PRODUCTOS ENDPOINTS

### GET `/api/v1/productos`

**Request:**
```javascript
// Sin parámetros (GET público - no requiere autenticación)
GET /api/v1/productos
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Productos obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "Laptop",
      "descripcion": "Laptop 15 pulgadas",
      "precio": 999.99,
      "stock": 10,
      "categoria": "Electrónica",
      "imagenesUrl": [
        "https://example.com/laptop-1.jpg",
        "https://example.com/laptop-2.jpg"
      ],
      "activo": true,
      "fechaCreacion": "2025-11-22T..."
    },
    {
      "id": 2,
      "nombre": "Mouse",
      "descripcion": "Mouse inalámbrico",
      "precio": 25.99,
      "stock": 50,
      "categoria": "Accesorios",
      "imagenesUrl": [
        "https://example.com/mouse-1.jpg"
      ],
      "activo": true,
      "fechaCreacion": "2025-11-22T..."
    }
  ]
}
```

**Response Error - No hay productos (200):**
```javascript
{
  "success": true,
  "message": "No hay productos disponibles",
  "data": []
}
```

**Notas:**
- `imagenesUrl` es un **ARRAY** (puede tener múltiples URLs)
- Público (sin autenticación)
- El frontend muestra todos los productos en HomePage

---

### GET `/api/v1/productos/{id}`

**Request:**
```javascript
GET /api/v1/productos/1
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Producto obtenido",
  "data": {
    "id": 1,
    "nombre": "Laptop",
    "descripcion": "Laptop 15 pulgadas HP",
    "precio": 999.99,
    "stock": 10,
    "categoria": "Electrónica",
    "imagenesUrl": [
      "https://example.com/laptop-1.jpg",
      "https://example.com/laptop-2.jpg"
    ],
    "activo": true,
    "fechaCreacion": "2025-11-22T..."
  }
}
```

**Response Error - No existe (404):**
```javascript
{
  "success": false,
  "message": "Producto no encontrado",
  "data": null
}
```

**Notas:**
- Público (sin autenticación)
- El frontend usa esto en ProductDetailPage
- Muestra todas las imágenes en galería

---

### POST `/api/v1/productos`

**Request:**
```javascript
// FormData multipart (para archivos)
Content-Type: multipart/form-data

nombre: "Laptop Gaming"
descripcion: "Laptop para gaming"
precio: "1599.99"
stock: "5"
categoria: "Electrónica"
imagen: <File>          // Archivo de imagen
```

**Response Exitosa (201):**
```javascript
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Laptop Gaming",
    "descripcion": "Laptop para gaming",
    "precio": 1599.99,
    "stock": 5,
    "categoria": "Electrónica",
    "imagenesUrl": [
      "https://example.com/uploads/laptop-gaming-1.jpg"
    ],
    "activo": true,
    "fechaCreacion": "2025-11-22T..."
  }
}
```

**Response Error - Sin autenticación (401):**
```javascript
{
  "success": false,
  "message": "No autorizado",
  "timestamp": "2025-11-22T..."
}
```

**Response Error - Rol insuficiente (403):**
```javascript
{
  "success": false,
  "message": "Solo administradores pueden crear productos",
  "timestamp": "2025-11-22T..."
}
```

**Response Error - Validación (400):**
```javascript
{
  "success": false,
  "message": "Error en la validación",
  "errors": [
    { "field": "nombre", "defaultMessage": "El nombre es obligatorio" },
    { "field": "precio", "defaultMessage": "El precio debe ser mayor a 0" }
  ]
}
```

**Notas:**
- **Requiere autenticación** (Authorization header)
- **Solo rol ADMIN** (403 si no)
- `Content-Type: multipart/form-data` (no JSON)
- La imagen se convierte a URL y se retorna en `imagenesUrl`

---

### PUT `/api/v1/productos/{id}`

**Request:**
```javascript
// FormData multipart (para archivos)
Content-Type: multipart/form-data

nombre: "Laptop Gaming Pro"
descripcion: "Laptop gaming actualizada"
precio: "1799.99"
stock: "3"
categoria: "Electrónica"
imagen: <File>          // Opcional - nueva imagen
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Laptop Gaming Pro",
    "descripcion": "Laptop gaming actualizada",
    "precio": 1799.99,
    "stock": 3,
    "categoria": "Electrónica",
    "imagenesUrl": [
      "https://example.com/uploads/laptop-gaming-pro-1.jpg"
    ],
    "activo": true,
    "fechaCreacion": "2025-11-22T...",
    "fechaActualizacion": "2025-11-22T..."
  }
}
```

**Response Error - No existe (404):**
```javascript
{
  "success": false,
  "message": "Producto no encontrado"
}
```

**Notas:**
- **Requiere autenticación**
- **Solo rol ADMIN**
- Si no se envía imagen, mantiene las anteriores
- Si se envía imagen, reemplaza la anterior

---

### DELETE `/api/v1/productos/{id}`

**Request:**
```javascript
DELETE /api/v1/productos/10
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

**Response Error - No existe (404):**
```javascript
{
  "success": false,
  "message": "Producto no encontrado"
}
```

**Notas:**
- **Requiere autenticación**
- **Solo rol ADMIN**
- Puede ser eliminación real o lógica (inactivación)

---

## 👥 USUARIOS ENDPOINTS

### GET `/api/v1/usuarios`

**Request:**
```javascript
GET /api/v1/usuarios
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Usuarios obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "ADMIN",
      "activo": true,
      "fechaCreacion": "2025-11-22T..."
    },
    {
      "id": 2,
      "nombre": "María García",
      "email": "maria@example.com",
      "rol": "CLIENTE",
      "activo": true,
      "fechaCreacion": "2025-11-22T..."
    }
  ]
}
```

**Notas:**
- **Requiere autenticación**
- Todos los roles pueden acceder (pero el frontend filtra por ADMIN)
- NO incluye contraseñas

---

### GET `/api/v1/usuarios/{id}`

**Request:**
```javascript
GET /api/v1/usuarios/1
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Usuario obtenido",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "ADMIN",
    "activo": true,
    "fechaCreacion": "2025-11-22T..."
  }
}
```

**Notas:**
- **Requiere autenticación**
- NO incluye contraseña

---

### POST `/api/v1/usuarios`

**Request:**
```javascript
{
  "nombre": "Carlos López",
  "email": "carlos@example.com",
  "contrasena": "password123",
  "rol": "VENDEDOR"              // ADMIN, VENDEDOR o CLIENTE
}
```

**Response Exitosa (201):**
```javascript
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Carlos López",
    "email": "carlos@example.com",
    "rol": "VENDEDOR",
    "activo": true,
    "fechaCreacion": "2025-11-22T..."
  }
}
```

**Response Error - Email duplicado (400):**
```javascript
{
  "success": false,
  "message": "El email ya está registrado",
  "errors": [
    { "field": "email", "defaultMessage": "Email ya existe" }
  ]
}
```

**Response Error - Rol inválido (403):**
```javascript
{
  "success": false,
  "message": "Solo administradores pueden crear usuarios",
  "timestamp": "2025-11-22T..."
}
```

**Notas:**
- **Requiere autenticación**
- **Solo rol ADMIN** puede crear usuarios
- Valida: nombre, email (único), contraseña (8+ chars), rol válido

---

### PUT `/api/v1/usuarios/{id}`

**Request:**
```javascript
{
  "nombre": "Carlos López García",
  "email": "carlos.updated@example.com",
  "contrasena": "newpassword123",   // Opcional
  "rol": "VENDEDOR",                 // Opcional
  "activo": true                     // Opcional
}
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Carlos López García",
    "email": "carlos.updated@example.com",
    "rol": "VENDEDOR",
    "activo": true,
    "fechaCreacion": "2025-11-22T...",
    "fechaActualizacion": "2025-11-22T..."
  }
}
```

**Notas:**
- **Requiere autenticación**
- Solo ADMIN puede cambiar rol y activo
- Usuario puede cambiar su propio nombre/email/contraseña
- Valida email (único) si cambia

---

### DELETE `/api/v1/usuarios/{id}`

**Request:**
```javascript
DELETE /api/v1/usuarios/10
```

**Response Exitosa (200):**
```javascript
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

**Response Error - No existe (404):**
```javascript
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

**Notas:**
- **Requiere autenticación**
- **Solo rol ADMIN**

---

## 🔑 CÓDIGOS DE ESTADO HTTP

| Código | Significado | Cuándo |
|--------|-------------|--------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Validación fallida, datos inválidos |
| 401 | Unauthorized | Sin token o token inválido |
| 403 | Forbidden | Token válido pero rol insuficiente |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error del servidor |

---

## ⚠️ MANEJO DE ERRORES - IMPORTANTE

### El frontend espera esta estructura para errores:

```javascript
// Error con array de validaciones (para campos)
{
  "success": false,
  "message": "Error en la validación",
  "errors": [
    { "field": "email", "defaultMessage": "Email ya existe" },
    { "field": "nombre", "defaultMessage": "Nombre obligatorio" }
  ]
}

// Error simple
{
  "success": false,
  "message": "No autorizado"
}

// Error como string (fallback)
"Error al procesar la solicitud"
```

### El interceptor de axios manejará:

```javascript
// Si status 401 → logout automático y redirige a /login
// Si status 403 → muestra mensaje de acceso denegado
// Si status 400/404/500 → muestra el mensaje de error
```

---

## 📊 ESTADÍSTICAS - DASHBOARD

El AdminDashboard calcula estos valores con los datos de la API:

```javascript
// Calcula a partir de GET /api/v1/productos
totalProducts = data.length
activeProducts = data.filter(p => p.activo).length
lowStockProducts = data.filter(p => p.stock < 5).length

// Calcula a partir de GET /api/v1/usuarios
totalUsers = data.length
```

---

## 🎯 RESUMEN DE ENDPOINTS

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| GET | `/api/v1/productos` | No | - | Listar todos |
| GET | `/api/v1/productos/{id}` | No | - | Detalle de uno |
| POST | `/api/v1/productos` | Sí | ADMIN | Crear producto |
| PUT | `/api/v1/productos/{id}` | Sí | ADMIN | Actualizar |
| DELETE | `/api/v1/productos/{id}` | Sí | ADMIN | Eliminar |
| GET | `/api/v1/usuarios` | Sí | - | Listar usuarios |
| GET | `/api/v1/usuarios/{id}` | Sí | - | Detalle usuario |
| POST | `/api/v1/usuarios` | Sí | ADMIN | Crear usuario |
| PUT | `/api/v1/usuarios/{id}` | Sí | - | Actualizar |
| DELETE | `/api/v1/usuarios/{id}` | Sí | ADMIN | Eliminar |
| POST | `/api/v1/auth/login` | No | - | Iniciar sesión |
| POST | `/api/v1/auth/register` | No | - | Registro nuevo |

---

## 🔒 SEGURIDAD - NOTAS IMPORTANTES

1. **Token JWT debe incluir:**
   - `exp`: Fecha de expiración (24 horas recomendado)
   - `sub`: ID del usuario o email
   - `rol`: Rol del usuario

2. **El frontend:**
   - Automáticamente agrega `Authorization: Bearer <token>` a todos los requests
   - Automáticamente limpia datos si recibe 401
   - Redirige a `/login` si el token expira

3. **CORS:**
   - Backend debe permitir requests desde `http://localhost:5173` (desarrollo)
   - En producción: desde dominio del frontend

4. **Contraseñas:**
   - Mínimo 8 caracteres (validar en backend también)
   - Hash con bcrypt o similar en backend
   - NUNCA retornarlas en respuestas

---

## ✅ CHECKLIST PARA EL BACKEND

- [ ] POST `/api/v1/auth/login` retorna token JWT
- [ ] POST `/api/v1/auth/register` crea usuario con rol CLIENTE
- [ ] GET `/api/v1/productos` retorna array con `imagenesUrl` (array)
- [ ] GET `/api/v1/productos/{id}` retorna producto con `imagenesUrl` (array)
- [ ] POST `/api/v1/productos` solo funciona con rol ADMIN
- [ ] PUT `/api/v1/productos/{id}` solo funciona con rol ADMIN
- [ ] DELETE `/api/v1/productos/{id}` solo funciona con rol ADMIN
- [ ] GET `/api/v1/usuarios` requiere autenticación
- [ ] POST `/api/v1/usuarios` solo funciona con rol ADMIN
- [ ] PUT `/api/v1/usuarios/{id}` permite cambiar rol/activo solo para ADMIN
- [ ] DELETE `/api/v1/usuarios/{id}` solo funciona con rol ADMIN
- [ ] Errores 401 devuelven status 401 (para interceptor)
- [ ] Errores 403 devuelven status 403 (para detectar permiso)
- [ ] CORS habilitado para localhost:5173
