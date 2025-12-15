$baseUrl = "http://localhost:8080/api/v1"

# Primero, intentar registrar el usuario como ADMIN
$registerPayload = @{
    nombre = "Admin Cami"
    email = "camilotapia828@gmail.com"
    contrasena = "Admin@123456"
    rol = "ADMIN"
} | ConvertTo-Json

Write-Host "Intentando registrar usuario como ADMIN..."
Write-Host "Email: camilotapia828@gmail.com"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerPayload `
        -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
        Write-Host "✓ Usuario registrado exitosamente como ADMIN" -ForegroundColor Green
        $responseBody = $response.Content | ConvertFrom-Json
        Write-Host "Respuesta:" $responseBody
    } else {
        Write-Host "✗ Error al registrar. Status: " $response.StatusCode -ForegroundColor Red
    }
} catch {
    Write-Host "Error en la petición: " $_.Exception.Message -ForegroundColor Yellow
    
    # Intentar parsear el contenido del error
    if ($_.Exception.Response -ne $null) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "Respuesta del servidor: $errorContent" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Ahora intenta loguearte con:"
Write-Host "Email: camilotapia828@gmail.com"
Write-Host "Contraseña: Admin@123456"
