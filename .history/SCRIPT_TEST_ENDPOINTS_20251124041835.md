# 🧪 SCRIPT DE PRUEBA - Test de Endpoints Admin

Este script te permite probar los endpoints desde la línea de comandos sin necesidad del frontend.

---

## 🔧 REQUISITOS

- `curl` instalado (viene por defecto en Mac/Linux)
- Backend ejecutándose en `http://localhost:8080`
- Un usuario con rol ADMIN en la base de datos

---

## 1️⃣ PASO 1: Obtener el Token (Login)

### PowerShell (Windows)
```powershell
$body = @{
    email = "admin@example.com"
    contrasena = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

$result = $response.Content | ConvertFrom-Json
$token = $result.data.token

Write-Host "✅ Login exitoso"
Write-Host "Token: $token"
Write-Host ""
```

### Bash/Mac/Linux
```bash
TOKEN_RESPONSE=$(curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","contrasena":"password123"}')

echo "Response: $TOKEN_RESPONSE"

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.data.token')
echo "✅ Token obtenido: $TOKEN"
```

### cURL (Multiplataforma)
```bash
curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "contrasena": "password123"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@example.com",
    "rol": "ADMIN"
  }
}
```

**Copiar el valor completo de `token` para usar en los próximos pasos.**

---

## 2️⃣ PASO 2: Test GET /api/v1/ordenes

### PowerShell
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/ordenes" `
    -Method GET `
    -Headers $headers

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Bash/Mac
```bash
curl -X GET "http://localhost:8080/api/v1/ordenes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

### Esperado: Status 200
```json
{
  "success": true,
  "message": "Órdenes obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "total": 50000,
      "fecha": "2025-11-24T10:30:00",
      "estado": "pendiente"
    }
  ]
}
```

### Si recibe 403:
```json
{
  "error": "Solo ADMIN puede acceder"
}
```

**ENTONCES:**
1. Revisar logs del backend para ver qué dice sobre el rol
2. Seguir el checklist en RESUMEN_BACKEND_REVISAR.md

---

## 3️⃣ PASO 3: Test GET /api/v1/usuarios

### PowerShell
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/usuarios" `
    -Method GET `
    -Headers $headers

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Bash/Mac
```bash
curl -X GET "http://localhost:8080/api/v1/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

### Esperado: Status 200
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "nombre": "Admin User",
      "rol": "ADMIN"
    }
  ]
}
```

---

## 4️⃣ PASO 4: Test SIN Token (Debería fallar)

### PowerShell
```powershell
$headers_sin_token = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/ordenes" `
        -Method GET `
        -Headers $headers_sin_token
} catch {
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Expected: 401 o 403"
}
```

### Bash/Mac
```bash
curl -X GET "http://localhost:8080/api/v1/ordenes" \
  -H "Content-Type: application/json"
  
# Debería retornar 401 o 403
```

---

## 5️⃣ PASO 5: Decodificar el Token (verificar contenido)

Usa https://jwt.io para decodificar el token y verificar:

1. Copia el token completo (sin comillas)
2. Pega en https://jwt.io en el área "Encoded"
3. En la sección "Decoded" del lado derecho, verifica:
   - ¿Existe el campo `rol`?
   - ¿Tiene el valor "ADMIN"?
   - ¿Tiene otros campos esperados (email, sub, etc.)?

**Estructura esperada:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "sub": "1",
  "email": "admin@example.com",
  "rol": "ADMIN",
  "nombre": "Admin User",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Si el rol es NULL o no existe → ESE ES EL PROBLEMA**

---

## 📊 SCRIPT COMPLETO EN POWERSHELL

```powershell
# Script completo para Windows PowerShell

Write-Host "🚀 TEST DE ENDPOINTS ADMIN" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# PASO 1: Login
Write-Host "`n1️⃣  Haciendo login..." -ForegroundColor Yellow

$loginBody = @{
    email = "admin@example.com"
    contrasena = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody
    
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    $rol = $loginData.data.rol
    
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host "Email: $($loginData.data.email)"
    Write-Host "Rol: $rol"
    Write-Host "Token: $($token.Substring(0, 30))..."
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# PASO 2: Test /api/v1/ordenes
Write-Host "`n2️⃣  Probando GET /api/v1/ordenes..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/ordenes" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ GET /ordenes - Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
}

# PASO 3: Test /api/v1/usuarios
Write-Host "`n3️⃣  Probando GET /api/v1/usuarios..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/usuarios" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ GET /usuarios - Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
}

# PASO 4: Test SIN token (debería fallar)
Write-Host "`n4️⃣  Probando SIN token (debería fallar)..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/ordenes" `
        -Method GET
    Write-Host "⚠️  No debería llegar aquí" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Correctamente rechazado - Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}

Write-Host "`n📋 RESUMEN" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "Si todos los tests pasaron → Backend funciona correctamente"
Write-Host "Si alguno falló con 403 → Revisar RESUMEN_BACKEND_REVISAR.md"
Write-Host "`n✅ Tests completados" -ForegroundColor Green
```

---

## 📊 SCRIPT COMPLETO EN BASH

```bash
#!/bin/bash

echo "🚀 TEST DE ENDPOINTS ADMIN"
echo "========================="

# PASO 1: Login
echo ""
echo "1️⃣  Haciendo login..."

LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "contrasena": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
ROL=$(echo $LOGIN_RESPONSE | jq -r '.data.rol')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Error en login - no se obtuvo token"
    exit 1
fi

echo "✅ Login exitoso"
echo "Rol: $ROL"
echo "Token: ${TOKEN:0:30}..."

# PASO 2: Test /api/v1/ordenes
echo ""
echo "2️⃣  Probando GET /api/v1/ordenes..."

ORDENES_RESPONSE=$(curl -s -X GET "http://localhost:8080/api/v1/ordenes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$ORDENES_RESPONSE" | jq .

# PASO 3: Test /api/v1/usuarios
echo ""
echo "3️⃣  Probando GET /api/v1/usuarios..."

USUARIOS_RESPONSE=$(curl -s -X GET "http://localhost:8080/api/v1/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$USUARIOS_RESPONSE" | jq .

# PASO 4: Test SIN token
echo ""
echo "4️⃣  Probando SIN token (debería fallar)..."

SIN_TOKEN=$(curl -s -w "%{http_code}" -X GET "http://localhost:8080/api/v1/ordenes")
echo "Status code (sin token): $SIN_TOKEN"
echo "Debería ser 401 o 403"

echo ""
echo "✅ Tests completados"
```

---

## 🎯 INTERPRETACIÓN DE RESULTADOS

### ✅ TODO FUNCIONA
```
GET /ordenes - Status: 200 ✅
GET /usuarios - Status: 200 ✅
GET sin token - Status: 401/403 ✅
```
→ Backend está configurado correctamente

### ❌ FALLA EN /ordenes Y /usuarios CON 403
```
GET /ordenes - Status: 403 ❌
GET /usuarios - Status: 403 ❌
GET sin token - Status: 401/403 ✅
```
→ Problema con validación de rol
→ Seguir: RESUMEN_BACKEND_REVISAR.md

### ❌ FALLA TODO CON 404
```
GET /ordenes - Status: 404 ❌
GET /usuarios - Status: 404 ❌
```
→ Los endpoints no existen
→ Crear controllers

### ❌ FALLA SIN TOKEN CON 200
```
GET sin token - Status: 200 ✅
```
⚠️ **PROBLEMA DE SEGURIDAD**: El endpoint no está protegido
→ Agregar filtro de autorización

---

## 📞 INFORMACIÓN A INCLUIR EN EL REPORTE

Si algo falla, incluir:

1. **Comando exacto que corriste:**
```powershell
curl -X GET "http://localhost:8080/api/v1/ordenes" `
  -H "Authorization: Bearer [TOKEN]"
```

2. **Respuesta completa (status code + body):**
```
Status: 403 Forbidden
Body: {"error":"Solo ADMIN puede acceder"}
```

3. **Logs del backend cuando ocurrió el error:**
```
🔍 Rol extraído: admin
❌ FALLO: Rol 'admin' no es ADMIN
```

Con esa información es fácil identificar qué está mal.
