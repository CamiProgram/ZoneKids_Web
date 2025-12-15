# 📚 Referencia Rápida - Todos los Endpoints Implementados

## 🔐 AUTENTICACIÓN

### POST /api/v1/auth/register
```
Propósito: Registrar nuevo usuario
Requiere: Nada
Parámetros: { nombre, email, contrasena }
Retorna: { id, email, nombre, rol: "CLIENTE" }
Características:
- Codifica contraseña con BCrypt
- Asigna rol CLIENTE automáticamente
```

### POST /api/v1/auth/login
```
Propósito: Autenticar usuario
Requiere: Nada
Parámetros: { email, contrasena }
Retorna: { id, email, nombre, rol, token }
Características:
- Compara contraseña con BCrypt
- Genera JWT con rol incluido
- Token válido 24 horas
```

---

## 👥 USUARIOS

### GET /api/v1/usuarios
```
Propósito: Obtener lista de todos los usuarios
Requiere: Token ADMIN
Parámetros: Ninguno
Retorna: Array de usuarios
Características:
- Solo ADMIN puede ver todos los usuarios
- Incluye: id, nombre, email, rol, estado
```

### GET /api/v1/usuarios/{id}
```
Propósito: Obtener usuario específico
Requiere: Token (autenticación)
Parámetros: id (en URL)
Retorna: Objeto usuario
Características:
- Usuario puede ver su propio perfil
- ADMIN puede ver cualquier usuario
```

### POST /api/v1/usuarios
```
Propósito: Crear nuevo usuario
Requiere: Token ADMIN
Parámetros: { nombre, email, contrasena, rol }
Retorna: { id, email, nombre, rol }
Características:
- Solo ADMIN puede crear usuarios
- Rol puede ser: ADMIN, VENDEDOR, CLIENTE
- Email debe ser único
```

### PUT /api/v1/usuarios/{id}
```
Propósito: Actualizar datos del usuario
Requiere: Token (autenticación)
Parámetros: id (en URL), { nombre, email, contrasena, ... }
Retorna: Usuario actualizado
Características:
- Usuario puede actualizar su perfil
- ADMIN puede actualizar cualquier usuario
```

### PATCH /api/v1/usuarios/{id}/estado
```
Propósito: Cambiar estado de usuario (activar/desactivar)
Requiere: Token ADMIN
Parámetros: id (en URL), estado (en query: "activo" o "inactivo")
Retorna: Usuario actualizado
URL: /usuarios/{id}/estado?estado=activo
Características:
- Solo ADMIN puede cambiar estado
- Usuario inactivo NO puede hacer login
- Valores válidos: "activo", "inactivo"
```

### DELETE /api/v1/usuarios/{id}
```
Propósito: Eliminar usuario
Requiere: Token ADMIN
Parámetros: id (en URL)
Retorna: { success, message }
Características:
- Solo ADMIN puede eliminar
- Operación irreversible
```

---

## 📦 PRODUCTOS

### GET /api/v1/productos
```
Propósito: Obtener lista de productos
Requiere: Nada (público)
Parámetros: Ninguno
Retorna: Array de productos
Características:
- Acceso público
- Incluye: id, nombre, precio, stock, imagenesUrl, etc.
- Puede filtrar por estado: activo
```

### GET /api/v1/productos/{id}
```
Propósito: Obtener producto específico
Requiere: Nada (público)
Parámetros: id (en URL)
Retorna: Objeto producto
Características:
- Acceso público
- Incluye imágenes
```

### POST /api/v1/productos
```
Propósito: Crear nuevo producto
Requiere: Token ADMIN
Parámetros: { nombre, descripcion, precio, stock, categoria, ... }
Retorna: Producto creado
Características:
- Solo ADMIN puede crear
- Precio debe ser Integer (no Float)
- Stock debe ser Integer
- imagenesUrl: inicialmente vacío (agregar con PATCH)
```

### PUT /api/v1/productos/{id}
```
Propósito: Actualizar datos del producto
Requiere: Token ADMIN
Parámetros: id (en URL), { nombre, precio, stock, ... }
Retorna: Producto actualizado
Características:
- Solo ADMIN puede actualizar
- NO actualizar imágenes aquí (usar PATCH)
- Precio y stock deben ser Integer
```

### PATCH /api/v1/productos/{id}/imagenes
```
Propósito: Actualizar SOLO las imágenes del producto
Requiere: Token ADMIN
Parámetros: id (en URL), { imagenesUrl: [...] }
Retorna: Producto actualizado
Características:
- Solo ADMIN puede cambiar imágenes
- Requiere 2-3 URLs de imágenes
- URLs obtienen de POST /upload/imagenes
```

### PATCH /api/v1/productos/{id}/estado
```
Propósito: Cambiar estado del producto
Requiere: Token ADMIN
Parámetros: id (en URL), estado (en query: "activo" o "inactivo")
Retorna: Producto actualizado
Características:
- Solo ADMIN puede cambiar
- Valores: "activo", "inactivo"
```

### DELETE /api/v1/productos/{id}
```
Propósito: Eliminar producto
Requiere: Token ADMIN
Parámetros: id (en URL)
Retorna: { success, message }
Características:
- Solo ADMIN puede eliminar
```

---

## 📤 UPLOAD DE IMÁGENES

### POST /api/v1/upload/imagenes
```
Propósito: Subir múltiples imágenes
Requiere: Token ADMIN
Parámetros: FormData con campos 'imagen'
Retorna: Array de URLs
URL: /upload/imagenes
Características:
- Solo ADMIN puede subir
- Mínimo 2 imágenes, máximo 3
- Campos: imagen, imagen, imagen
- Retorna URLs para usar en PATCH /productos/{id}/imagenes
```

### POST /api/v1/upload/imagen
```
Propósito: Subir UNA imagen
Requiere: Token ADMIN
Parámetros: FormData con campo 'imagen'
Retorna: Array con 1 URL
Características:
- Solo ADMIN puede subir
- Alternativa a POST /imagenes
```

### POST /api/v1/upload/subir-imagenes
```
Propósito: Subir imágenes (alternativo)
Requiere: Token ADMIN
Parámetros: FormData con campos 'imagen'
Retorna: Array de URLs
Características:
- Compatible con POST /imagenes
- Nombre alternativo del endpoint
```

---

## 📋 ÓRDENES

### GET /api/v1/ordenes
```
Propósito: Obtener lista de órdenes
Requiere: Token ADMIN
Parámetros: Ninguno
Retorna: Array de órdenes
Características:
- Solo ADMIN puede ver todas
- Incluye: id, usuario, productos, total, estado, etc.
```

### GET /api/v1/ordenes/{id}
```
Propósito: Obtener orden específica
Requiere: Token (usuario propietario o ADMIN)
Parámetros: id (en URL)
Retorna: Objeto orden
Características:
- Usuario ve solo sus órdenes
- ADMIN ve todas
```

### POST /api/v1/ordenes
```
Propósito: Crear nueva orden
Requiere: Token (autenticación)
Parámetros: { usuarioId, detalles: [...] }
Retorna: Orden creada
Características:
- Cualquier usuario autenticado puede crear
- Descuenta stock automáticamente
- Detalles: { productoId, cantidad, precio }
```

### PATCH /api/v1/ordenes/{id}/estado
```
Propósito: Cambiar estado de orden
Requiere: Token ADMIN
Parámetros: id (en URL), estado (en query)
Retorna: Orden actualizada
Características:
- Solo ADMIN puede cambiar
- Estados: pendiente, procesando, enviado, entregado, cancelado
```

---

## 🔍 BÚSQUEDA Y FILTROS

### Query Parameters (Ejemplos)

```
GET /api/v1/productos?categoria=Juguetes
GET /api/v1/productos?estado=activo
GET /api/v1/usuarios?rol=CLIENTE
GET /api/v1/ordenes?estado=pendiente
```

---

## 🔐 SEGURIDAD - Headers Requeridos

### Con Autenticación
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Para FormData (Upload)
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
(Axios lo configura automáticamente)
```

---

## ❌ Códigos de Error Comunes

| Código | Significado | Causa |
|--------|-----------|-------|
| 400 | Bad Request | Validación fallida, parámetros inválidos |
| 401 | Unauthorized | Token inválido o no autenticado |
| 403 | Forbidden | Sin permisos (role requerido) |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

---

## 🎯 Flujos Comunes

### **FLUJO: Crear Producto con Imágenes**
```
1. POST /upload/imagenes (subir 3 archivos)
   → Retorna: ["url1", "url2", "url3"]

2. POST /productos (crear producto)
   → Datos sin imagenesUrl
   → Retorna: { id: 42, ... }

3. PATCH /productos/42/imagenes (actualizar imágenes)
   → { imagenesUrl: ["url1", "url2", "url3"] }
   → Retorna: Producto con imágenes
```

### **FLUJO: Editar Producto**
```
1. GET /productos/{id} (obtener datos actuales)

2. Opcionalmente:
   POST /upload/imagenes (subir nuevas imágenes)

3. PUT /productos/{id} (actualizar datos)

4. PATCH /productos/{id}/imagenes (actualizar imágenes)
```

### **FLUJO: Gestión de Usuarios**
```
1. GET /usuarios (ver todos - ADMIN)

2. POST /usuarios (crear - ADMIN)
   O GET /usuarios/{id} (ver uno)
   O PUT /usuarios/{id} (editar)

3. PATCH /usuarios/{id}/estado (cambiar estado - ADMIN)
   → ?estado=inactivo (desactivar)
   → ?estado=activo (activar)

4. DELETE /usuarios/{id} (eliminar - ADMIN)
```

---

## 📊 Resumen de Métodos por Rol

### **CLIENTE (Usuario normal)**
- ✅ GET /auth/login
- ✅ POST /auth/register
- ✅ GET /productos (ver todos)
- ✅ GET /productos/{id} (ver detalles)
- ✅ GET /usuarios/{id} (ver su perfil)
- ✅ PUT /usuarios/{id} (editar su perfil)
- ✅ POST /ordenes (crear orden)
- ✅ GET /ordenes/{id} (ver sus órdenes)
- ❌ POST /upload/imagenes (NO)
- ❌ POST /productos (NO)

### **VENDEDOR (Vendedor)**
- ✅ Todos los de CLIENTE
- ✅ POST /productos (crear productos)
- ✅ PUT /productos/{id} (editar sus productos)
- ✅ POST /upload/imagenes (subir imágenes)
- ❌ GET /usuarios (NO)
- ❌ POST /usuarios (NO)

### **ADMIN (Administrador)**
- ✅ TODOS los endpoints
- ✅ GET /usuarios (ver todos)
- ✅ POST /usuarios (crear usuarios)
- ✅ DELETE /usuarios/{id} (eliminar usuarios)
- ✅ PATCH /usuarios/{id}/estado (cambiar estado)
- ✅ POST /productos (crear productos)
- ✅ PATCH /productos/{id}/imagenes (cambiar imágenes)
- ✅ PATCH /ordenes/{id}/estado (cambiar estado orden)
- ✅ POST /upload/imagenes (subir imágenes)

---

## 🧪 Postman/Curl Examples

### **Login**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","contrasena":"Admin123"}'
```

### **Obtener Productos**
```bash
curl -X GET http://localhost:8080/api/v1/productos
```

### **Cambiar Estado Usuario (ADMIN)**
```bash
curl -X PATCH "http://localhost:8080/api/v1/usuarios/1/estado?estado=inactivo" \
  -H "Authorization: Bearer <TOKEN>"
```

### **Crear Producto (ADMIN)**
```bash
curl -X POST http://localhost:8080/api/v1/productos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mi Producto","precio":50000,"stock":10,"categoria":"Juguetes"}'
```

### **Upload Imágenes**
```bash
curl -X POST http://localhost:8080/api/v1/upload/imagenes \
  -H "Authorization: Bearer <TOKEN>" \
  -F "imagen=@image1.jpg" \
  -F "imagen=@image2.jpg" \
  -F "imagen=@image3.jpg"
```

---

**Referencia Completa de Endpoints**  
**Fecha:** 24 Noviembre 2025  
**Estado:** ✅ Documentado
