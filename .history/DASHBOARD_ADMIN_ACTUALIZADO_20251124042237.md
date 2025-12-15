# ✅ DASHBOARD ADMIN ACTUALIZADO - Configuración Correcta

## 🎯 Estado Actual

El backend ahora funciona correctamente con autenticación JWT que incluye el rol. El frontend ha sido actualizado para:

1. ✅ Recibir y guardar el token con rol en localStorage
2. ✅ Enviar el token en cada request (header Authorization: Bearer <token>)
3. ✅ Manejar correctamente errores de autorización (403)
4. ✅ Mostrar mensajes de error claros al usuario
5. ✅ Incluir logs de debugging para facilitar diagnóstico

---

## 🔄 Flujo de Autenticación Correcto

```
USUARIO HACE LOGIN
        ↓
POST /api/v1/auth/login (email + contraseña)
        ↓
BACKEND VALIDA Y GENERA JWT
JWT contiene: { sub, email, rol: "ADMIN" }
        ↓
FRONTEND RECIBE TOKEN
Guarda en localStorage:
- authToken: "eyJhbGci..." (el JWT completo)
- authUser: { email, rol, id, nombre }
        ↓
FRONTEND HACE REQUEST A /admin/dashboard
GET /api/v1/ordenes
GET /api/v1/usuarios
GET /api/v1/productos
        ↓
CADA REQUEST INCLUYE HEADER
Authorization: Bearer eyJhbGci...
        ↓
BACKEND RECIBE REQUEST
Spring Security extrae JWT
Lee el claim "rol"
Verifica que el usuario tiene ADMIN
        ↓
✅ AUTORIZA Y RETORNA DATOS
        ↓
FRONTEND CARGA DATOS Y MUESTRA DASHBOARD
```

---

## 📂 Archivos Actualizados en Frontend

### 1. AdminDashboard.jsx
**Cambios:**
- ✅ Agregado logging detallado para debugging
- ✅ Mejorado manejo de errores (diferencia 403/401/otros)
- ✅ Logs muestran cuántos productos, usuarios y órdenes se cargaron
- ✅ Error messages específicos para el usuario

**Logs que verás en consola:**
```
📊 Iniciando carga de datos del dashboard...
✅ Productos cargados: 15
✅ Usuarios cargados: 8
✅ Órdenes cargadas: 5
📊 Estadísticas: { totalProducts: 15, totalUsers: 8, ... }
📊 Dashboard cargado exitosamente
```

### 2. AdminUsers.jsx
**Cambios:**
- ✅ Agregado logging detallado
- ✅ Mejorado manejo de errores

**Logs que verás:**
```
👥 Cargando usuarios...
✅ Usuarios cargados: 8
```

### 3. AdminProducts.jsx
**Cambios:**
- ✅ Agregado logging detallado
- ✅ Mejorado manejo de errores

**Logs que verás:**
```
📦 Cargando productos...
✅ Productos cargados: 15
```

---

## 🔐 Cómo Funciona la Autenticación

### 1. Generación del JWT (Backend)

```java
// Cuando el usuario hace login
String token = Jwts.builder()
    .setSubject(usuario.getId().toString())
    .claim("email", usuario.getEmail())
    .claim("rol", usuario.getRol())  // ← EL ROL SE INCLUYE AQUÍ
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS256, SECRET)
    .compact();

// Retorna: { token, email, rol: "ADMIN" }
```

### 2. Almacenamiento en Frontend

```javascript
// authService.js - login()
const userData = response.data.data;
localStorage.setItem('authToken', userData.token);
localStorage.setItem('authUser', JSON.stringify(userData));
// Guarda: { email, rol: "ADMIN", id, nombre }
```

### 3. Envío del Token en cada Request

```javascript
// api.js - Request Interceptor
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### 4. Validación en Backend

```java
// Spring Security - Filter
String authHeader = request.getHeader("Authorization");
String token = authHeader.substring(7); // Remover "Bearer "

Claims claims = Jwts.parser()
    .setSigningKey(SECRET)
    .parseClaimsJws(token)
    .getBody();

String rol = claims.get("rol", String.class);

if (!rol.equalsIgnoreCase("ADMIN")) {
    response.sendError(403, "Acceso denegado");
    return;
}
```

---

## 🧪 Cómo Verificar que Funciona

### Paso 1: Abre el Navegador
1. Ve a http://localhost:3000
2. Haz login con usuario admin

### Paso 2: Abre DevTools (F12)
1. Ve a la pestaña "Console"
2. Deberías ver logs como:
   ```
   🔐 Request: http://localhost:8080/api/v1/ordenes | Token: true | Rol: ADMIN
   ```

### Paso 3: Accede al Dashboard Admin
1. Ve a http://localhost:3000/admin/dashboard
2. Deberías ver:
   - ✅ Tabla de órdenes cargada
   - ✅ Estadísticas mostradas
   - ✅ Sin errores 403

### Paso 4: Accede a Admin Users
1. Ve a http://localhost:3000/admin/users
2. Deberías ver:
   - ✅ Tabla de usuarios cargada
   - ✅ Sin errores 403

### Paso 5: Accede a Admin Products
1. Ve a http://localhost:3000/admin/products
2. Deberías ver:
   - ✅ Tabla de productos cargada
   - ✅ Sin errores 403

---

## 🔍 Qué Hacer Si Algo Falla

### Si ves "No tienes permisos para acceder al dashboard"

**Causa:** El backend rechaza con 403

**Soluciones:**
1. Verifica que el usuario en BD tiene rol "ADMIN"
2. Abre DevTools (F12) → Console
3. Busca el log que muestre qué rol tiene
4. Si rol es NULL → el backend no incluye rol en JWT
5. Si rol es distinto a "ADMIN" → ajustar en backend

**Para verificar, ejecuta en la consola:**
```javascript
console.log(JSON.parse(localStorage.getItem('authUser')).rol)
// Debería mostrar: "ADMIN"
```

### Si ves "Tu sesión ha expirado"

**Causa:** Error 401 - Token inválido o expirado

**Soluciones:**
1. Cierra sesión y vuelve a hacer login
2. Verifica que el token se guardó: 
   ```javascript
   console.log(localStorage.getItem('authToken') !== null)
   // Debería mostrar: true
   ```

### Si la página no carga (LoadingSpinner solo)

**Causa:** Error en la petición

**Soluciones:**
1. Abre DevTools (F12) → Console
2. Busca logs rojos (❌) o errores
3. Copia el error completo
4. Verifica que el backend está ejecutándose

---

## 📊 Información que Verás en Consola

### Si todo funciona correctamente

```
🔐 Request: http://localhost:8080/api/v1/ordenes | Token: true | Rol: ADMIN | Email: admin@example.com
📊 Iniciando carga de datos del dashboard...
✅ Productos cargados: 15
✅ Usuarios cargados: 8
✅ Órdenes cargadas: 5
📊 Estadísticas: {totalProducts: 15, totalUsers: 8, lowStockProducts: 2, activeProducts: 12}
📊 Dashboard cargado exitosamente
```

### Si hay error 403

```
❌ Error fetching dashboard data: Error: Request failed with status code 403
Error response: {error: "Solo ADMIN puede acceder"}
Error status: 403
```

### Si hay error 401

```
❌ Error fetching dashboard data: Error: Request failed with status code 401
Error response: {error: "Token inválido o expirado"}
Error status: 401
```

---

## ⚙️ Endpoints del Backend Esperados

El frontend espera que estos endpoints existan y retornen datos:

```
GET /api/v1/usuarios                    → Lista todos los usuarios
GET /api/v1/productos                   → Lista todos los productos
GET /api/v1/ordenes                     → Lista todas las órdenes
GET /api/v1/productos/{id}/imagenes     → Obtiene imágenes de producto
POST /api/v1/upload/imagenes            → Carga imágenes
PATCH /api/v1/productos/{id}/imagenes   → Actualiza imágenes
PATCH /api/v1/productos/{id}/estado     → Cambia estado de producto
PUT /api/v1/usuarios/{id}               → Actualiza usuario
POST /api/v1/ordenes/{id}/estado        → Actualiza estado de orden
```

Todos estos requieren autenticación (header Authorization con JWT).

---

## 🎯 Checklist Final

✅ Backend genera JWT con rol incluido
✅ Frontend recibe y guarda token + rol
✅ Frontend envía token en cada request
✅ Backend valida rol correctamente
✅ Errores 403 se manejan correctamente
✅ Mensajes de error son claros
✅ Logs de debugging ayudan a diagnosticar

---

## 📚 Documentación Relacionada

- `CHECKLIST_BACKEND_403.md` - Si aún hay problemas de 403
- `SCRIPT_TEST_ENDPOINTS.md` - Para probar endpoints manualmente
- `RESUMEN_BACKEND_REVISAR.md` - Resumen rápido de lo que revisar

---

## 🚀 Próximos Pasos

1. **Verificar que funciona:**
   - Login → Dashboard → Usuarios → Productos
   - Todo debería cargar sin errores

2. **Si algo falla:**
   - Copiar logs de la consola
   - Comparar con documentación

3. **Cuando todo funcione:**
   - El dashboard estará completamente operativo
   - Podrás administrar usuarios, productos y órdenes
