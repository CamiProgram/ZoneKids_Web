# 🔄 Gestión de Estado de Usuarios - Desactivar/Activar

## 📋 Endpoint Backend

```
PATCH /api/v1/usuarios/{id}/estado

Parámetros:
- id: ID del usuario (en URL)
- estado: "activo" o "inactivo" (en query parameter)

Requisitos:
- ✅ Solo ADMIN puede cambiar estado
- ✅ Requiere autenticación (JWT)
- ✅ Token debe incluir rol ADMIN
```

---

## 💻 Ejemplos de Uso

### **Desactivar Usuario**
```bash
PATCH http://localhost:8080/api/v1/usuarios/1/estado?estado=inactivo
Authorization: Bearer <token_admin>
```

### **Activar Usuario**
```bash
PATCH http://localhost:8080/api/v1/usuarios/1/estado?estado=activo
Authorization: Bearer <token_admin>
```

---

## 🔧 Cambios Implementados

### **1. userService.js - Nuevo Método**

```javascript
/**
 * Cambiar estado del usuario (Activo/Inactivo)
 * PATCH /api/v1/usuarios/{id}/estado?estado=activo|inactivo
 */
changeEstado: async (id, estado) => {
  try {
    console.log(`🔄 Cambiando estado del usuario ${id} a: ${estado}`);
    
    // Validar estado
    if (estado !== 'activo' && estado !== 'inactivo') {
      throw new Error('El estado debe ser "activo" o "inactivo"');
    }
    
    // PATCH /usuarios/{id}/estado?estado=activo|inactivo
    const response = await api.patch(`/usuarios/${id}/estado?estado=${estado}`);
    
    console.log(`✅ Estado del usuario ${id} actualizado a: ${estado}`);
    console.log('📋 Usuario actualizado:', response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error al cambiar estado:`, error);
    throw error.response?.data || error.message;
  }
}
```

**Características:**
- ✅ Validación de estado (solo "activo" o "inactivo")
- ✅ Logging detallado en consola
- ✅ Manejo de errores
- ✅ Retorna usuario actualizado

### **2. AdminUsers.jsx - Actualización**

**Antes:**
```javascript
// Enviaba todos los datos del usuario con PUT
const updatedUserData = { ...userToUpdate, estado: nuevoEstado };
await userService.update(userToUpdate.id, updatedUserData);
```

**Ahora:**
```javascript
// Usa el endpoint específico PATCH /usuarios/{id}/estado
await userService.changeEstado(userToUpdate.id, nuevoEstado);
```

**Flujo actualizado:**
```
1. Usuario hace click en "Deshabilitar" o "Habilitar"
   ↓
2. Confirmación: "¿Deshabilitar a Juan?"
   ↓
3. PATCH /usuarios/{id}/estado?estado=inactivo
   ↓
4. Backend valida:
   - Es ADMIN (403 si no)
   - Estado válido (activo o inactivo)
   ↓
5. Actualiza estado en BD
   ↓
6. Retorna usuario actualizado
   ↓
7. Frontend recarga lista de usuarios
   ↓
8. Alert: "✅ Usuario deshabilitado correctamente"
```

**Logging detallado:**
```javascript
console.log(`🔄 Iniciando cambio de estado para usuario: ${userToUpdate.nombre}`);
// Hace el cambio...
console.log(`✅ Usuario ${userToUpdate.nombre} deshabilitado correctamente`);
```

---

## 📊 Respuestas Esperadas

### **Response - Éxito (200):**
```json
{
  "success": true,
  "message": "Estado del usuario actualizado correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "CLIENTE",
    "estado": "inactivo",
    "fechaActualizacion": "2025-11-24T15:30:45Z"
  },
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: No es ADMIN (403):**
```json
{
  "success": false,
  "message": "No tiene permisos para acceder a este recurso",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Estado inválido (400):**
```json
{
  "success": false,
  "message": "El estado debe ser 'activo' o 'inactivo'",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

### **Response - Error: Usuario no existe (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "data": null,
  "timestamp": "2025-11-24T15:30:45Z"
}
```

---

## 🎯 Flujo de Usuario en la UI

### **Paso 1: Ver lista de usuarios**
```
Ir a: http://localhost:5173/admin/users
Ver tabla con usuarios:
- ID | Nombre | Email | Rol | Estado | Acciones
```

### **Paso 2: Cambiar estado**
```
Botón "Deshabilitar" (usuario activo)
    ↓
Confirmación: "¿Deshabilitar a Juan Pérez?"
    ↓
Click "Aceptar"
    ↓
PATCH /usuarios/1/estado?estado=inactivo
    ↓
Alert: "✅ Usuario deshabilitado correctamente"
    ↓
Lista se recarga automáticamente
    ↓
Estado cambia a "inactivo" (color rojo)
    ↓
Botón cambia a "Habilitar"
```

### **Paso 3: Reactivar usuario**
```
Botón "Habilitar" (usuario inactivo)
    ↓
Confirmación: "¿Habilitar a Juan Pérez?"
    ↓
Click "Aceptar"
    ↓
PATCH /usuarios/1/estado?estado=activo
    ↓
Alert: "✅ Usuario habilitado correctamente"
    ↓
Lista se recarga
    ↓
Estado cambia a "activo"
    ↓
Botón cambia a "Deshabilitar"
```

---

## 📝 Logging - Consola del Navegador

### **Cambiar a Inactivo - Éxito:**
```
🔄 Iniciando cambio de estado para usuario: Juan Pérez
🔄 Cambiando estado del usuario 1 a: inactivo
🔐 Request: /usuarios/1/estado?estado=inactivo | Token: true | Rol: ADMIN
✅ Estado del usuario 1 actualizado a: inactivo
📋 Usuario actualizado: { id: 1, nombre: "Juan Pérez", estado: "inactivo", ... }
✅ Usuarios cargados: 8
✅ Usuario Juan Pérez deshabilitado correctamente
```

### **Cambiar a Activo - Éxito:**
```
🔄 Iniciando cambio de estado para usuario: Juan Pérez
🔄 Cambiando estado del usuario 1 a: activo
🔐 Request: /usuarios/1/estado?estado=activo | Token: true | Rol: ADMIN
✅ Estado del usuario 1 actualizado a: activo
📋 Usuario actualizado: { id: 1, nombre: "Juan Pérez", estado: "activo", ... }
✅ Usuarios cargados: 8
✅ Usuario Juan Pérez habilitado correctamente
```

### **Error: No es ADMIN:**
```
🔄 Iniciando cambio de estado para usuario: Juan Pérez
🔄 Cambiando estado del usuario 1 a: inactivo
🔐 Request: /usuarios/1/estado?estado=inactivo | Token: true | Rol: CLIENTE
❌ Error al cambiar estado del usuario: { message: "No tiene permisos..." }
```

---

## ✅ Validaciones

### **Frontend:**
- ✅ Confirmación antes de cambiar estado
- ✅ Validación de estado (solo "activo" o "inactivo")
- ✅ Mensaje de error si falla
- ✅ Recarga automática de lista

### **Backend:**
- ✅ Solo ADMIN puede cambiar estado
- ✅ Usuario debe existir
- ✅ Estado debe ser "activo" o "inactivo"
- ✅ Retorna usuario actualizado

---

## 🧪 Casos de Prueba

### **Test 1: Desactivar usuario**
```
1. Login como ADMIN
2. Ir a /admin/users
3. Buscar usuario activo
4. Click "Deshabilitar"
5. Confirmar
6. Verificar:
   - ✅ Console: "✅ Usuario deshabilitado correctamente"
   - ✅ Estado cambia a rojo "inactivo"
   - ✅ Botón cambia a "Habilitar"
```

### **Test 2: Activar usuario**
```
1. Usuario inactivo en lista
2. Click "Habilitar"
3. Confirmar
4. Verificar:
   - ✅ Estado cambia a "activo"
   - ✅ Botón cambia a "Deshabilitar"
```

### **Test 3: Cancelar cambio de estado**
```
1. Click "Deshabilitar"
2. En la confirmación, click "Cancelar"
3. Verificar:
   - ✅ NO hace el cambio
   - ✅ Estado se mantiene igual
```

### **Test 4: Error - Usuario deshabilitado intenta login**
```
1. Desactivar usuario
2. Logout
3. Intentar login con usuario deshabilitado
4. Verificar:
   - ❌ Error: "Cuenta deshabilitada" o similar
   - ❌ NO se crea sesión
```

---

## 🔐 Seguridad

### **Backend:**
- ✅ Solo ADMIN puede cambiar estado (validación con rol)
- ✅ Token JWT requerido
- ✅ Usuario deshabilitado no puede hacer login
- ✅ Validación de parámetro estado

### **Frontend:**
- ✅ Confirmación requerida
- ✅ Token enviado en header Authorization
- ✅ Manejo de errores 403
- ✅ Logging de cambios

---

## 📊 Estado de Usuarios en la Tabla

| Estado | Color | Botón | Acciones |
|--------|-------|-------|----------|
| activo | Verde | "Deshabilitar" | Puede hacer login, usar plataforma |
| inactivo | Rojo | "Habilitar" | NO puede hacer login |

---

## 🎯 Próximas Mejoras (Futuro)

- [ ] Historial de cambios de estado
- [ ] Razón de desactivación (comentario)
- [ ] Notificación por email al usuario
- [ ] Bloqueo de cuenta por inactividad
- [ ] Roles específicos para gestión de usuarios

---

## 📁 Archivos Modificados

```
src/
├── services/
│   └── userService.js ✅ (nuevo método changeEstado)
└── pages/admin/
    └── AdminUsers.jsx ✅ (usa changeEstado, logging mejorado)
```

---

**Implementado por:** Frontend Team  
**Fecha:** 24 Noviembre 2025  
**Estado:** ✅ Completado y Listo para Pruebas
