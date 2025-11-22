# Implementación de Seguridad JWT - Guía de Uso

## Resumen de la Implementación

Se ha implementado una arquitectura completa de seguridad basada en **JWT (JSON Web Tokens)** para tu API REST de ZoneKids. El sistema está completamente integrado y listo para usar.

---

## 📁 Estructura de Archivos Creados

```
com.zonekids.springboot.api.zonekidsBackend/
├── dto/
│   ├── LoginRequestDto.java          # DTO para recibir credenciales
│   └── AuthResponseDto.java          # DTO para devolver token
├── security/
│   ├── JwtUtils.java                 # Utilidad para generar y validar tokens
│   ├── JwtAuthenticationFilter.java   # Filtro para interceptar peticiones
│   └── CustomUserDetailsService.java # Servicio para cargar usuarios de BD
├── config/
│   └── SecurityConfig.java           # Configuración de seguridad Spring
└── controllers/
    └── AuthController.java           # Controlador de autenticación (actualizado)
```

---

## 🔧 Cambios en Archivos Existentes

### 1. **pom.xml**
- ✅ Agregadas dependencias JWT (jjwt-api, jjwt-impl, jjwt-jackson v0.11.5)
- ✅ Agregado spring-boot-starter-security completo

### 2. **application.properties**
```properties
# Configuración JWT
jwt.secret=my-super-secret-key-for-jwt-encryption-base64-encoded-32-chars-minimum
jwt.expiration=86400000  # 24 horas en milisegundos
```

> **⚠️ IMPORTANTE**: Cambia `jwt.secret` por una clave más segura. Puedes generar una con:
> ```bash
> openssl rand -base64 32
> ```

### 3. **AuthController.java**
- ✅ Reemplazado método login para usar DTOs y JWT
- ✅ Integración con AuthenticationManager
- ✅ Método register mantiene compatibilidad

---

## 🚀 Flujo de Autenticación

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "123456"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwNjI4MDAwLCJleHAiOjE3MDA3MTQwMDB9.xxxxx",
  "mensaje": "Login exitoso"
}
```

### Usar el Token
Para acceder a rutas protegidas, incluye el header:
```
GET /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwNjI4MDAwLCJleHAiOjE3MDA3MTQwMDB9.xxxxx
```

### Registro (Público)
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "123456"
}

Response: 201 Created
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "cliente",
  "estado": "activo",
  "fechaCreacion": "2025-11-22T10:30:00"
}
```

---

## 🔐 Rutas Públicas vs Protegidas

### Públicas (sin token):
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /swagger-ui.html` - Documentación
- `GET /v3/api-docs/**` - OpenAPI docs

### Protegidas (requieren token JWT):
- `GET /api/productos` 
- `POST /api/productos`
- `PUT /api/productos/{id}`
- `DELETE /api/productos/{id}`
- `GET /api/users`
- Todas las demás rutas no especificadas como públicas

---

## 📋 Detalles Técnicos

### JwtUtils
Responsable de:
- **generateToken(email)** - Genera token JWT válido por 24 horas
- **validateToken(token)** - Valida que el token sea correcto y no haya expirado
- **getEmailFromToken(token)** - Extrae el email del token
- **extractClaim(token, claimsResolver)** - Extrae cualquier claim personalizado
- **getSigningKey()** - Genera la clave de firma HS256

### JwtAuthenticationFilter
Intercepta TODAS las peticiones HTTP:
1. Busca el header `Authorization: Bearer <token>`
2. Si existe y es válido, autentica al usuario
3. Si no existe, deja pasar la petición (las rutas públicas la permiten)
4. El SecurityConfig valida que la ruta requiera autenticación

### CustomUserDetailsService
Carga el usuario de la BD:
- Busca por email (campo único)
- Retorna UserDetails con:
  - Email
  - Contraseña (codificada en BD)
  - Rol como GrantedAuthority (`ROLE_cliente`, `ROLE_vendedor`, etc.)
  - Estado (solo usuarios "activos" pueden autenticarse)

### SecurityConfig
Configura:
- ✅ CSRF deshabilitado (JWT es stateless)
- ✅ Sesiones STATELESS
- ✅ Rutas públicas en `/api/auth/**`
- ✅ Resto de rutas requieren autenticación
- ✅ BCryptPasswordEncoder para las contraseñas
- ✅ Filtro JWT se ejecuta antes del filtro de autenticación por defecto

---

## 🛠️ Pasos Siguientes

### 1. **Generar Nueva Clave JWT Segura**
```bash
# En Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# O en Linux/Mac
openssl rand -base64 32
```
Reemplaza el valor de `jwt.secret` en `application.properties`.

### 2. **Compilar el Proyecto**
```bash
mvn clean package
```

### 3. **Probar en Postman**
1. **Login** (POST http://localhost:8080/api/auth/login)
   ```json
   {
     "email": "test@zonekids.com",
     "contrasena": "password123"
   }
   ```
2. Copiar el token de la respuesta
3. **Acceder a ruta protegida** (GET http://localhost:8080/api/productos)
   - Header: `Authorization: Bearer <token>`

---

## 🔍 Validaciones Realizadas

✅ Token válido y no expirado
✅ Usuario existe en la BD
✅ Usuario está activo
✅ Email y contraseña correctos
✅ GrantedAuthorities según rol

---

## ⚠️ Consideraciones de Seguridad

1. **Contraseña**: Siempre se codifica con BCrypt al registrar/actualizar
2. **Token**: Válido solo 24 horas (configurable en `jwt.expiration`)
3. **HTTPS**: En producción, usa siempre HTTPS para evitar interceptación
4. **Secreto**: Nunca commits la clave real a Git (usa variables de entorno)
5. **CORS**: Si necesitas CORS, agrégalo en SecurityConfig

---

## 📝 Variables de Entorno (Producción)

```properties
# application.properties
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

O en `application-prod.properties`:
```properties
jwt.secret=<clave-super-segura-generada>
jwt.expiration=86400000
```

---

## 🧪 Test Básico con cURL

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","contrasena":"123456"}'

# 2. Usar token (reemplaza TOKEN con el valor recibido)
curl -X GET http://localhost:8080/api/productos \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentación de Referencia

- [JJWT Library](https://github.com/jpadilla/pyjwt)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/) - Para decodificar y ver tokens
- [RFC 7519 JWT Standard](https://tools.ietf.org/html/rfc7519)

