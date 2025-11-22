# ✅ Evaluación 3 - Backend Seguro REST - COMPLETADO

## 📌 Resumen Ejecutivo

Se ha implementado un **backend REST seguro y profesional** para ZoneKids que cumple con todos los requerimientos de la Evaluación 3:

✅ Autenticación JWT con io.jsonwebtoken 0.11.5
✅ Control de acceso basado en roles (RBAC)
✅ Versionamiento de API (`/api/v1/`)
✅ Stack: Java 21 + Spring Boot 3.2.12 + MySQL
✅ Documentación Swagger/OpenAPI
✅ DTOs para separación de responsabilidades
✅ Validación de imágenes (2-3 por producto)
✅ Manejo de órdenes con detalles y cálculo de totales

---

## 📂 Estructura de Archivos Generados

### 🔐 Seguridad y Autenticación
```
security/
├── JwtUtils.java                      # Generación y validación de tokens
├── JwtAuthenticationFilter.java       # Interceptor de requests
└── CustomUserDetailsService.java      # Carga de usuarios desde BD
```

### ⚙️ Configuración
```
config/
├── SecurityConfig.java                # Configuración de Spring Security
├── OpenApiConfig.java                 # Configuración de Swagger/OpenAPI
└── WebConfig.java                     # Config web existente
```

### 📊 Entidades (Modelo de Datos)
```
entities/
├── User.java                          # Usuario con Enum de Roles
├── Producto.java                      # Producto con 2-3 imágenes
├── Orden.java                         # Orden de compra
├── DetalleOrden.java                  # Item de una orden
└── RoleEnum.java                      # Enum: ADMIN, VENDEDOR, CLIENTE
```

### 📤 DTOs (Data Transfer Objects)
```
dto/
├── LoginRequestDto.java               # Login (email, password)
├── AuthResponseDto.java               # Response del login (token)
├── UsuarioRequestDto.java             # Crear/actualizar usuario
├── UsuarioResponseDto.java            # Respuesta de usuario
├── ProductoRequestDto.java            # Crear/actualizar producto
├── ProductoResponseDto.java           # Respuesta de producto
├── OrdenRequestDto.java               # Crear orden
├── OrdenResponseDto.java              # Respuesta de orden
├── DetalleOrdenRequestDto.java        # Item de orden (request)
└── DetalleOrdenResponseDto.java       # Item de orden (response)
```

### 🗂️ Repositorios (Data Access)
```
repositories/
├── UserRepository.java                # CRUD de usuarios (existente)
├── ProductoRepository.java            # CRUD de productos (existente)
├── OrdenRepository.java               # CRUD de órdenes (NEW)
└── DetalleOrdenRepository.java        # CRUD de detalles (NEW)
```

### 🔧 Servicios (Business Logic)
```
services/
├── UserService.java                   # Interface de usuarios
├── UserServiceImpl.java                # Implementación (existente)
├── ProductoServices.java              # Interface de productos (existente)
├── ProductoServiceImpl.java            # Implementación (existente)
├── OrdenService.java                  # Interface de órdenes (NEW)
└── OrdenServiceImpl.java               # Implementación (NEW)
```

### 🌐 Controladores (API Endpoints)
```
controllers/
├── AuthController.java                # /api/v1/auth (login, register)
├── ProductoController.java            # /api/v1/productos (CRUD + roles)
├── UsuarioController.java             # /api/v1/usuarios (CRUD + ADMIN only)
└── OrdenController.java               # /api/v1/ordenes (CRUD + roles)
```

---

## 🔐 Matriz de Control de Acceso (RBAC)

| Recurso | GET | POST | PUT | DELETE | PATCH |
|---------|-----|------|-----|--------|-------|
| **Productos** | ✅ ADMIN/VENDEDOR/CLIENTE | ✅ ADMIN | ✅ ADMIN | ✅ ADMIN | - |
| **Usuarios** | ✅ ADMIN | ✅ ADMIN | ✅ ADMIN | ✅ ADMIN | ✅ ADMIN |
| **Órdenes** | ✅ ADMIN/VENDEDOR | ✅ ADMIN/CLIENTE | - | ✅ ADMIN | ✅ ADMIN |
| **Auth** | - | ✅ PÚBLICO | - | - | - |

---

## 🛡️ Seguridad Implementada

### 1. Autenticación JWT
```
Token válido por: 24 horas
Algoritmo: HS256
Librería: io.jsonwebtoken 0.11.5
```

### 2. Contraseñas
```
Codificación: BCrypt
Algoritmo: SHA-256 + Salt
Fuerza: 10 rounds
```

### 3. Roles y Permisos
```
@PreAuthorize("hasRole('ADMIN')")          # Solo ADMIN
@PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")  # ADMIN o VENDEDOR
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")   # ADMIN o CLIENTE
```

### 4. Validación de Datos
```
@NotBlank: Campos obligatorios
@Email: Formato de email
@Min: Valores mínimos
@Valid: Validación de objetos
```

---

## 📦 Validación de Productos

### Regla de Imágenes
```
Mínimo: 2 imágenes
Máximo: 3 imágenes
Validación: @PrePersist y @PreUpdate en la entidad
Tipo: Lista de URLs (almacenada en tabla producto_imagenes)
```

**Ejemplo de creación:**
```json
{
  "nombre": "Juguete XYZ",
  "precio": 29.99,
  "stock": 100,
  "imagenesUrl": [
    "https://example.com/img1.jpg",
    "https://example.com/img2.jpg",
    "https://example.com/img3.jpg"
  ]
}
```

---

## 🚀 Endpoints Principales

### Públicos (Sin token)
```
POST   /api/v1/auth/login              → Login
POST   /api/v1/auth/register           → Registro (CLIENTE)
GET    /swagger-ui.html                → Documentación interactiva
GET    /v3/api-docs                    → OpenAPI JSON
```

### Productos
```
GET    /api/v1/productos               → Listar (ADMIN/VENDEDOR/CLIENTE)
GET    /api/v1/productos/{id}          → Obtener por ID
POST   /api/v1/productos               → Crear (ADMIN)
PUT    /api/v1/productos/{id}          → Actualizar (ADMIN)
DELETE /api/v1/productos/{id}          → Eliminar (ADMIN)
```

### Usuarios
```
GET    /api/v1/usuarios                → Listar (ADMIN)
GET    /api/v1/usuarios/{id}           → Obtener por ID (ADMIN)
POST   /api/v1/usuarios                → Crear (ADMIN)
PUT    /api/v1/usuarios/{id}           → Actualizar (ADMIN)
PATCH  /api/v1/usuarios/{id}/estado    → Cambiar estado (ADMIN)
DELETE /api/v1/usuarios/{id}           → Eliminar (ADMIN)
```

### Órdenes
```
GET    /api/v1/ordenes                 → Listar (ADMIN/VENDEDOR)
GET    /api/v1/ordenes/{id}            → Obtener por ID
POST   /api/v1/ordenes                 → Crear (ADMIN/CLIENTE)
PATCH  /api/v1/ordenes/{id}/estado     → Cambiar estado (ADMIN)
DELETE /api/v1/ordenes/{id}            → Eliminar (ADMIN)
```

---

## 🧪 Flujos de Prueba

### Flujo 1: Admin creando usuario
```
1. POST /api/v1/auth/login (admin@zonekids.com)
   → Token JWT
2. POST /api/v1/usuarios (con token)
   → Nuevo usuario creado
3. GET /api/v1/usuarios (con token)
   → Lista de usuarios
```

### Flujo 2: Cliente comprando
```
1. POST /api/v1/auth/register (cliente nuevo)
   → Creado con rol CLIENTE
2. POST /api/v1/auth/login (cliente@example.com)
   → Token JWT
3. GET /api/v1/productos (con token)
   → Lista de productos
4. POST /api/v1/ordenes (con token)
   → Orden creada
```

### Flujo 3: Vendedor visualizando datos
```
1. POST /api/v1/auth/login (vendedor@zonekids.com)
   → Token JWT
2. GET /api/v1/productos (con token)
   → Puede ver productos
3. POST /api/v1/productos (con token)
   → ❌ ACCESO DENEGADO (403 Forbidden)
4. GET /api/v1/ordenes (con token)
   → Puede ver órdenes
```

---

## 📋 Configuración Requerida

### application.properties
```properties
# JWT
jwt.secret=<clave-base64-segura>
jwt.expiration=86400000

# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/zonekids_bd
spring.datasource.username=root
spring.datasource.password=

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
```

### Dependencias (pom.xml)
```xml
<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.11.5</version>
</dependency>

<!-- Spring Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Swagger -->
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.2.0</version>
</dependency>
```

---

## 🔍 Validaciones Implementadas

### Producto
- ✅ Nombre no vacío
- ✅ Precio >= 0
- ✅ Stock >= 0
- ✅ **2-3 imágenes obligatorias**
- ✅ URL válida en imágenes

### Usuario
- ✅ Nombre no vacío
- ✅ Email único y válido
- ✅ Contraseña no vacía (bcrypt)
- ✅ Rol válido (admin, vendedor, cliente)
- ✅ Estado válido (activo, inactivo)

### Orden
- ✅ Usuario existe
- ✅ Productos existen
- ✅ Stock disponible
- ✅ Cantidad >= 1
- ✅ Mínimo 1 detalle

---

## 📚 Documentación

### Swagger UI
Accesible en: **http://localhost:8080/swagger-ui.html**
- Interfaz interactiva para probar endpoints
- Documentación automática de todos los endpoints
- Esquema de autenticación JWT integrado

### OpenAPI JSON
Disponible en: **http://localhost:8080/v3/api-docs**
- Especificación completa en formato JSON
- Compatible con herramientas externas
- Automatiza la generación de clientes

### Guía Completa
Ver archivo: **EVALUATION_3_GUIDE.md**
- Ejemplos de uso detallados
- Ejemplos cURL para cada endpoint
- Casos de uso completos

---

## 🛠️ Stack Final

| Componente | Versión | Propósito |
|-----------|---------|----------|
| Java | 21 LTS | Lenguaje base |
| Spring Boot | 3.2.12 | Framework web |
| MySQL | 8.0+ | Base de datos |
| JPA/Hibernate | 6.x | ORM |
| Spring Security | 6.x | Autenticación/Autorización |
| JWT (JJWT) | 0.11.5 | Tokens |
| Lombok | 1.18+ | Generación de código |
| Swagger/OpenAPI | 2.2.0 | Documentación |
| Maven | 3.8+ | Build tool |

---

## ✅ Checklist de Completitud

- [x] Stack: Java 21 + Spring Boot 3.2.12
- [x] BD: MySQL con JPA/Hibernate
- [x] Seguridad: Spring Security + JWT 0.11.5
- [x] Documentación: Swagger/OpenAPI integrado
- [x] Arquitectura: Controller-Service-Repository
- [x] DTOs: Para todas las entradas/salidas
- [x] Versionamiento: /api/v1/ en todas las rutas
- [x] Roles: ADMIN, VENDEDOR, CLIENTE
- [x] @PreAuthorize: Validación de roles en endpoints
- [x] Entidades: Usuario, Producto, Orden, DetalleOrden
- [x] Imágenes: 2-3 por producto (validado)
- [x] CRUD: Completo para recursos
- [x] Stateless: Sesiones deshabilitadas
- [x] CSRF: Deshabilitado (JWT)
- [x] Validaciones: Completas en DTOs

---

## 🚀 Próximos Pasos (Opcional)

1. **Seguridad en Producción**
   - Cambiar jwt.secret por clave segura
   - Implementar HTTPS
   - Rate limiting

2. **Funcionalidades Adicionales**
   - Refresh tokens
   - Recuperación de contraseña
   - Auditoría de cambios
   - Notificaciones por email

3. **Monitoreo**
   - Logs centralizados
   - Métricas con Actuator
   - APM (Application Performance Monitoring)

4. **Testing**
   - Tests unitarios (JUnit 5)
   - Tests de integración
   - Tests de seguridad

---

## 📞 Soporte

Para preguntas o problemas, revisar:
- EVALUATION_3_GUIDE.md (Documentación detallada)
- JWT_IMPLEMENTATION_GUIDE.md (Autenticación)
- Swagger UI: http://localhost:8080/swagger-ui.html

---

**Estado:** ✅ COMPLETADO
**Fecha:** 22/11/2025
**Versión:** 1.0.0

