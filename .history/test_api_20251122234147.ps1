$baseUrl = "http://localhost:8080/api/v1"

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
    
    Write-Host "Login exitoso" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Yellow
    
    Write-Host "Obteniendo productos..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $productosResponse = Invoke-WebRequest -Uri "$baseUrl/productos" `
        -Method Get `
        -Headers $headers
    
    $productosJson = $productosResponse.Content | ConvertFrom-Json
    
    Write-Host "Productos obtenidos: $($productosJson.Count) productos" -ForegroundColor Green
    
    if ($productosJson.Count -eq 0) {
        Write-Host "No hay productos en la base de datos" -ForegroundColor Yellow
    } else {
        Write-Host "Productos disponibles:" -ForegroundColor Cyan
        $productosJson | ForEach-Object {
            Write-Host "- ID: $($_.id) | $($_.nombre) | Precio: $($_.precio)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
