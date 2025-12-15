# 🚨 RESUMEN EJECUTIVO - Errores 403 Backend

## ⚡ Problema en 1 Línea
El backend retorna **403 Forbidden** en `/api/v1/ordenes` y `/api/v1/usuarios` aunque el usuario tiene rol ADMIN y el token JWT es válido.

---

## 🎯 Causas Posibles (en orden de probabilidad)

### 1. **🔴 PROBABLE: El rol NO se incluye en el JWT** (60% de probabilidad)

Cuando el usuario hace login, el JWT se genera sin incluir el campo `rol`.

**Síntoma en logs:**
```
🔍 Rol extraído: null
❌ FALLO: Rol es NULL en el JWT
```

**Fix:**
```java
// En generarJWT() agregar:
claims.put("rol", usuario.getRol());
```

---

### 2. **🟠 POSIBLE: El rol tiene formato diferente** (25% de probabilidad)

El rol se incluye pero con minúsculas o formato diferente:
- "admin" en lugar de "ADMIN"
- "ROLE_ADMIN" en lugar de "ADMIN"
- "administrador" en lugar de "ADMIN"

**Síntoma en logs:**
```
🔍 Rol extraído: admin
❌ FALLO: Rol 'admin' no es ADMIN
```

**Fix:**
```java
// Cambiar de:
if (!rol.equals("ADMIN"))

// A:
if (!rol.equalsIgnoreCase("ADMIN"))
```

---

### 3. **🟡 MENOS PROBABLE: Endpoint no existe** (10% de probabilidad)

Los controllers para `/api/v1/ordenes` o `/api/v1/usuarios` no están creados.

**Síntoma:**
- Recibir 404 en lugar de 403 (ó 403 porque el filter rechaza antes)

**Fix:**
Crear los controllers:
```java
@RestController
@RequestMapping("/api/v1/ordenes")
public class OrdenenController {
    @GetMapping
    public ResponseEntity<?> getAll() { ... }
}

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    @GetMapping
    public ResponseEntity<?> getAll() { ... }
}
```

---

### 4. **🟢 RARO: Token no se recibe en backend** (5% de probabilidad)

El header Authorization no llega al backend (problema de CORS o network).

**Síntoma en logs:**
```
🔍 Auth Header presente: false
```

**Fix:**
Verificar configuración de CORS en backend

---

## 📋 INSTRUCCIONES DE 5 MINUTOS

1. **Abrir el código backend** y buscar:
   - [ ] Clase `JwtTokenProvider` o donde se genera el JWT
   - [ ] Método que genera `Claims`
   - [ ] Búsqueda: `claims.put("rol"` 

2. **Si NO ENCUENTRA `claims.put("rol"...`:**
   - ❌ ESE ES EL PROBLEMA
   - Agregar: `claims.put("rol", usuario.getRol());`
   - Guardar y reiniciar backend
   - Probar - debería funcionar

3. **Si SÍ ENCUENTRA `claims.put("rol"...`:**
   - Ir al filter que valida admin
   - Buscar: `claims.get("rol"`
   - Verificar cómo compara el rol:
     - Si usa `.equals("ADMIN")` → Cambiar a `.equalsIgnoreCase("ADMIN")`
     - Si usa algo más complejo → Revisar lógica

4. **Si todo eso está bien:**
   - Agregar logs al código (ver sección de logs)
   - Reiniciar backend
   - Intentar acceder a `/admin/dashboard`
   - Copiar logs
   - Revisar qué dice

---

## 🔍 3 PREGUNTAS PARA IDENTIFICAR EL PROBLEMA

```
1. ¿Se incluye "rol" en el JWT cuando se genera en login?
   Búsqueda: claims.put("rol"
   
2. ¿El rol se compara correctamente en el filter?
   Búsqueda: rol.equals o rol.equalsIgnoreCase
   
3. ¿Los endpoints /api/v1/ordenes y /api/v1/usuarios existen?
   Búsqueda: @RestController @RequestMapping("/api/v1/ordenes")
   Búsqueda: @RestController @RequestMapping("/api/v1/usuarios")
```

Si las 3 respuestas son SÍ → Agregar logs
Si alguna es NO → Hacer ese fix

---

## 📥 Documentos de Referencia

- **CHECKLIST_BACKEND_403.md** - Checklist completo de qué revisar
- **CODIGO_JAVA_BACKEND_EJEMPLO.md** - Ejemplos exactos de código que debería estar

---

## ✅ VERIFICACIÓN FINAL

Después de hacer los cambios, debería poder:

```
1. Login con admin@example.com
2. Ir a http://localhost:3000/admin/dashboard
   → NO ver error 403
   → VER tabla de órdenes cargada
3. Ir a http://localhost:3000/admin/users
   → NO ver error 403  
   → VER tabla de usuarios cargada
```

Si todo eso funciona → ¡Problema resuelto!

---

## 🆘 Si Sigue Sin Funcionar

Enviar los logs del backend cuando intente acceder a:
- `GET /api/v1/ordenes`
- `GET /api/v1/usuarios`

Con esos logs será obvio qué está fallando.

Incluir especialmente:
```
🔍 Rol extraído: [QUÉ VALOR]
🔍 ¿Es ADMIN? [true/false]
❌ FALLO: [POR QUÉ FALLÓ]
```
