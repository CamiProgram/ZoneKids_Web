# ZoneKids Backend API - Documentación Completa

## 📋 Tabla de Contenidos
1. [Resumen General](#resumen-general)
2. [Autenticación y Seguridad](#autenticación-y-seguridad)
3. [Estructura de Roles](#estructura-de-roles)
4. [Endpoints Públicos](#endpoints-públicos)
5. [Endpoints Protegidos](#endpoints-protegidos)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Validaciones](#validaciones)

---

## 📌 Resumen General

**ZoneKids Backend** es una API REST segura y versionada (`/api/v1/`) que implementa un sistema completo de autenticación con JWT, control de acceso basado en roles (RBAC) y gestión de productos, órdenes y usuarios.

**URL Base:** `http://localhost:8080`

### Stack Tecnológico
- **Java 21** + **Spring Boot 3.2.12**
- **Base de Datos:** MySQL con JPA/Hibernate
- **Seguridad:** Spring Security + JWT (io.jsonwebtoken 0.11.5)
- **Documentación:** OpenAPI 3.0 (Swagger)
- **Build Tool:** Maven

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

```
Cliente → Login → JWT Token ← Backend
         (email/password)
         
Cliente → Request + Token → Backend → Validación JWT → Procesamiento
         (Header Authorization: Bearer <token>)
```

### Token JWT

El token tiene validez de **24 horas** desde su emisión.

**Estructura del token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb3JyZW8uZW1haWxAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDA2Mjc3NTQsImV4cCI6MTcwMDcxNDE1NH0.xxxxx
```

---

## 👥 Estructura de Roles

El sistema implementa **3 roles** con permisos diferenciados:

### 1. **ADMIN** (Administrador)
- ✅ **Usuarios:** CRUD completo (crear, leer, actualizar, eliminar)
- ✅ **Productos:** CRUD completo
- ✅ **Órdenes:** CRUD completo + cambio de estado
- ✅ **Gestión:** Acceso total a todas las funciones

### 2. **VENDEDOR** (Vendedor)
- ❌ **Usuarios:** Solo lectura (GET)
- ✅ **Productos:** Solo lectura (GET)
- ✅ **Órdenes:** Solo lectura (GET)
- ⚠️ **Limitación:** No puede crear, editar ni borrar nada

### 3. **CLIENTE** (Cliente)
- ❌ **Usuarios:** Sin acceso
- ✅ **Productos:** Solo lectura (GET)
- ✅ **Órdenes:** Puede crear propias y ver sus órdenes
- 🛒 **Compras:** Sistema de carrito y checkout

---

## 🌐 Endpoints Públicos

### 1. Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "123456"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "mensaje": "Login exitoso - Rol: Administrador del sistema"
}
```

### 2. Registro
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "123456",
  "rol": "cliente"  (por defecto es CLIENTE)
}

Response: 201 Created
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "estado": "activo",
  "fechaCreacion": "2025-11-22T10:30:00",
  "fechaActualizacion": "2025-11-22T10:30:00"
}
```

---

## 🔒 Endpoints Protegidos

### 📦 PRODUCTOS (`/api/v1/productos`)

#### GET - Listar todos los productos
```
GET /api/v1/productos
Authorization: Bearer <token>

Acceso: ADMIN, VENDEDOR, CLIENTE

Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Juguete XYZ",
    "descripcion": "Descripción del juguete",
    "precio": 29.99,
    "stock": 100,
    "categoria": "juguetes",
    "imagenesUrl": ["url1", "url2", "url3"],
    "estado": "activo",
    "fechaCreacion": "2025-11-22T10:30:00",
    "esNuevo": true,
    "enOferta": false
  }
]
```

#### GET - Obtener producto por ID
```
GET /api/v1/productos/{id}
Authorization: Bearer <token>

Acceso: ADMIN, VENDEDOR, CLIENTE

Response: 200 OK
{
  "id": 1,
  "nombre": "Juguete XYZ",
  ...
}
```

#### POST - Crear producto (ADMIN only)
```
POST /api/v1/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Juguete",
  "descripcion": "Descripción",
  "precio": 49.99,
  "stock": 50,
  "categoria": "juguetes",
  "imagenesUrl": [
    "https://url1.jpg",
    "https://url2.jpg",
    "https://url3.jpg"
  ],
  "precioOriginal": 59.99,
  "esNuevo": true,
  "enOferta": false
}

Validación:
⚠️ REQUERIDO: 2-3 imágenes (mínimo 2, máximo 3)
⚠️ REQUERIDO: Precio > 0
⚠️ REQUERIDO: Stock >= 0

Response: 201 Created
{
  "id": 2,
  "nombre": "Nuevo Juguete",
  ...
}
```

#### PUT - Actualizar producto (ADMIN only)
```
PUT /api/v1/productos/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Juguete Actualizado",
  "descripcion": "Nueva descripción",
  "precio": 39.99,
  "stock": 100,
  "categoria": "juguetes",
  "imagenesUrl": [
    "https://newurl1.jpg",
    "https://newurl2.jpg"
  ],
  ...
}

Response: 200 OK
{
  "id": 1,
  ...
}
```

#### DELETE - Eliminar producto (ADMIN only)
```
DELETE /api/v1/productos/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "mensaje": "Producto eliminado exitosamente"
}
```

---

### 👤 USUARIOS (`/api/v1/usuarios`)

#### GET - Listar todos los usuarios (ADMIN only)
```
GET /api/v1/usuarios
Authorization: Bearer <token>

Acceso: ADMIN

Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "estado": "activo",
    "fechaCreacion": "2025-11-22T10:30:00",
    "fechaActualizacion": "2025-11-22T10:30:00"
  }
]
```

#### GET - Obtener usuario por ID (ADMIN only)
```
GET /api/v1/usuarios/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  ...
}
```

#### POST - Crear usuario (ADMIN only)
```
POST /api/v1/usuarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "contrasena": "securePassword123",
  "rol": "vendedor"  (admin, vendedor, cliente)
}

Response: 201 Created
{
  "id": 3,
  "nombre": "Nuevo Usuario",
  ...
}
```

#### PUT - Actualizar usuario (ADMIN only)
```
PUT /api/v1/usuarios/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "email": "newemail@example.com",
  "contrasena": "newPassword123",
  "rol": "cliente"
}

Response: 200 OK
{
  "id": 1,
  ...
}
```

#### PATCH - Cambiar estado de usuario (ADMIN only)
```
PATCH /api/v1/usuarios/{id}/estado?estado=inactivo
Authorization: Bearer <token>

Valores: "activo" o "inactivo"

Response: 200 OK
{
  "id": 1,
  "estado": "inactivo",
  ...
}
```

#### DELETE - Eliminar usuario (ADMIN only)
```
DELETE /api/v1/usuarios/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "mensaje": "Usuario eliminado exitosamente"
}
```

---

### 🛒 ÓRDENES (`/api/v1/ordenes`)

#### GET - Listar todas las órdenes (ADMIN, VENDEDOR)
```
GET /api/v1/ordenes
Authorization: Bearer <token>

Acceso: ADMIN, VENDEDOR

Response: 200 OK
[
  {
    "id": 1,
    "usuarioNombre": "Juan Pérez",
    "usuarioEmail": "juan@example.com",
    "total": 99.98,
    "estado": "pendiente",
    "fecha": "2025-11-22T10:30:00",
    "detalles": [
      {
        "id": 1,
        "productoNombre": "Juguete XYZ",
        "cantidad": 2,
        "precioUnitario": 49.99,
        "subtotal": 99.98
      }
    ]
  }
]
```

#### POST - Crear orden (ADMIN, CLIENTE)
```
POST /api/v1/ordenes
Authorization: Bearer <token>
Content-Type: application/json

{
  "usuarioId": 1,
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 2,
      "cantidad": 1
    }
  ]
}

Validaciones:
⚠️ Usuario debe existir
⚠️ Productos deben existir
⚠️ Stock suficiente
⚠️ Cantidad >= 1

Response: 201 Created
{
  "id": 1,
  "usuarioNombre": "Juan Pérez",
  "usuarioEmail": "juan@example.com",
  "total": 129.97,
  "estado": "pendiente",
  "fecha": "2025-11-22T10:30:00",
  "detalles": [...]
}
```

#### PATCH - Cambiar estado de orden (ADMIN only)
```
PATCH /api/v1/ordenes/{id}/estado?estado=completada
Authorization: Bearer <token>

Valores: "pendiente", "completada", "cancelada"

Response: 200 OK
{
  "id": 1,
  "estado": "completada",
  ...
}
```

#### DELETE - Eliminar orden (ADMIN only)
```
DELETE /api/v1/ordenes/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "mensaje": "Orden eliminada exitosamente"
}
```

---

## 💻 Ejemplos de Uso

### Ejemplo 1: Login y acceso a productos

```bash
# 1. Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zonekids.com",
    "contrasena": "admin123"
  }'

# Respuesta
# {
#   "token": "eyJhbGciOiJIUzI1NiJ9...",
#   "mensaje": "Login exitoso - Rol: Administrador del sistema"
# }

# 2. Usar token para acceder a productos
curl -X GET http://localhost:8080/api/v1/productos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# Respuesta: Lista de productos
```

### Ejemplo 2: Crear producto como ADMIN

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

curl -X POST http://localhost:8080/api/v1/productos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Rompecabezas 3D",
    "descripcion": "Rompecabezas educativo",
    "precio": 24.99,
    "stock": 50,
    "categoria": "educativos",
    "imagenesUrl": [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg",
      "https://example.com/img3.jpg"
    ],
    "esNuevo": true,
    "enOferta": false
  }'
```

### Ejemplo 3: Crear orden como CLIENTE

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

curl -X POST http://localhost:8080/api/v1/ordenes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 2,
    "detalles": [
      {
        "productoId": 1,
        "cantidad": 2
      }
    ]
  }'
```

---

## ✅ Validaciones

### Productos
- ✅ Nombre: No vacío
- ✅ Precio: >= 0
- ✅ Stock: >= 0
- ✅ **Imágenes: 2-3 URLs obligatorias**
- ✅ Categoría: No vacía

### Usuarios
- ✅ Nombre: No vacío
- ✅ Email: Formato válido y único
- ✅ Contraseña: No vacía (se cifra con BCrypt)
- ✅ Rol: admin, vendedor o cliente
- ✅ Estado: activo o inactivo

### Órdenes
- ✅ Usuario: Debe existir en la BD
- ✅ Productos: Deben existir y tener stock
- ✅ Cantidad: >= 1 por producto
- ✅ Detalles: Al menos 1 producto

---

## 📖 Documentación Interactiva

**Swagger UI:** http://localhost:8080/swagger-ui.html
**OpenAPI JSON:** http://localhost:8080/v3/api-docs

---

## 🔒 Seguridad

1. **JWT:** Token válido por 24 horas
2. **BCrypt:** Todas las contraseñas se cifran
3. **HTTPS (Producción):** Requerido para tokens
4. **Roles:** Control granular de acceso (RBAC)
5. **Validación:** DTOs con @Valid en todos los endpoints

---

## 🚀 Próximos Pasos

1. Cambiar `jwt.secret` por una clave segura en producción
2. Implementar HTTPS
3. Agregar rate limiting
4. Implementar refresh tokens
5. Agregar auditoría de cambios

