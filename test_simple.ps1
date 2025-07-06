# Script de prueba simplificado para Hackless
$baseUrl = "http://localhost:3000"

Write-Host "🚀 Iniciando pruebas del sistema Hackless" -ForegroundColor Green

# Prueba 1: Conectividad
Write-Host "`n📝 Probando conectividad..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"mensaje":"Prueba de conectividad"}'
    Write-Host "✅ Conectividad: OK" -ForegroundColor Green
    Write-Host "Respuesta: $($response.mensaje)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en conectividad: $($_.Exception.Message)" -ForegroundColor Red
}

# Prueba 2: Registro de usuario
Write-Host "`n📝 Probando registro de usuario..." -ForegroundColor Yellow
try {
    $usuario = @{
        nombre = "Usuario Prueba"
        correo_electronico = "prueba@test.com"
        password = "TestPass123!"
        confirm_password = "TestPass123!"
        rol = "empleado"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $usuario
    Write-Host "✅ Registro: OK" -ForegroundColor Green
    Write-Host "Usuario creado: $($response.usuario.nombre)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en registro: $($_.Exception.Message)" -ForegroundColor Red
}

# Prueba 3: Login
Write-Host "`n📝 Probando login..." -ForegroundColor Yellow
try {
    $login = @{
        correo_electronico = "prueba@test.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $login
    Write-Host "✅ Login: OK" -ForegroundColor Green
    Write-Host "Mensaje: $($response.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
}

# Prueba 4: Lista de usuarios
Write-Host "`n📝 Probando lista de usuarios..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET
    Write-Host "✅ Lista usuarios: OK" -ForegroundColor Green
    Write-Host "Total usuarios: $($response.total)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en lista usuarios: $($_.Exception.Message)" -ForegroundColor Red
}

# Prueba 5: Solicitud de demo
Write-Host "`n📝 Probando solicitud de demo..." -ForegroundColor Yellow
try {
    $demo = @{
        nombre = "Cliente Demo"
        empresa = "Empresa Test"
        email = "demo@test.com"
        telefono = "123456789"
        mensaje = "Solicitud de demo de prueba"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/solicitar-demo" -Method POST -Headers @{"Content-Type"="application/json"} -Body $demo
    Write-Host "✅ Solicitud demo: OK" -ForegroundColor Green
    Write-Host "Mensaje: $($response.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en solicitud demo: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Pruebas completadas" -ForegroundColor Green
