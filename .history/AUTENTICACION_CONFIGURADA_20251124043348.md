# 🔐 Autenticación Configurada - Register & Login

## 📋 Endpoints Backend

```
POST /api/v1/auth/register
- Recibe: { nombre, email, contrasena }
- Procesa: BCrypt codificación de contraseña
- Retorna: { id, email, nombre, rol: "CLIENTE" }
- Nota: El usuario se crea automáticamente con rol CLIENTE

POST /api/v1/auth/login
- Recibe: { email, contrasena }
- Procesa: Validación con BCrypt
- Retorna: { id, email, nombre, rol, token }
- Nota: El JWT incluye el rol del usuario
```

---

## 💻 Cambios Implementados

### **1. authService.js**

#### Método: `register(nombre, email, contrasena)`
```javascript
// ✅ CORRECTO - USA ENDPOINT /auth/register
register: async (nombre, email, contrasena) => {
  try {
    console.log('🔐 Registro: POST /auth/register');
    console.log('👤 Datos:', { nombre, email });
    
    const response = await api.post('/auth/register', {
      nombre,
      email,
      contrasena,
    });
    
    console.log('✅ Registro exitoso');
    console.log('📋 Usuario creado:', response.data.data);
    
    // Backend codifica la contraseña con BCrypt
    // Usuario se crea automáticamente con rol CLIENTE
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en register:', error);
    throw error.response?.data || error.message;
  }
}
```

**Cambios:**
- ✅ Endpoint correcto: `/auth/register` (NO `/auth/registrarse`)
- ✅ NO enviar rol (backend usa CLIENTE automático)
- ✅ Logging detallado con emojis
- ✅ Captura errores del backend

#### Método: `login(email, contrasena)`
```javascript
// ✅ CORRECTO - USA ENDPOINT /auth/login
login: async (email, contrasena) => {
  try {
    console.log('🔐 Login: POST /auth/login');
    console.log('📧 Email:', email);
    
    const response = await api.post('/auth/login', { email, contrasena });
    
    console.log('✅ Login exitoso');
    
    const userData = response.data.data;
    
    console.log('👤 Usuario autenticado:', {
      email: userData.email,
      rol: userData.rol,
      nombre: userData.nombre
    });
    
    // Almacenar token y usuario
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      console.log('💾 Token y usuario guardados en localStorage');
    }
    
    return userData;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error.response?.data || error.message;
  }
}
```

**Cambios:**
- ✅ Endpoint correcto: `/auth/login`
- ✅ Backend compara contraseña con BCrypt
- ✅ JWT retornado incluye rol
- ✅ Logging detallado
- ✅ Almacenamiento seguro en localStorage

---

### **2. RegisterPage.jsx**

**Flujo:**
```
1. Usuario ingresa: nombre, email, contraseña
2. Validaciones de cliente (email válido, contraseña >= 8 caracteres)
3. POST /auth/register
4. Backend:
   - Codifica contraseña con BCrypt
   - Crea usuario con rol CLIENTE
   - Retorna datos del usuario
5. Frontend: Redirige a /login
6. Usuario inicia sesión manualmente
```

**Cambios:**
- ✅ Logging detallado de intento de registro
- ✅ NO enviar rol (se asigna automáticamente en backend)
- ✅ Mejor manejo de errores
- ✅ Redirección a login después del registro exitoso

**Validaciones Frontend:**
```javascript
- Nombre: obligatorio
- Email: obligatorio, formato válido (regex)
- Contraseña: obligatoria, mínimo 8 caracteres
```

**Errores posibles:**
```
- Email ya registrado (400)
- Email inválido (400)
- Contraseña muy corta (400)
- Error del servidor (500)
```

---

### **3. LoginPage.jsx**

**Flujo:**
```
1. Usuario ingresa: email, contraseña
2. Validaciones de cliente (email válido, contraseña no vacía)
3. POST /auth/login
4. Backend:
   - Busca usuario por email
   - Compara contraseña con BCrypt
   - Genera JWT con rol incluido
   - Retorna { id, email, nombre, rol, token }
5. Frontend:
   - Guarda token en localStorage
   - Redirige según rol:
     * ADMIN → /admin/dashboard
     * VENDEDOR → /
     * CLIENTE → /
```

**Cambios:**
- ✅ Logging detallado del proceso
- ✅ Logging del rol detectado
- ✅ Mejor redirección según rol
- ✅ Mejor manejo de errores

**Validaciones Frontend:**
```javascript
- Email: obligatorio, formato válido
- Contraseña: obligatoria
```

**Errores posibles:**
```
- Email no existe (401)
- Contraseña incorrecta (401)
- Cuenta deshabilitada (403)
- Error del servidor (500)
```

---

### **4. AuthContext.jsx**

**Cambios:**
- ✅ Logging del proceso de login
- ✅ Verificación de cuenta deshabilitada
- ✅ Actualización de estado de usuario
- ✅ Mejor propagación de errores

**Métodos disponibles:**
```javascript
const { user, login, logout, hasRole, isAdmin, isAuthenticated } = useAuth();

// login(email, contrasena) - Autentica usuario
// logout() - Cierra sesión
// hasRole(rol) - Verifica si usuario tiene rol
// isAdmin() - Verifica si es ADMIN
// isAuthenticated - Boolean
```

---

## 🔄 Flujo Completo

### **REGISTRO**
```
┌─────────────────────────────────────────────────────────┐
│                    REGISTRO (RegisterPage)              │
└─────────────────────────────────────────────────────────┘
                         ↓
            Usuario ingresa: nombre, email, password
                         ↓
            Frontend validaciones (email, contraseña)
                         ↓
        POST /api/v1/auth/register
        { nombre, email, contrasena }
                         ↓
         Backend (Spring Security + BCrypt)
         • Codifica contraseña con BCrypt
         • Crea usuario con rol CLIENTE
         • Guarda en base de datos
                         ↓
        Response: { id, email, nombre, rol: "CLIENTE" }
                         ↓
        ✅ Redirección a /login
                         ↓
        Usuario inicia sesión manualmente
```

### **LOGIN**
```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN (LoginPage)                    │
└─────────────────────────────────────────────────────────┘
                         ↓
            Usuario ingresa: email, password
                         ↓
            Frontend validaciones (email, contraseña)
                         ↓
        POST /api/v1/auth/login
        { email, contrasena }
                         ↓
         Backend (Spring Security + BCrypt)
         • Busca usuario por email
         • Compara contraseña codificada con BCrypt
         • Valida cuenta no deshabilitada
         • Genera JWT con rol incluido
                         ↓
   Response: { id, email, nombre, rol, token }
                         ↓
   Frontend:
   • localStorage.setItem('authToken', token)
   • localStorage.setItem('authUser', {...})
                         ↓
         ┌──────────────┴──────────────┐
         │                             │
        ADMIN                    CLIENTE/VENDEDOR
         │                             │
         ↓                             ↓
   /admin/dashboard                   /
```

---

## 📊 Estructura de Datos

### **Usuario Registrado (Respuesta POST /register)**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "estado": "activo"
}
```

### **Usuario Autenticado (Respuesta POST /login)**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "estado": "activo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **JWT Token Payload (decodificado)**
```json
{
  "sub": "juan@example.com",
  "email": "juan@example.com",
  "rol": "CLIENTE",
  "iat": 1732364445,
  "exp": 1732451045
}
```

---

## 🔐 Seguridad

### **Backend:**
- ✅ BCrypt para codificación de contraseñas
- ✅ JWT para autenticación stateless
- ✅ Rol incluido en JWT (validado por Spring Security)
- ✅ Contraseña jamás se retorna

### **Frontend:**
- ✅ Token almacenado en localStorage
- ✅ Token enviado en header `Authorization: Bearer <token>`
- ✅ Validación de rol antes de mostrar rutas admin
- ✅ Logout limpia localStorage

---

## 🎯 Validaciones

### **Registro - Backend espera:**
```json
{
  "nombre": "string (obligatorio, 2-100 caracteres)",
  "email": "string (obligatorio, válido, único)",
  "contrasena": "string (obligatorio, mínimo 8 caracteres)"
}
```

### **Login - Backend espera:**
```json
{
  "email": "string (obligatorio)",
  "contrasena": "string (obligatorio)"
}
```

---

## 📝 Logging - Consola del Navegador

### **Registro Exitoso:**
```
🔐 Registro: POST /auth/register
👤 Datos: { nombre: "Juan", email: "juan@example.com" }
✅ Registro exitoso
📋 Usuario creado: { id: 1, nombre: "Juan", email: "juan@example.com", rol: "CLIENTE" }
✅ Redirigiendo a /login
```

### **Login Exitoso:**
```
🔐 Iniciando login...
📧 Email: juan@example.com
🔐 Login: POST /auth/login
✅ Login exitoso
👤 Usuario: { email: "juan@example.com", rol: "CLIENTE", nombre: "Juan" }
🎯 Rol detected: CLIENTE
💾 Token y usuario guardados en localStorage
➡️ Redirigiendo a /
```

### **Error - Email no existe:**
```
❌ Error en login: { message: "Email no encontrado" }
📋 Mensaje de error: Email no encontrado
```

### **Error - Contraseña incorrecta:**
```
❌ Error en login: { message: "Contraseña incorrecta" }
📋 Mensaje de error: Contraseña incorrecta
```

---

## ✅ Checklist de Verificación

- [x] Endpoint `/auth/register` correcto
- [x] Endpoint `/auth/login` correcto
- [x] NO enviar rol en registro (backend asigna CLIENTE)
- [x] BCrypt codificación en backend
- [x] JWT incluye rol
- [x] Token almacenado en localStorage
- [x] Logging detallado en consola
- [x] Redirección según rol (ADMIN → /admin/dashboard)
- [x] Manejo de errores mejorado
- [x] Validaciones de cliente

---

## 🚀 Próximos Pasos

1. **Pruebas en navegador:**
   - Abrir http://localhost:5173/register
   - Registrar nuevo usuario
   - Ver en consola: "🔐 Registro: POST /auth/register"
   - Ir a http://localhost:5173/login
   - Iniciar sesión con credenciales
   - Ver en consola: "🎯 Rol detected: CLIENTE"
   - Verificar redirección a /

2. **Si hay errores:**
   - Revisar Console (F12)
   - Ver Network tab para ver requests/responses
   - Verificar que backend está corriendo

3. **Próximas funcionalidades:**
   - Recuperación de contraseña
   - Cambio de contraseña
   - Edición de perfil
   - Cierre de sesión

---

**Implementado por:** Frontend Team  
**Fecha:** 24 de Noviembre de 2025  
**Estado:** ✅ Completado y Listo para Pruebas
