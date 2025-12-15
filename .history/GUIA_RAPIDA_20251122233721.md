# 🚀 GUÍA RÁPIDA DE INICIO - ZONEKIDS FRONTEND

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar dependencias
```bash
cd ZonekidsWeb
npm install
```

### 2. Crear archivo `.env`
En la raíz de `ZonekidsWeb/`, crear archivo `.env`:
```env
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=5000
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

Acceder a: `http://localhost:5173`

---

## 🔐 Credenciales de Prueba

Después de crear en el backend:

### Admin
- **Email**: admin@zonekids.com
- **Contraseña**: Admin123456 (8+ caracteres)
- **Rol**: ADMIN
- **Acceso**: http://localhost:5173/admin

### Cliente
- **Email**: cliente@zonekids.com
- **Contraseña**: Cliente123456
- **Rol**: CLIENTE
- **Acceso**: http://localhost:5173/ (compras)

---

## 🗂️ Estructura del Proyecto

```
ZonekidsWeb/
├── src/
│   ├── services/          ← Llamadas API centralizadas
│   ├── context/           ← Estado global (Auth, Cart)
│   ├── pages/             ← Páginas
│   ├── components/        ← Componentes reutilizables
│   ├── layout/            ← Layouts (Admin, Public)
│   ├── styles/            ← CSS
│   ├── App.jsx            ← Rutas principales
│   └── main.jsx           ← Punto de entrada
├── .env                   ← Variables de entorno (crear)
├── .env.example           ← Referencia de variables
└── package.json
```

---

## 📝 Cambios Principales Realizados

### Autenticación
- ✅ JWT en `localStorage.authToken`
- ✅ Interceptores automáticos en axios
- ✅ Logout automático si token expira (401)

### Roles
- ✅ `ADMIN` - Acceso total
- ✅ `VENDEDOR` - Solo lectura
- ✅ `CLIENTE` - Compras

### Endpoints
- ✅ `/api/v1/auth/login`
- ✅ `/api/v1/auth/register`
- ✅ `/api/v1/productos`
- ✅ `/api/v1/usuarios`

### Servicios
- ✅ `authService` - Login/Register
- ✅ `productService` - CRUD productos
- ✅ `userService` - CRUD usuarios
- ✅ `api` - Configuración axios

---

## 🧪 Pruebas Rápidas

### 1. Registro
```
1. Ir a http://localhost:5173/register
2. Llenar formulario
3. Contraseña mínimo 8 caracteres
4. Verificar alerta de éxito
```

### 2. Login
```
1. Ir a http://localhost:5173/login
2. Usar credenciales válidas
3. Si rol = ADMIN → Redirige a /admin/dashboard
4. Si rol = CLIENTE → Redirige a /
```

### 3. Ver Productos
```
1. Ir a http://localhost:5173/
2. Debe cargar productos desde backend
3. Los productos se obtienen de GET /api/v1/productos
```

### 4. Admin Dashboard
```
1. Login como ADMIN
2. Ir a http://localhost:5173/admin/dashboard
3. Ver estadísticas (total productos, usuarios, stock bajo)
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 🔍 Debugging

### En el navegador (DevTools)
1. **Storage** → **LocalStorage**: Ver `authToken` y `authUser`
2. **Network**: Ver requests con header `Authorization`
3. **Console**: Errores de API

### Verificar tokens
```javascript
// En la consola del navegador
localStorage.getItem('authToken')
JSON.parse(localStorage.getItem('authUser'))
```

---

## ⚠️ Problemas Comunes

### "No se pueden cargar los productos"
- ✅ Verificar backend en `http://localhost:8080`
- ✅ Verificar CORS habilitado en backend
- ✅ Verificar `.env` con URL correcta

### "No puedo acceder a /admin"
- ✅ Verificar rol es `ADMIN`
- ✅ Verificar token en localStorage
- ✅ Ver console para errores de autenticación

### "Error 401 Unauthorized"
- ✅ Token expirado → Hacer logout
- ✅ Token inválido → Login nuevamente
- ✅ Verificar header `Authorization` en requests

---

## 🔐 Seguridad

- **Token en localStorage**: ✅ Solo JWT (no contraseña)
- **Interceptores**: ✅ JWT en todos los requests
- **HTTPS**: ⚠️ Usar en producción
- **Validación**: ✅ Frontend + Backend

---

## 📱 Rutas Disponibles

| Ruta | Tipo | Descripción |
|------|------|------------|
| `/` | Público | Home |
| `/login` | Público | Login |
| `/register` | Público | Registro |
| `/producto/:id` | Público | Detalle producto |
| `/categoria/:slug` | Público | Productos por categoría |
| `/buscar` | Público | Búsqueda |
| `/admin` | Protegido | Admin dashboard |
| `/admin/products` | Protegido | Gestión productos |
| `/admin/users` | Protegido | Gestión usuarios |

---

## 📞 Soporte

Si tienes problemas:

1. Verificar backend ejecutándose en `http://localhost:8080`
2. Verificar `.env` con URL correcta
3. Limpiar localStorage: `localStorage.clear()`
4. Hacer refresh: `Ctrl + Shift + R` (limpiar caché)
5. Ver console del navegador para errores

---

## 🎉 ¡Listo!

El frontend está completamente configurado. Solo necesitas:
1. Backend corriendo en `http://localhost:8080`
2. Archivo `.env` con las variables correctas
3. Ejecutar `npm run dev`

**¡Bienvenido a ZoneKids!**
