# 🎉 ZoneKids API - Endpoints Finales

**Base URL:** `http://localhost:8080/api/v1`

---

## 🔐 AUTENTICACIÓN

### 1. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "camilotapia828@gmail.com",
  "contrasena": "admin123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Admin",
      "email": "camilotapia828@gmail.com",
      "rol": "ADMIN"
    }
  }
}
```

**Credenciales de prueba:**
- **ADMIN**: `camilotapia828@gmail.com` / `admin123`
- **CLIENTE**: `cliente@test.com` / `cliente123456`
- **VENDEDOR**: `vendedor@test.com` / `vendedor123456`

---

### 2. Register (Registro público)
```
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "contrasena": "password123",
  "rol": "cliente"
}

Response: 201 Created
```

---

## 📦 PRODUCTOS

### 3. Obtener todos los productos (PÚBLICO)
```
GET /productos
No requiere autenticación

Response: 200 OK
{
  "success": true,
  "message": "Productos obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "PRODUCTO ACTUALIZADO",
      "descripcion": "Descripcion actualizada",
      "precio": 49.99,
      "precioOriginal": 79.99,
      "stock": 95,
      "categoria": "Ropa Bebe",
      "imagenesUrl": [
        "https://via.placeholder.com/300x300?text=Image1",
        "https://via.placeholder.com/300x300?text=Image2",
        "https://via.placeholder.com/300x300?text=Image3"
      ],
      "estado": "activo",
      "esNuevo": true,
      "enOferta": true,
      "fechaCreacion": "2025-11-23T10:48:20",
      "fechaActualizacion": "2025-11-23T10:51:00"
    }
  ]
}
```

### 4. Obtener producto por ID (PÚBLICO)
```
GET /productos/{id}
No requiere autenticación

Ejemplo: GET /productos/1

Response: 200 OK
{
  "success": true,
  "message": "Producto obtenido",
  "data": { ... }
}
```

### 5. Crear producto (Solo ADMIN)
```
POST /productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripcion del producto",
  "precio": 25.99,
  "precioOriginal": 35.99,
  "stock": 50,
  "categoria": "Ropa Bebe",
  "imagenesUrl": [
    "https://via.placeholder.com/300x300?text=Image1",
    "https://via.placeholder.com/300x300?text=Image2"
  ],
  "esNuevo": true,
  "enOferta": false
}

Response: 201 Created
```

⚠️ **Validación:** Las imágenes deben ser mínimo 2 y máximo 3

### 6. Actualizar producto (Solo ADMIN)
```
PUT /productos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "descripcion": "Nueva descripcion",
  "precio": 29.99,
  "stock": 75,
  "categoria": "Ropa Bebe",
  "imagenesUrl": [
    "https://via.placeholder.com/300x300?text=Img1",
    "https://via.placeholder.com/300x300?text=Img2"
  ],
  "precioOriginal": 39.99,
  "esNuevo": false,
  "enOferta": true
}

Response: 200 OK
```

### 7. Eliminar producto (Solo ADMIN)
```
DELETE /productos/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## 👥 USUARIOS

### 8. Obtener todos los usuarios (Solo ADMIN)
```
GET /usuarios
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Usuarios obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "Admin",
      "email": "camilotapia828@gmail.com",
      "rol": "ADMIN",
      "estado": "activo",
      "fechaCreacion": "2025-11-23T10:48:20",
      "fechaActualizacion": "2025-11-23T10:48:20"
    }
  ]
}
```

### 9. Obtener usuario por ID (Solo ADMIN)
```
GET /usuarios/{id}
Authorization: Bearer {token}

Response: 200 OK
```

### 10. Crear usuario (Solo ADMIN)
```
POST /usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "contrasena": "password123",
  "rol": "cliente"
}

Response: 201 Created
```

### 11. Actualizar usuario (Solo ADMIN)
```
PUT /usuarios/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Usuario Actualizado",
  "email": "nuevo@example.com",
  "contrasena": "password123",
  "rol": "vendedor"
}

Response: 200 OK
```

### 12. Cambiar estado de usuario (Solo ADMIN)
```
PATCH /usuarios/{id}/estado?estado=inactivo
Authorization: Bearer {token}

Valores válidos para estado: "activo", "inactivo"

Response: 200 OK
```

### 13. Eliminar usuario (Solo ADMIN)
```
DELETE /usuarios/{id}
Authorization: Bearer {token}

Response: 200 OK
```

---

## 🛒 ÓRDENES (COMPRAS)

### 14. Obtener todas las órdenes (Solo ADMIN)
```
GET /ordenes
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Órdenes obtenidas",
  "data": [
    {
      "id": 1,
      "usuarioId": 2,
      "usuarioNombre": "Cliente",
      "total": 357.92,
      "estado": "pendiente",
      "fecha": "2025-11-23T10:51:30",
      "detalles": [
        {
          "id": 1,
          "productoId": 1,
          "productoNombre": "PRODUCTO ACTUALIZADO",
          "cantidad": 5,
          "precioUnitario": 49.99,
          "subtotal": 249.95
        },
        {
          "id": 2,
          "productoId": 2,
          "productoNombre": "Pantalón de Algodón Azul",
          "cantidad": 3,
          "precioUnitario": 35.99,
          "subtotal": 107.97
        }
      ]
    }
  ]
}
```

### 15. Obtener orden por ID (Autenticado)
```
GET /ordenes/{id}
Authorization: Bearer {token}

Response: 200 OK
```

### 16. Crear una orden (Descuenta stock automáticamente)
```
POST /ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuarioId": 2,
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 5
    },
    {
      "productoId": 2,
      "cantidad": 3
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "message": "Orden creada exitosamente y stock actualizado",
  "data": {
    "id": 1,
    "usuarioId": 2,
    "usuarioNombre": "Cliente",
    "total": 357.92,
    "estado": "pendiente",
    "fecha": "2025-11-23T10:51:30",
    "detalles": [ ... ]
  }
}

⚠️ ERRORES POSIBLES:
- 400: Stock insuficiente para el producto X
- 400: Producto no encontrado
- 400: Usuario no encontrado
```

### 17. Cancelar orden (Solo ADMIN)
```
DELETE /ordenes/{id}
Authorization: Bearer {token}

⚠️ Solo se pueden cancelar órdenes en estado "pendiente"

Response: 200 OK
{
  "success": true,
  "message": "Orden cancelada exitosamente"
}
```

---

## 📋 RESUMEN DE PERMISOS

| Endpoint | GET | POST | PUT | DELETE | PATCH |
|----------|-----|------|-----|--------|-------|
| `/productos` | 🌐 | 👑 | - | - | - |
| `/productos/:id` | 🌐 | - | 👑 | 👑 | - |
| `/usuarios` | 👑 | 👑 | - | - | - |
| `/usuarios/:id` | 👑 | - | 👑 | 👑 | - |
| `/usuarios/:id/estado` | - | - | - | - | 👑 |
| `/ordenes` | 👑 | ✅ | - | 👑 | - |
| `/ordenes/:id` | ✅ | - | - | - | - |
| `/auth/login` | - | 🌐 | - | - | - |
| `/auth/register` | - | 🌐 | - | - | - |

Leyenda:
- 🌐 = Público (sin autenticación)
- ✅ = Cualquier usuario autenticado
- 👑 = Solo ADMIN

---

## 🔑 CÓMO USAR EL JWT TOKEN

1. **Login** para obtener el token
2. **Agrega el token** en el header de cada petición:
   ```
   Authorization: Bearer {token}
   ```

**Ejemplo con fetch (JavaScript):**
```javascript
const token = "eyJhbGciOiJIUzI1NiJ9...";

fetch('http://localhost:8080/api/v1/productos', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ✅ FEATURES IMPLEMENTADOS

✅ **Autenticación JWT** - Login seguro con tokens
✅ **Gestión de Productos** - CRUD completo
✅ **Validación de Imágenes** - Mínimo 2, máximo 3 por producto
✅ **Gestión de Usuarios** - CRUD y control de roles
✅ **Órdenes de Compra** - Creación y descuento automático de stock
✅ **Control de Roles** - ADMIN, VENDEDOR, CLIENTE
✅ **Transacciones** - Todo o nada en operaciones críticas
✅ **Manejo de Errores** - Mensajes claros y específicos
✅ **CORS** - Configurado para localhost:3000, 5173, 8080

---

## 🚀 ESTADO DEL SERVIDOR

**Base URL:** `http://localhost:8080`
**Puerto:** 8080
**Estado:** ✅ EN LÍNEA Y FUNCIONANDO

---

## 📝 NOTAS IMPORTANTES

1. **Stock se descuenta automáticamente** al crear una orden
2. **Las órdenes comienzan en estado "pendiente"**
3. **No se puede actualizar la contraseña sin enviarla en el PUT del usuario**
4. **Los roles válidos son:** admin, vendedor, cliente
5. **El estado de productos válidos:** activo, inactivo
6. **El estado de órdenes válidos:** pendiente, completada, cancelada

---

Creado: 23 de Noviembre de 2025
Última actualización: 23 de Noviembre de 2025
