$baseUrl = "http://localhost:8080/api/v1"

Write-Host "1. Registrando nuevo usuario..." -ForegroundColor Cyan
$registerData = @{
    nombre = "Usuario Test"
    email = "test@zonekids.com"
    contrasena = "test123456"
    rol = "CLIENTE"
}

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body ($registerData | ConvertTo-Json)
    
    $registerJson = $registerResponse.Content | ConvertFrom-Json
    Write-Host "Usuario registrado: $($registerJson.email)" -ForegroundColor Green
    
} catch {
    Write-Host "Usuario probablemente ya existe" -ForegroundColor Yellow
}

Write-Host "2. Haciendo Login..." -ForegroundColor Cyan
$loginData = @{
    email = "test@zonekids.com"
    contrasena = "test123456"
}

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body ($loginData | ConvertTo-Json)
    
    $loginJson = $loginResponse.Content | ConvertFrom-Json
    $token = $loginJson.token
    
    Write-Host "Login exitoso" -ForegroundColor Green
    
    Write-Host "3. Obteniendo productos..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $productosResponse = Invoke-WebRequest -Uri "$baseUrl/productos" `
        -Method Get `
        -Headers $headers
    
    $productosJson = $productosResponse.Content | ConvertFrom-Json
    
    Write-Host "Productos encontrados: $($productosJson.Count)" -ForegroundColor Green
    
    if ($productosJson.Count -eq 0) {
        Write-Host "NO HAY PRODUCTOS" -ForegroundColor Red
        Write-Host "Debes crear productos como ADMIN desde el frontend" -ForegroundColor Yellow
    } else {
        Write-Host "Productos disponibles:" -ForegroundColor Cyan
        $productosJson | ForEach-Object {
            Write-Host "  - ID: $($_.id) | $($_.nombre) | Precio: $$($_.precio)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Respuesta: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
