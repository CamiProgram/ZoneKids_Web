---
# ZoneKids_Web_React

Sitio web para proyecto semestral sobre un reciente emprendimiento de una tienda virtual llamada "ZoneKids"

---

**Integrantes ( + Gestionamiento )**

* Camilo Tapia (Gestionamiento, Desarrollo Backend y Frontend)
* Danae Collao (Gestionamiento, Desarrollo Frontend, Backend)

---

**Tecnologias Utilizadas**

![React](https://skillicons.dev/icons?i=react)
![Bootstrap](https://skillicons.dev/icons?i=bootstrap)
![Spring Boot](https://skillicons.dev/icons?i=spring)
![VS Code](https://skillicons.dev/icons?i=vscode)
![Vite](https://skillicons.dev/icons?i=vite)
![MySQL](https://skillicons.dev/icons?i=mysql)
![PHP (XAMPP)](https://skillicons.dev/icons?i=php)



---

# Estructuras

Este apartado se enfoca principalmente en el ambito de visualizar en manera no literal las estructuras Front-End y Back-End.

---

**Front-End (React + Vite)**

📁 src/
│
├── 📄 App.jsx
├── 📄 main.jsx
├── 📄 App.css               (Estilos muy generales de la App)
├── 📄 index.css             (Estilos globales: body, reset, fuentes)
│
├── 📁 assets/               (Imágenes, logos, etc.)
│   └── 📄 logo.png
│
├── 📁 components/           (Bloques de UI reusables - Solo Lógica)
│   ├── 📄 AdminSidebar.jsx
│   ├── 📄 CartModal.jsx
│   ├── 📄 Footer.jsx
│   ├── 📄 Navbar.jsx
│   ├── 📄 ProductCard.jsx
│   └── 📄 ProtectedRoute.jsx
│
├── 📁 context/              (Manejo de estado global)
│   ├── 📄 AuthContext.jsx
│   └── 📄 CartContext.jsx
│
├── 📁 layout/               (Plantillas para las páginas - Solo Lógica)
│   ├── 📄 AdminLayout.jsx
│   └── 📄 PublicLayout.jsx
│
├── 📁 pages/                (Las vistas/páginas completas - Solo Lógica)
│   ├── 📁 admin/
│   │   ├── 📄 AdminDashboard.jsx
│   │   ├── 📄 AdminProducts.jsx
│   │   └── 📄 AdminUsers.jsx
│   │
│   └── 📁 user/
│       ├── 📄 HomePage.jsx
│       ├── 📄 LoginPage.jsx
│       ├── 📄 RegisterPage.jsx
│       ├── 📄 CheckoutPage.jsx
│       ├── 📄 ProductDetailPage.jsx
│       ├── 📄 CategoryPage.jsx
│       └── 📄 SearchPage.jsx
│
└── 📁 styles/               (¡Aquí van todos los CSS!)
    │
    ├── 📁 components/         (Estilos para cada componente)
    │   ├── 📄 adminSidebar.css
    │   ├── 📄 cartModal.css
    │   ├── 📄 footer.css
    │   ├── 📄 navbar.css
    │   └── 📄 productCard.css
    │
    ├── 📁 layout/
    │   ├── 📄 adminLayout.css
    │   └── 📄 publicLayout.css
    │
    └── 📁 pages/              (Estilos para cada página)
        ├── 📄 adminDashboard.css
        ├── 📄 adminProducts.css
        ├── 📄 adminUsers.css
        │
        ├── 📄 homePage.css
        ├── 📄 loginPage.css
        ├── 📄 registerPage.css
        ├── 📄 checkoutPage.css
        ├── 📄 productDetailPage.css
        ├── 📄 categoryPage.css
        └── 📄 searchPage.css

---

**Back-End (SpringBoot + Mockito(Testing))**


---

═══════════════════════════════════════════════════════════════════════════════
                    ZONEKIDS BACKEND - ESTRUCTURA COMPLETA
═══════════════════════════════════════════════════════════════════════════════

📋 INFORMACIÓN GENERAL:
- Nombre: ZoneKids Backend API v1.0.0
- Framework: Spring Boot 3.2.12
- Java: 21
- Build Tool: Maven 3.9.6
- Base de Datos: MySQL
- Seguridad: JWT + Spring Security
- Autenticación: JWT (JSON Web Token) con JJWT 0.11.5
- Documentación: Swagger/OpenAPI 3.0

═══════════════════════════════════════════════════════════════════════════════
                              ESTRUCTURA DEL PROYECTO
═══════════════════════════════════════════════════════════════════════════════

zonekidsBackend/
│
├── pom.xml (Configuración de Maven)
├── mvnw / mvnw.cmd (Maven Wrapper)
│
├── src/
│   ├── main/
│   │   ├── java/com/zonekids/springboot/api/zonekidsBackend/
│   │   │   ├── FullrestApplication.java (Clase principal)
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java (Configuración de seguridad y rutas)
│   │   │   │   ├── OpenApiConfig.java (Configuración Swagger/OpenAPI)
│   │   │   │   └── AdminUserConfig.java (Deshabilitado - solo configuración)
│   │   │   │
│   │   │   ├── entities/ (Modelos JPA)
│   │   │   │   ├── User.java (Usuario - tabla "usuarios")
│   │   │   │   ├── Producto.java (Producto - tabla "productos")
│   │   │   │   ├── Orden.java (Orden de compra)
│   │   │   │   └── DetalleOrden.java (Detalles de la orden)
│   │   │   │
│   │   │   ├── enums/
│   │   │   │   └── RoleEnum.java (Roles: ADMIN, VENDEDOR, CLIENTE)
│   │   │   │
│   │   │   ├── dto/ (Data Transfer Objects)
│   │   │   │   ├── LoginRequestDto.java
│   │   │   │   ├── AuthResponseDto.java
│   │   │   │   ├── UsuarioRequestDto.java
│   │   │   │   ├── UsuarioResponseDto.java
│   │   │   │   ├── ProductoRequestDto.java
│   │   │   │   ├── ProductoResponseDto.java
│   │   │   │   ├── OrdenRequestDto.java
│   │   │   │   ├── OrdenResponseDto.java
│   │   │   │   ├── DetalleOrdenRequestDto.java
│   │   │   │   └── DetalleOrdenResponseDto.java
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.java (Login, Registro)
│   │   │   │   ├── ProductoController.java (CRUD Productos)
│   │   │   │   └── UserController.java (Gestión de usuarios)
│   │   │   │
│   │   │   ├── repositories/ (JPA Repository Interfaces)
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ProductoRepository.java
│   │   │   │   ├── OrdenRepository.java
│   │   │   │   └── DetalleOrdenRepository.java
│   │   │   │
│   │   │   ├── services/ (Lógica de negocio)
│   │   │   │   ├── UserService.java (Interface)
│   │   │   │   ├── UserServiceImpl.java (Implementación)
│   │   │   │   ├── ProductoServices.java (Interface)
│   │   │   │   ├── ProductoServiceImpl.java (Implementación)
│   │   │   │   ├── StorageService.java (Almacenamiento de archivos)
│   │   │   │   └── FileSystemStorageService.java (Implementación de almacenamiento)
│   │   │   │
│   │   │   └── security/
│   │   │       ├── JwtUtils.java (Generación y validación de JWT)
│   │   │       ├── JwtAuthenticationFilter.java (Filtro de autenticación)
│   │   │       └── CustomUserDetailsService.java (Carga de detalles de usuario)
│   │   │
│   │   └── resources/
│   │       ├── application.properties (Configuración de la aplicación)
│   │       └── templates/
│   │           └── productos.html (Página HTML de productos)
│   │
│   └── test/
│       └── java/com/zonekids/springboot/api/zonekidsBackend/
│           ├── services/
│           │   ├── UserServiceTest.java
│           │   └── ProductServiceTest.java
│           └── FullrestApplicationTests.java

═══════════════════════════════════════════════════════════════════════════════
                            DEPENDENCIAS (pom.xml)
═══════════════════════════════════════════════════════════════════════════════

Spring Boot:
- spring-boot-starter-data-jpa (JPA/Hibernate)
- spring-boot-starter-web (REST API)
- spring-boot-starter-security (Spring Security)
- spring-boot-starter-validation (Validación Bean)
- spring-boot-devtools (Desarrollo automático)

Base de Datos:
- mysql-connector-j (Driver MySQL)

JWT:
- jjwt-api 0.11.5
- jjwt-impl 0.11.5
- jjwt-jackson 0.11.5

Documentación:
- springdoc-openapi-starter-webmvc-ui 2.2.0 (Swagger/OpenAPI)

Otros:
- lombok 1.18.30 (Generador de getters/setters)
- spring-session-jdbc (Sesiones persistentes - deshabilitado)

Testing:
- spring-boot-starter-test
- mockito-core
- mockito-junit-jupiter

═══════════════════════════════════════════════════════════════════════════════
                        CONFIGURACIÓN (application.properties)
═══════════════════════════════════════════════════════════════════════════════

# Puerto de la Aplicación
server.port=8080

# Base de Datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/zonekids_bd?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Swagger/OpenAPI
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.api-docs.path=/v3/api-docs

# JWT
jwt.secret=my-super-secret-key-for-jwt-encryption-base64-encoded-32-chars-minimum
jwt.expiration=86400000 (24 horas)

# Carga de archivos
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB

═══════════════════════════════════════════════════════════════════════════════
                        ENTIDADES (MODELO DE DATOS)
═══════════════════════════════════════════════════════════════════════════════

1. USER (Tabla: usuarios)
   - id (Long, PK, Auto-increment)
   - nombre (String, NOT NULL)
   - email (String, UNIQUE, NOT NULL)
   - contrasena (String, NOT NULL, codificada con BCrypt)
   - rol (Enum: ADMIN, VENDEDOR, CLIENTE)
   - estado (String: "activo", "inactivo")
   - fechaCreacion (LocalDateTime, NOT NULL, auto)
   - fechaActualizacion (LocalDateTime, nullable, auto)

2. PRODUCTO (Tabla: productos)
   - id (Long, PK, Auto-increment)
   - nombre (String, NOT NULL)
   - descripcion (String)
   - precio (Double, NOT NULL)
   - stock (Integer, NOT NULL)
   - categoria (String)
   - imagenesUrl (List<String>, 2-3 imágenes, @ElementCollection)
   - estado (String: "activo", "inactivo")
   - fechaCreacion (LocalDateTime, NOT NULL, auto)
   - fechaActualizacion (LocalDateTime, NOT NULL, auto)
   - precioOriginal (Double)
   - esNuevo (Boolean, default: false)
   - enOferta (Boolean, default: false)

3. ORDEN (Tabla: ordenes)
   - id (Long, PK, Auto-increment)
   - usuarioId (Long, FK → usuarios)
   - total (Double)
   - estado (String)
   - fechaCreacion (LocalDateTime)
   - fechaActualizacion (LocalDateTime)

4. DETALLE_ORDEN (Tabla: detalle_ordenes)
   - id (Long, PK, Auto-increment)
   - ordenId (Long, FK → ordenes)
   - productoId (Long, FK → productos)
   - cantidad (Integer)
   - precio (Double)

═══════════════════════════════════════════════════════════════════════════════
                            ROLES Y PERMISOS (RBAC)
═══════════════════════════════════════════════════════════════════════════════

ADMIN:
- Crear, leer, actualizar, eliminar productos
- Gestionar usuarios
- Ver reportes
- Acceso a todos los endpoints protegidos

VENDEDOR:
- Solo lectura de productos
- Acceso limitado a funciones específicas

CLIENTE:
- Solo lectura de productos
- Ver su perfil
- Realizar compras

═══════════════════════════════════════════════════════════════════════════════
                        AUTENTICACIÓN Y AUTORIZACIÓN
═══════════════════════════════════════════════════════════════════════════════

1. SEGURIDAD (SecurityConfig.java):
   - CSRF deshabilitado (No necesario con JWT)
   - Rutas públicas: /api/v1/auth/**, /swagger-ui.html, /v3/api-docs/**
   - Rutas protegidas: Requieren autenticación JWT
   - SessionCreationPolicy: STATELESS (Sin sesiones HTTP)
   - Filtro JWT: Se ejecuta antes del filtro de autenticación por defecto

2. JWT (JwtUtils.java):
   - Generación: Genera token con email como subject
   - Validación: Valida firma y expiración
   - Extracción: Extrae claims del token
   - Algoritmo: HS256 (HMAC con SHA-256)
   - Expiración: 24 horas

3. FILTRO JWT (JwtAuthenticationFilter.java):
   - Intercepta todas las peticiones
   - Extrae el token del header "Authorization: Bearer <token>"
   - Valida el token
   - Carga los detalles del usuario desde la BD
   - Establece el contexto de seguridad

═══════════════════════════════════════════════════════════════════════════════
                          ENDPOINTS PRINCIPALES
═══════════════════════════════════════════════════════════════════════════════

AUTENTICACIÓN:
POST   /api/v1/auth/login      - Login y obtener JWT
POST   /api/v1/auth/register   - Registrar nuevo usuario

PRODUCTOS (Requiere JWT):
GET    /api/v1/productos        - Listar todos
GET    /api/v1/productos/{id}   - Obtener por ID
POST   /api/v1/productos        - Crear (Solo ADMIN)
PUT    /api/v1/productos/{id}   - Actualizar (Solo ADMIN)
DELETE /api/v1/productos/{id}   - Eliminar (Solo ADMIN)

USUARIOS (Requiere JWT):
GET    /api/v1/usuarios         - Listar usuarios
GET    /api/v1/usuarios/{id}    - Obtener usuario por ID
PUT    /api/v1/usuarios/{id}    - Actualizar usuario
DELETE /api/v1/usuarios/{id}    - Eliminar usuario

DOCUMENTACIÓN:
GET    /swagger-ui.html         - Interfaz Swagger
GET    /v3/api-docs             - Especificación OpenAPI JSON

═══════════════════════════════════════════════════════════════════════════════
                            FLUJO DE AUTENTICACIÓN
═══════════════════════════════════════════════════════════════════════════════

1. Cliente envía credenciales a /api/v1/auth/login
2. AuthController valida con AuthenticationManager
3. Si válido, JwtUtils genera un JWT token
4. Cliente recibe el token en AuthResponseDto
5. Cliente envía token en header: Authorization: Bearer <token>
6. JwtAuthenticationFilter intercepta la petición
7. Valida el token y extrae el email
8. CustomUserDetailsService carga los detalles del usuario
9. Establece el contexto de seguridad
10. Petición continúa con permisos válidos

═══════════════════════════════════════════════════════════════════════════════
                        CONVERSIÓN DE ENTIDADES A DTO
═══════════════════════════════════════════════════════════════════════════════

Los DTOs separan la representación interna de la API externa:

Request DTO: Recibe datos del cliente (validación + transformación)
Response DTO: Envía datos al cliente (sin datos sensibles)

Ejemplo Producto:
- ProductoRequestDto: Recibe nombre, descripción, precio, stock, imágenes
- ProductoResponseDto: Devuelve todo + metadata (fechas, estado)
- Conversión manual en controllers

═══════════════════════════════════════════════════════════════════════════════
                          CARACTERÍSTICAS PRINCIPALES
═══════════════════════════════════════════════════════════════════════════════

✓ Autenticación JWT con Spring Security
✓ Control de Acceso Basado en Roles (RBAC)
✓ Validación de datos con Bean Validation
✓ Documentación automática con Swagger/OpenAPI
✓ Gestión de transacciones con JPA/Hibernate
✓ Manejo de errores centralizado
✓ Logging automático de SQL
✓ Hot-reload con DevTools
✓ Almacenamiento de archivos en el sistema de archivos
✓ Timestamps automáticos (creación/actualización)
✓ Encriptación de contraseñas con BCrypt
✓ Validación de imágenes (2-3 por producto)

═══════════════════════════════════════════════════════════════════════════════
                        FLUJO DE CREACIÓN DE PRODUCTO
═══════════════════════════════════════════════════════════════════════════════

1. Cliente (ADMIN) POST /api/v1/productos con ProductoRequestDto
2. SecurityConfig valida JWT
3. ProductoController recibe petición
4. @PreAuthorize valida que sea ADMIN
5. Valida que tenga 2-3 imágenes
6. Crea entidad Producto
7. Llama a productoServices.saveProduct()
8. ProductoServices valida y guarda en BD
9. Retorna ProductoResponseDto con id, fechas, estado
10. Cliente recibe HTTP 201 CREATED

═══════════════════════════════════════════════════════════════════════════════
                        CAMBIOS REALIZADOS EN STARTUP
═══════════════════════════════════════════════════════════════════════════════

1. User.java
   - fechaActualizacion: nullable = true (era false, causaba error MySQL)

2. application.properties
   - spring.jpa.hibernate.ddl-auto: validate (era update)
   - Spring Session: Comentado (no se usa con JWT)

3. AdminUserConfig.java
   - Deshabilitado CommandLineRunner (evita errores de enum)

═══════════════════════════════════════════════════════════════════════════════
                          ACCESO A LA APLICACIÓN
═══════════════════════════════════════════════════════════════════════════════

API REST:          http://localhost:8080
Swagger UI:        http://localhost:8080/swagger-ui.html
OpenAPI JSON:      http://localhost:8080/v3/api-docs

Credenciales de ejemplo:
- Email: camilotapia828@gmail.com
- Rol: ADMIN
- Contraseña: admin123 (hash: BCrypt)

═══════════════════════════════════════════════════════════════════════════════

