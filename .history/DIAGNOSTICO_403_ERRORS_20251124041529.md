# 🔍 Guía de Diagnóstico - Errores 403 Forbidden

## Problema Actual
Los usuarios admin están recibiendo errores **403 Forbidden** al intentar acceder a:
- `/api/v1/usuarios` (AdminUsers)
- `/api/v1/ordenes` (AdminDashboard)

Aunque el token JWT está siendo enviado correctamente.

## Causas Posibles

### 1. **Rol del usuario no es "ADMIN"**
- El backend espera `rol: "ADMIN"` pero el usuario tiene otro valor
- Valores posibles: "admin" (minúsculas), "Admin", "ADMINISTRADOR", etc.

### 2. **Token no contiene información de rol**
- El token JWT no incluye el campo `rol`
- El backend no puede validar permisos sin esta información

### 3. **Backend está verificando un campo diferente**
- El backend podría estar buscando `role` en lugar de `rol`
- O verificando en un campo diferente del token

### 4. **Problema de configuración de CORS**
- Las credenciales no se envían correctamente
- Token es recibido pero rechazado por validación

---

## ✅ Pasos de Diagnóstico

### Paso 1: Abre la Página Admin
1. Inicia sesión con una cuenta admin
2. Ve a `/admin/dashboard` o `/admin/users`
3. Abre la Consola del Navegador (F12 o Ctrl+Shift+I)

### Paso 2: Usa el Botón de Diagnóstico
1. En la esquina inferior derecha verás un botón "🔍 Diagnóstico"
2. Haz clic para expandirlo
3. Verás:
   - **Token**: ✅ Presente o ❌ No presente
   - **Email**: El email del usuario logueado
   - **Rol**: El valor del rol (ej: "ADMIN", "admin", etc.)
   - **ID**: El ID del usuario

### Paso 3: Abre la Consola del Navegador (F12)
Busca líneas como estas:

```
🔐 Request: http://localhost:8080/api/v1/usuarios | Token: true | Rol: ADMIN | Email: admin@example.com
```

Si ves estas líneas, el token SE ESTÁ ENVIANDO correctamente.

### Paso 4: Busca Errores 403
Busca líneas rojas como:

```
❌ Error 403 - Acceso denegado
URL: http://localhost:8080/api/v1/usuarios
Token presente: true
Rol del usuario: ADMIN
```

### Paso 5: Verifica la Estructura del Token
1. Ve a https://jwt.io/
2. En el área de "Encoded", pega el token completo
3. En el lado derecho (Decoded), busca el campo `rol`
4. Verifica qué valor tiene exactamente

---

## 📋 Información a Recopilar

Cuando se encuentre el problema, el usuario debe proporcionar:

```
TOKEN INFORMATION:
- Token presente: [SÍ/NO]
- Largo del token: [NÚMERO] caracteres

USER INFORMATION:
- Email: [EMAIL]
- Rol en localStorage: [VALOR DEL ROL]
- ID del usuario: [ID]

ENDPOINT ATTEMPTS:
- URL que falla: [URL]
- Método HTTP: [GET/POST/PATCH/DELETE]
- Status HTTP: [403/401/500/etc]

DECODED TOKEN PAYLOAD:
- Campo "rol": [VALOR]
- Otros campos relevantes: [LISTAR]
```

---

## 🔧 Soluciones Posibles

### Si el Rol está en minúsculas ("admin")
**Frontend:**
```javascript
// En AuthContext.jsx - actualizar isAdmin()
const isAdmin = () => {
  return hasRole(['ADMIN', 'admin', 'Admin']);
};
```

**O Backend:**
```java
// En el controller - hacer case-insensitive
if (userRole.equalsIgnoreCase("ADMIN")) { ... }
```

### Si el Token no tiene el Rol
**Backend:**
Asegurar que al generar el JWT, se incluya el rol:
```java
claims.put("rol", usuario.getRol());
```

### Si el Backend verifica un Campo Diferente
**Backend:**
Verificar qué campo está siendo revisado:
```java
// Podría ser "role" en lugar de "rol"
String role = token.getClaim("role").asString();
```

---

## 🚀 Próximos Pasos

1. **Ejecutar diagnóstico** siguiendo los pasos arriba
2. **Copiar información** del componente de diagnóstico
3. **Verificar el token** en jwt.io
4. **Reportar hallazgos** con:
   - Valor exacto del rol
   - Contenido del token decodificado
   - URL exacta que falla
   - Código de error HTTP completo

5. **Solución**:
   - Si es problema frontend: actualizar validación de rol
   - Si es problema backend: ajustar generación/validación de JWT

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: No comparta tokens reales en público
- Los tokens en jwt.io son decodificados pero el servidor nunca verá el payload
- Siempre use el botón "🗑️ Limpiar" cuando termine de diagnosticar
- Los tokens caducan automáticamente (verificar tiempo de expiración)

---

## 💡 Trucos de Consola

En la consola del navegador, puedes ejecutar:

```javascript
// Ver token completo
console.log(localStorage.getItem('authToken'))

// Ver datos del usuario
console.log(JSON.parse(localStorage.getItem('authUser')))

// Obtener solo el rol
console.log(JSON.parse(localStorage.getItem('authUser')).rol)

// Decodificar token manualmente
const token = localStorage.getItem('authToken')
const payload = token.split('.')[1]
console.log(JSON.parse(atob(payload)))
```

---

## 📞 Si Sigue Sin Funcionar

Revisar que:
1. ✅ El usuario tiene rol "ADMIN" en la base de datos
2. ✅ El endpoint `/api/v1/usuarios` existe en el backend
3. ✅ El backend espera el header `Authorization: Bearer <token>`
4. ✅ El backend está ejecutándose y es accesible
5. ✅ No hay conflicto de CORS que bloquee las credenciales
6. ✅ El token no ha expirado (verificar `exp` en jwt.io)
