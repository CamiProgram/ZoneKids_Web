# Script para probar API ZoneKids

$baseUrl = "http://localhost:8080/api/v1"

# 1. Login
Write-Host "1. Intentando Login..." -ForegroundColor Cyan
$loginData = @{
    email = "camilotapia828@gmail.com"
    contrasena = "admin123"
}

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body ($loginData | ConvertTo-Json)
    
    $loginJson = $loginResponse.Content | ConvertFrom-Json
    $token = $loginJson.token
    
    Write-Host "✓ Login exitoso" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Yellow
    
    # 2. Obtener productos con token
    Write-Host "`n2. Obteniendo productos..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $productosResponse = Invoke-WebRequest -Uri "$baseUrl/productos" `
        -Method Get `
        -Headers $headers
    
    $productosJson = $productosResponse.Content | ConvertFrom-Json
    
    Write-Host "✓ Productos obtenidos: $($productosJson.Count) productos" -ForegroundColor Green
    
    if ($productosJson.Count -eq 0) {
        Write-Host "`n⚠ No hay productos en la base de datos" -ForegroundColor Yellow
        Write-Host "Necesitas crear productos desde el panel admin" -ForegroundColor Yellow
    } else {
        Write-Host "`n📦 Productos disponibles:" -ForegroundColor Cyan
        foreach ($producto in $productosJson) {
            Write-Host "  - ID: $($producto.id) | Nombre: $($producto.nombre) | Precio: $($producto.precio)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Credenciales inválidas" -ForegroundColor Red
    }
}
