# 🧪 Guía de Pruebas - Autenticación e Imágenes

## 🎯 Flujo Completo a Probar

### **FASE 1: REGISTRO**

#### Test 1.1: Registro exitoso
```
1. Abrir: http://localhost:5173/register
2. Llenar:
   - Nombre: Juan Pérez
   - Email: juan@test.com
   - Contraseña: MiPassword123
3. Click "Crear Cuenta"
4. Verificar:
   - ✅ Alert: "¡Registro exitoso! Ahora puedes iniciar sesión."
   - ✅ Console: "✅ Registro exitoso"
   - ✅ Redirección a /login
```

**Console esperada:**
```
🔐 Registro: POST /auth/register
👤 Datos: { nombre: "Juan Pérez", email: "juan@test.com" }
🔐 Request: /auth/register | Token: false
✅ Registro exitoso
📋 Usuario creado: { id: 1, nombre: "Juan Pérez", email: "juan@test.com", rol: "CLIENTE", estado: "activo" }
```

#### Test 1.2: Validaciones en registro
```
1. Abrir: http://localhost:5173/register
2. Dejar todos los campos vacíos
3. Llenar solo nombre: "Juan"
4. Hacer Tab (blur)
5. Verificar:
   - ✅ Email: "El email es obligatorio."
   - ✅ Contraseña: "La contraseña es obligatoria."
```

#### Test 1.3: Email inválido
```
1. Email: "notanemail"
2. Tab
3. Verificar: "El email no es válido."
```

#### Test 1.4: Contraseña muy corta
```
1. Contraseña: "123456"
2. Tab
3. Verificar: "Mínimo 8 caracteres."
```

#### Test 1.5: Email duplicado
```
1. Registrar con: juan@test.com
2. Registrar nuevamente con mismo email
3. Verificar:
   - ❌ Error: "El email ya está registrado"
   - Mostrado en la página
```

---

### **FASE 2: LOGIN**

#### Test 2.1: Login exitoso (CLIENTE)
```
1. Abrir: http://localhost:5173/login
2. Email: juan@test.com
3. Contraseña: MiPassword123
4. Click "Entrar"
5. Verificar:
   - ✅ Console: "✅ Login exitoso"
   - ✅ Console: "🎯 Rol detected: CLIENTE"
   - ✅ Redirección a / (home)
   - ✅ localStorage contiene authToken y authUser
```

**Console esperada:**
```
🔐 Iniciando login...
📧 Email: juan@test.com
🔐 Login: POST /auth/login
🔐 Request: /auth/login | Token: false
✅ Login exitoso
👤 Usuario autenticado: { email: "juan@test.com", rol: "CLIENTE", nombre: "Juan Pérez" }
💾 Token y usuario guardados en localStorage
🔐 AuthContext.login: Iniciando...
✅ AuthContext.login: Datos recibidos del backend
👤 Usuario: { email: "juan@test.com", rol: "CLIENTE", nombre: "Juan Pérez" }
💾 Usuario guardado en state de AuthContext
🎯 Rol detected: CLIENTE
➡️ Redirigiendo a /
```

#### Test 2.2: Login con rol ADMIN
```
1. Login como admin (usuario ADMIN del backend)
2. Email: admin@test.com
3. Contraseña: AdminPass123
4. Click "Entrar"
5. Verificar:
   - ✅ Console: "🎯 Rol detected: ADMIN"
   - ✅ Redirección a /admin/dashboard (NO a /)
   - ✅ Dashboard muestra datos
```

**Console esperada:**
```
🎯 Rol detected: ADMIN
➡️ Redirigiendo a /admin/dashboard
```

#### Test 2.3: Contraseña incorrecta
```
1. Email: juan@test.com
2. Contraseña: WrongPassword
3. Click "Entrar"
4. Verificar:
   - ❌ Error mostrado: "Email o contraseña incorrectos"
   - ❌ NO redirige
   - ❌ localStorage NO se modifica
```

#### Test 2.4: Email no existe
```
1. Email: noexiste@test.com
2. Contraseña: MiPassword123
3. Click "Entrar"
4. Verificar:
   - ❌ Error mostrado: "Email o contraseña incorrectos"
```

#### Test 2.5: Token expirado
```
(Requiere simular token expirado)
1. En localStorage, modificar authToken a algo inválido
2. Intentar hacer cualquier acción que requiera autenticación
3. Verificar:
   - ✅ Console: "❌ Error 401 - Token inválido o expirado"
   - ✅ localStorage limpiado
   - ✅ Redirección a /login
```

---

### **FASE 3: ADMIN - CREAR PRODUCTO**

#### Test 3.1: Crear producto con 3 imágenes
```
1. Login como ADMIN
2. Ir a: http://localhost:5173/admin/products
3. Click "+ Crear"
4. Llenar:
   - Nombre: Mi Producto Test
   - Descripción: Producto para prueba
   - Precio: 50000
   - Precio Original: 60000
   - Stock: 10
   - Categoría: Juguetes
5. Seleccionar 3 imágenes
6. Click "Crear Producto"
7. Verificar:
   - ✅ Alert: "¡Producto creado exitosamente!"
   - ✅ Redirección a /admin/products
```

**Console esperada - PASO 1: Upload**
```
📤 Iniciando creación de producto...
📤 Paso 1: Subiendo 3 imágenes...
📄 Archivo 1: image1.jpg | 2048000 bytes | image/jpeg
📄 Archivo 2: image2.jpg | 1524000 bytes | image/jpeg
📄 Archivo 3: image3.jpg | 1792000 bytes | image/jpeg
📤 uploadImages: Enviando POST a /api/v1/upload/imagenes
🔐 Request: /upload/imagenes | Token: true | Rol: ADMIN
✅ uploadImages: Respuesta exitosa
📋 Respuesta: { success: true, data: [...] }
✅ uploadImages: URLs de imágenes: 3
✅ Imágenes subidas: 3 ['url1', 'url2', 'url3']
```

**Console esperada - PASO 2: Crear producto**
```
📝 Paso 2: Creando producto sin imágenes...
📦 Datos del producto: { nombre, precio: 50000, stock: 10, ... }
🔐 Request: /productos | Token: true | Rol: ADMIN
✅ Producto creado con ID: 42
```

**Console esperada - PASO 3: Actualizar imágenes**
```
🖼️ Paso 3: Actualizando imágenes del producto con PATCH...
🔐 Request: /productos/42/imagenes | Token: true | Rol: ADMIN
✅ Imágenes actualizadas correctamente
✅ ¡Producto creado exitosamente!
```

#### Test 3.2: Validación: menos de 3 imágenes
```
1. Ir a Crear producto
2. Seleccionar solo 2 imágenes
3. Click "Crear Producto"
4. Verificar:
   - ❌ Error: "Debes subir exactamente 3 imágenes."
   - No se envía ningún request
```

#### Test 3.3: Validación: precio con decimales
```
1. Precio: 50000.5
2. Verificar:
   - El campo no acepta decimales (se reemplaza automáticamente)
   - O muestra error: "Solo números enteros"
```

#### Test 3.4: Validación: stock negativo
```
1. Stock: -5
2. Verificar:
   - Error: "El stock debe ser un número entero sin decimales."
```

---

### **FASE 4: ADMIN - EDITAR PRODUCTO**

#### Test 4.1: Editar producto sin cambiar imágenes
```
1. Ir a /admin/products
2. Buscar producto creado
3. Click "Editar"
4. Cambiar: Nombre → "Producto Editado"
5. Cambiar: Precio → 55000
6. NO cambiar imágenes
7. Click "Actualizar Producto"
8. Verificar:
   - ✅ Alert: "¡Producto actualizado exitosamente!"
   - ✅ Redirección a /admin/products
```

**Console esperada - Sin nuevas imágenes:**
```
📝 Iniciando actualización de producto...
📸 No hay nuevas imágenes, usando las actuales
✅ Total de imágenes válidas: 3
📝 Paso 2: Actualizando datos del producto (PUT)...
📦 Datos del producto: { nombre, precio: 55000, ... }
✅ Producto actualizado
🖼️ Paso 3: Actualizando imágenes con PATCH...
✅ Imágenes actualizadas correctamente
✅ ¡Producto actualizado exitosamente!
```

#### Test 4.2: Editar producto reemplazando 1 imagen
```
1. Ir a Editar producto existente
2. Click "Cambiar" en imagen #1
3. Seleccionar nueva imagen
4. Mantener imágenes #2 y #3 (NO cambiar)
5. Cambiar nombre del producto
6. Click "Actualizar Producto"
7. Verificar:
   - ✅ Alert: "¡Producto actualizado exitosamente!"
   - ✅ La nueva imagen #1 se cargó
   - ✅ Las imágenes #2 y #3 se mantienen
```

**Console esperada - Con 1 nueva imagen:**
```
📝 Iniciando actualización de producto...
📤 Paso 1: Subiendo 1 nueva imagen...
📄 Archivo 1: new_image.jpg | 2048000 bytes
✅ Nuevas imágenes subidas: 1
📝 Paso 2: Actualizando datos del producto (PUT)...
✅ Producto actualizado
🖼️ Paso 3: Actualizando imágenes con PATCH...
📋 updateImages: URLs a enviar: 3
  1. https://... (nueva)
  2. https://... (actual)
  3. https://... (actual)
✅ Imágenes actualizadas correctamente
```

#### Test 4.3: Validación: borrar todas las imágenes
```
1. Ir a Editar producto
2. Click "Cancelar" en todas las imágenes (borrarlas)
3. NO cargar nuevas
4. Click "Actualizar Producto"
5. Verificar:
   - ❌ Error: "Debes tener al menos 2 imágenes"
```

#### Test 4.4: Editar con solo 2 imágenes (mínimo válido)
```
1. Ir a Editar producto con 3 imágenes
2. Click "Cancelar" en imagen #1
3. Click "Cambiar" en imagen #2, seleccionar nueva
4. Mantener imagen #3
5. Click "Actualizar Producto"
6. Verificar:
   - ✅ Actualización exitosa
   - Total de imágenes: 2 (1 nueva + 1 actual)
```

---

### **FASE 5: ADMIN - DASHBOARD**

#### Test 5.1: Dashboard carga datos
```
1. Login como ADMIN
2. Abrir: http://localhost:5173/admin/dashboard
3. Verificar:
   - ✅ Muestra estadísticas
   - ✅ Muestra cantidad de productos
   - ✅ Muestra cantidad de usuarios
   - ✅ Muestra cantidad de órdenes
```

**Console esperada:**
```
📊 Iniciando carga de datos del dashboard...
🔐 Request: /productos | Token: true | Rol: ADMIN
🔐 Request: /usuarios | Token: true | Rol: ADMIN
🔐 Request: /ordenes | Token: true | Rol: ADMIN
✅ Productos cargados: 5
✅ Usuarios cargados: 8
✅ Órdenes cargadas: 12
📊 Dashboard cargado correctamente
```

---

### **FASE 6: ERRORES DE AUTENTICACIÓN**

#### Test 6.1: Acceso a ruta admin sin autenticar
```
1. NO estar logueado
2. Ir directamente a: http://localhost:5173/admin/products
3. Verificar:
   - ✅ Redirección a /login (ProtectedRoute)
   - O muestra página vacía/error
```

#### Test 6.2: Acceso a ruta admin con rol CLIENTE
```
1. Login como CLIENTE
2. Ir a: http://localhost:5173/admin/products
3. Verificar:
   - ✅ Acceso denegado (ProtectedRoute)
   - ✅ Redirección a / o error
```

#### Test 6.3: Token en localStorage después de login
```
1. Login como CLIENTE
2. Abrir DevTools (F12)
3. Application → LocalStorage
4. Verificar:
   - ✅ authToken: (JWT largo)
   - ✅ authUser: { id, nombre, email, rol: "CLIENTE", ... }
```

---

## 📊 Tabla de Checklists

### **Registro**
- [ ] Registro exitoso
- [ ] Validación nombre obligatorio
- [ ] Validación email formato
- [ ] Validación email único
- [ ] Validación contraseña mínimo 8 caracteres
- [ ] Redirección a login

### **Login**
- [ ] Login exitoso CLIENTE
- [ ] Login exitoso ADMIN
- [ ] Redirección a / (CLIENTE)
- [ ] Redirección a /admin/dashboard (ADMIN)
- [ ] Error contraseña incorrecta
- [ ] Error email no existe
- [ ] Token guardado en localStorage
- [ ] Usuario guardado en localStorage

### **Crear Producto**
- [ ] Upload de 3 imágenes
- [ ] Creación de producto exitosa
- [ ] URLs de imágenes retornadas correctamente
- [ ] Validación 3 imágenes exactas
- [ ] Validación precio entero
- [ ] Validación stock válido
- [ ] Logging detallado en consola

### **Editar Producto**
- [ ] Editar sin cambiar imágenes
- [ ] Editar reemplazando 1 imagen
- [ ] Editar reemplazando 2 imágenes
- [ ] Editar reemplazando 3 imágenes
- [ ] Mantener mínimo 2 imágenes
- [ ] Error con menos de 2 imágenes
- [ ] Logging detallado en consola

### **Dashboard**
- [ ] Carga estadísticas
- [ ] Muestra productos
- [ ] Muestra usuarios
- [ ] Muestra órdenes
- [ ] No hay errores 403
- [ ] Logging correcto

### **Errores**
- [ ] Token expirado redirige a login
- [ ] Acceso sin autenticación redirige a login
- [ ] Acceso sin permisos (403) muestra error
- [ ] Errores del servidor manejados

---

## 🔧 Troubleshooting

### **Problema: "Error 403 - Acceso denegado"**
**Solución:**
1. Verificar que estás logueado como ADMIN
2. Verificar que el token está en localStorage
3. Revisar console: Ver el rol en el token
4. Verificar que backend acepta el token

### **Problema: Imágenes no se suben**
**Solución:**
1. Verificar que seleccionaste 3 imágenes
2. Ver console: Network tab → POST /upload/imagenes
3. Revisar si backend acepta FormData
4. Intentar con imágenes pequeñas (<5MB)

### **Problema: Login exitoso pero no redirige**
**Solución:**
1. Verificar que hay rol en la respuesta
2. Ver console: "Rol detected: ..."
3. Revisar que el rol es correcto (ADMIN, CLIENTE, VENDEDOR)
4. Verificar que React Router está configurado correctamente

### **Problema: "No se puede cargar el archivo npm.ps1"**
**Solución:**
1. Usar `npm start` desde terminal normal (no PowerShell)
2. O permitir scripts PowerShell: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 💻 Comandos Útiles - Consola del Navegador

```javascript
// Ver token actual
localStorage.getItem('authToken')

// Ver usuario actual
JSON.parse(localStorage.getItem('authUser'))

// Limpiar sesión
localStorage.removeItem('authToken')
localStorage.removeItem('authUser')

// Ver rol del usuario
JSON.parse(localStorage.getItem('authUser')).rol

// Ver todas las requests
// (Abre DevTools → Network tab)
```

---

**Guía de Pruebas Completa**  
**Fecha:** 24 Noviembre 2025  
**Estado:** ✅ Lista para Usar
