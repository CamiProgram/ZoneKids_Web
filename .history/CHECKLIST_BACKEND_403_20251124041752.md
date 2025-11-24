# 📋 CHECKLIST PARA BACKEND - Errores 403 en Endpoints Admin

## 🔴 Problema Reportado
El frontend recibe **403 Forbidden** al intentar acceder a endpoints administrativos, aunque:
- ✅ El token JWT se está enviando correctamente
- ✅ El usuario tiene rol "ADMIN"
- ✅ El header `Authorization: Bearer <token>` está presente

---

## 🎯 Endpoints Afectados

### 1. GET /api/v1/ordenes
**Llamada desde**: `AdminDashboard.jsx`
**Servicio**: `orderService.getAll()`
**Rol requerido**: ADMIN
**Propósito**: Listar todas las órdenes del sistema

```javascript
// Frontend llama:
const allOrders = await orderService.getAll();
// Que hace: GET /api/v1/ordenes
// Con header: Authorization: Bearer <jwt-token>
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Órdenes obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "usuario": { "id": 1, "nombre": "Juan", "email": "juan@example.com" },
      "total": 50000,
      "fecha": "2025-11-24T10:30:00",
      "estado": "pendiente",
      "detalles": [
        { "producto": { "nombre": "Producto 1" }, "cantidad": 1, "precio": 50000 }
      ]
    }
  ],
  "timestamp": "2025-11-24T10:35:00"
}
```

---

### 2. GET /api/v1/usuarios
**Llamada desde**: `AdminUsers.jsx`
**Servicio**: `userService.getAll()`
**Rol requerido**: ADMIN
**Propósito**: Listar todos los usuarios

```javascript
// Frontend llama:
const users = await userService.getAll();
// Que hace: GET /api/v1/usuarios
// Con header: Authorization: Bearer <jwt-token>
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "ADMIN",
      "estado": "activo",
      "fecha_creacion": "2025-11-20T00:00:00"
    }
  ],
  "timestamp": "2025-11-24T10:35:00"
}
```

---

## ✅ CHECKLIST DE REVISIÓN PARA BACKEND

### Paso 1: Verificar Autenticación

- [ ] **Verificar que el token JWT se está recibiendo**
  ```java
  @GetMapping("/ordenes")
  public ResponseEntity<?> getAllOrdenes(
      @RequestHeader("Authorization") String authHeader) {
      
      // Agregar LOG aquí
      System.out.println("🔐 Auth Header recibido: " + authHeader);
      // Debería mostrar: "Bearer eyJhbGciOiJIUzI1NiI..."
  }
  ```

- [ ] **Verificar que el token se está parseando correctamente**
  ```java
  String token = authHeader.replace("Bearer ", "");
  System.out.println("✅ Token extraído: " + token.substring(0, 20) + "...");
  ```

- [ ] **Verificar que el token es válido**
  ```java
  Claims claims = Jwts.parserBuilder()
      .setSigningKey(secret)
      .build()
      .parseClaimsJws(token)
      .getBody();
  
  System.out.println("✅ Token válido. Claims: " + claims);
  ```

---

### Paso 2: Verificar Rol del Usuario

- [ ] **Extraer el rol del JWT**
  ```java
  String userRole = claims.get("rol", String.class);
  System.out.println("👤 Rol del usuario en JWT: " + userRole);
  // Debería mostrar: "ADMIN"
  ```

- [ ] **Verificar formato del rol**
  - ¿Es "ADMIN" (mayúsculas)?
  - ¿O es "admin" (minúsculas)?
  - ¿O es algo completamente diferente?

  ```java
  // Comparación segura
  System.out.println("Rol recibido: '" + userRole + "'");
  System.out.println("¿Contiene ADMIN? " + userRole.contains("ADMIN"));
  System.out.println("¿Es admin en minúsculas? " + userRole.equalsIgnoreCase("admin"));
  ```

- [ ] **Verificar que el rol existe en el JWT**
  ```java
  if (userRole == null) {
      System.err.println("❌ El JWT NO contiene campo 'rol'");
      // Esto sería el problema
  }
  ```

---

### Paso 3: Verificar Autorización

- [ ] **Revisar el filtro/interceptor que valida permisos**
  
  Buscar en el código algo como:
  ```java
  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/ordenes")
  public ResponseEntity<?> getAllOrdenes() { ... }
  ```

  O en un filter/interceptor:
  ```java
  if (!userRole.equals("ADMIN")) {
      response.sendError(403, "Acceso denegado");
  }
  ```

- [ ] **Hacer LOG detallado en el filtro de autorización**
  ```java
  public class AdminAuthorizationFilter extends OncePerRequestFilter {
      
      @Override
      protected void doFilterInternal(
          HttpServletRequest request,
          HttpServletResponse response,
          FilterChain filterChain) throws ServletException, IOException {
          
          String url = request.getRequestURI();
          System.out.println("🔍 URL solicitada: " + url);
          
          if (url.contains("/usuarios") || url.contains("/ordenes")) {
              String authHeader = request.getHeader("Authorization");
              System.out.println("📍 Endpoint admin detectado");
              System.out.println("📍 Auth Header: " + authHeader);
              
              // Extraer rol...
              String userRole = extractRoleFromToken(authHeader);
              System.out.println("📍 Rol extraído: " + userRole);
              
              if (!isAdmin(userRole)) {
                  System.out.println("❌ ACCESO DENEGADO - Rol no es ADMIN");
                  response.sendError(403, "Acceso denegado");
                  return;
              }
          }
          
          filterChain.doFilter(request, response);
      }
  }
  ```

---

### Paso 4: Verificar Endpoints Existen

- [ ] **Verificar que el controller de órdenes existe**
  ```java
  @RestController
  @RequestMapping("/api/v1/ordenes")
  public class OrdenenController {
      
      @GetMapping
      public ResponseEntity<?> getAll() { ... }
  }
  ```

- [ ] **Verificar que el controller de usuarios existe**
  ```java
  @RestController
  @RequestMapping("/api/v1/usuarios")
  public class UsuarioController {
      
      @GetMapping
      public ResponseEntity<?> getAll() { ... }
  }
  ```

- [ ] **Ambos endpoints están disponibles en la URL correcta**
  - `GET http://localhost:8080/api/v1/ordenes`
  - `GET http://localhost:8080/api/v1/usuarios`

---

### Paso 5: Verificar Estructura de Respuesta

- [ ] **La respuesta tiene la estructura correcta**
  ```java
  // Correcto:
  {
    "success": true,
    "message": "...",
    "data": [ ... ],
    "timestamp": "..."
  }
  
  // Incorrecto (solo array):
  [ { ... }, { ... } ]
  ```

- [ ] **El campo `data` contiene los datos**
  ```java
  // En el frontend:
  const response = await api.get('/ordenes');
  const ordenes = response.data.data;  // ← Espera response.data.data
  ```

---

## 🔧 LOGS QUE DEBERÍA VER EN BACKEND

Cuando intenta acceder a `/api/v1/ordenes` o `/api/v1/usuarios`, debería ver logs como:

```
🔐 Auth Header recibido: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJz...
✅ Token extraído: eyJhbGciOiJIUzI1NiIsInR5cC...
✅ Token válido. Claims: {sub=1, email=admin@example.com, rol=ADMIN, ...}
👤 Rol del usuario en JWT: ADMIN
✅ Autorización exitosa - Rol es ADMIN
📊 Obteniendo ordenes de la base de datos...
✅ Se encontraron 5 órdenes
```

---

## ❌ LOGS QUE INDICAN EL PROBLEMA

Si ve alguno de estos, eso es el problema:

### Problema 1: Token no se recibe
```
🔐 Auth Header recibido: null
❌ No hay token en el header
```
**Solución**: Verificar que el cliente está enviando `Authorization: Bearer <token>`

---

### Problema 2: Rol es null/undefined
```
👤 Rol del usuario en JWT: null
❌ El JWT NO contiene campo 'rol'
```
**Solución**: Al generar el JWT en login, agregar el rol:
```java
claims.put("rol", usuario.getRol());
```

---

### Problema 3: Rol tiene valor diferente
```
👤 Rol del usuario en JWT: admin
❌ Se compara con "ADMIN" (mayúsculas)
```
**Solución**: Hacer comparación case-insensitive:
```java
if (!userRole.equalsIgnoreCase("ADMIN")) {
    response.sendError(403, "Acceso denegado");
}
```

---

### Problema 4: Rol tiene formato diferente
```
👤 Rol del usuario en JWT: ROLE_ADMIN
❌ Se compara con "ADMIN"
```
**Solución**: Ajustar la comparación:
```java
if (!userRole.equals("ROLE_ADMIN") && !userRole.equals("ADMIN")) {
    response.sendError(403, "Acceso denegado");
}
```

---

### Problema 5: Endpoint no existe
```
⚠️ URL solicitada: /api/v1/ordenes
❌ 404 NOT FOUND (no 403)
```
**Solución**: Crear el endpoint en el controller

---

## 📝 PASOS PARA DEBUGGEAR

### 1. Agregar logs al generar JWT (en Login)
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // ... validación ...
    
    Usuario usuario = usuarioRepository.findByEmail(request.getEmail());
    System.out.println("✅ Usuario encontrado: " + usuario.getEmail());
    System.out.println("👤 Rol del usuario: " + usuario.getRol());
    
    String token = generarJWT(usuario);
    System.out.println("🔐 JWT generado con rol: " + usuario.getRol());
    
    return ResponseEntity.ok(new { token, rol: usuario.getRol() });
}
```

---

### 2. Agregar logs al validar token (en Filter/Interceptor)
```java
private String extraerRolDelToken(String token) {
    try {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(secret)
            .build()
            .parseClaimsJws(token)
            .getBody();
        
        String rol = claims.get("rol", String.class);
        System.out.println("🔍 Extrayendo rol del JWT: " + rol);
        System.out.println("🔍 Tipo de dato: " + (rol == null ? "NULL" : rol.getClass().getName()));
        System.out.println("🔍 Valor exact: '" + rol + "'");
        
        return rol;
    } catch (Exception e) {
        System.err.println("❌ Error extrayendo rol: " + e.getMessage());
        return null;
    }
}
```

---

### 3. Agregar logs en el método del endpoint
```java
@GetMapping("/ordenes")
public ResponseEntity<?> getAllOrdenes(
    HttpServletRequest request) {
    
    String authHeader = request.getHeader("Authorization");
    String userRole = extraerRolDelToken(authHeader);
    
    System.out.println("=== GET /ordenes ===");
    System.out.println("Auth Header: " + authHeader);
    System.out.println("Rol: " + userRole);
    System.out.println("¿Es ADMIN? " + "ADMIN".equals(userRole));
    
    List<Orden> ordenes = ordenRepository.findAll();
    
    return ResponseEntity.ok(new ApiResponse(true, "OK", ordenes));
}
```

---

## 🎯 PLAN DE ACCIÓN

1. **Agregar logs** en los 3 puntos mencionados arriba
2. **Reiniciar backend** con nivel de log en DEBUG
3. **Hacer login** en el frontend con usuario admin
4. **Acceder a `/admin/dashboard`**
5. **Revisar logs del backend** para encontrar dónde falla
6. **Hacer fix** según lo que muestre el log
7. **Reiniciar backend**
8. **Probar nuevamente**

---

## 📞 INFO PARA REPORTAR DE VUELTA

Cuando revise el backend, envíe:

1. **Los logs exactos** que se ven cuando intenta acceder a `/api/v1/ordenes`
2. **El valor exacto del rol** que se muestra en logs
3. **La estructura del JWT** (si es posible, el rol está en el payload)
4. **Si el endpoint existe** y dónde está ubicado
5. **Qué código hay en el filter de autorización**

Con esa información podemos hacer el fix rápidamente.

---

## 💡 SOLUCIONES RÁPIDAS COMUNES

### Si el rol es "admin" en lugar de "ADMIN"
```java
// CAMBIAR ESTO:
if (!userRole.equals("ADMIN")) { ... }

// POR ESTO:
if (!userRole.equalsIgnoreCase("ADMIN")) { ... }
```

### Si el rol no está en el JWT
```java
// Al generar token, agregar:
claims.put("rol", usuario.getRol());
```

### Si hay conflicto de nombres (ROLE_ADMIN vs ADMIN)
```java
// Hacer comparación flexible:
boolean isAdmin = userRole != null && 
    (userRole.equals("ADMIN") || userRole.equals("ROLE_ADMIN"));

if (!isAdmin) {
    response.sendError(403, "Acceso denegado");
}
```

---

## ✅ VERIFICACIÓN FINAL

Cuando todo esté listo, debería poder:

1. ✅ Hacer login con usuario admin
2. ✅ Ir a `/admin/dashboard` SIN ver error 403
3. ✅ Ver tabla de órdenes cargada
4. ✅ Ir a `/admin/users` SIN ver error 403
5. ✅ Ver tabla de usuarios cargada

Si todas estas funcionan, el problema está resuelto.
