# Script de prueba completa para Hackless Backend
# Prueba todas las funcionalidades del sistema

$baseUrl = "http://localhost:3000"
$testResults = @()

Write-Host "🚀 Iniciando pruebas completas del sistema Hackless" -ForegroundColor Green

# Función para realizar peticiones HTTP
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body = @{},
        [hashtable]$Headers = @{"Content-Type"="application/json"},
        [string]$Description
    )
    
    Write-Host "📝 Probando: $Description" -ForegroundColor Yellow
    
    try {
        $uri = "$baseUrl$Endpoint"
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $Headers
        } else {
            $bodyJson = $Body | ConvertTo-Json -Depth 5
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $Headers -Body $bodyJson
        }
        
        Write-Host "✅ ÉXITO: $Description" -ForegroundColor Green
        Write-Host "Respuesta: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
        
        $global:testResults += @{
            Test = $Description
            Status = "ÉXITO"
            Response = $response
        }
        
        return $response
    }
    catch {
        Write-Host "❌ ERROR: $Description" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        
        $global:testResults += @{
            Test = $Description
            Status = "ERROR"
            Error = $_.Exception.Message
        }
        
        return $null
    }
}

# === PRUEBAS DE CONECTIVIDAD ===
Write-Host "`n=== PRUEBAS DE CONECTIVIDAD ===" -ForegroundColor Magenta

Test-Endpoint -Method "POST" -Endpoint "/test" -Body @{mensaje="Prueba de conectividad"} -Description "Conectividad básica del servidor"

# === PRUEBAS DE REGISTRO DE USUARIOS ===
Write-Host "`n=== PRUEBAS DE REGISTRO DE USUARIOS ===" -ForegroundColor Magenta

# Registro de usuario empleado
$nuevoEmpleado = @{
    nombre = "Juan Pérez"
    correo_electronico = "juan.perez@empresa.com"
    password = "MiPassword123!"
    confirm_password = "MiPassword123!"
    rol = "empleado"
}

Test-Endpoint -Method "POST" -Endpoint "/register" -Body $nuevoEmpleado -Description "Registro de empleado"

# Registro de usuario administrador
$nuevoAdmin = @{
    nombre = "Admin Hackless"
    correo_electronico = "admin@hackless.com"
    password = "AdminPass123!"
    confirm_password = "AdminPass123!"
    rol = "admin"
}

Test-Endpoint -Method "POST" -Endpoint "/register" -Body $nuevoAdmin -Description "Registro de administrador"

# === PRUEBAS DE INICIO DE SESIÓN ===
Write-Host "`n=== PRUEBAS DE INICIO DE SESIÓN ===" -ForegroundColor Magenta

$loginEmpleado = @{
    correo_electronico = "juan.perez@empresa.com"
    password = "MiPassword123!"
}

Test-Endpoint -Method "POST" -Endpoint "/login" -Body $loginEmpleado -Description "Login de empleado"

$loginAdmin = @{
    correo_electronico = "admin@hackless.com"
    password = "AdminPass123!"
}

Test-Endpoint -Method "POST" -Endpoint "/admin-login" -Body $loginAdmin -Description "Login de administrador"

# === PRUEBAS DE GESTIÓN DE USUARIOS ===
Write-Host "`n=== PRUEBAS DE GESTIÓN DE USUARIOS ===" -ForegroundColor Magenta

Test-Endpoint -Method "GET" -Endpoint "/users" -Description "Obtener lista de usuarios"

# === PRUEBAS DE SOLICITUDES DE DEMO ===
Write-Host "`n=== PRUEBAS DE SOLICITUDES DE DEMO ===" -ForegroundColor Magenta

$solicitudDemo = @{
    nombre = "Cliente Potencial"
    empresa = "TechCorp SA"
    email = "cliente@techcorp.com"
    telefono = "+56912345678"
    mensaje = "Estamos interesados en conocer más sobre Hackless"
}

Test-Endpoint -Method "POST" -Endpoint "/solicitar-demo" -Body $solicitudDemo -Description "Solicitud de demo"

# === PRUEBAS DE DOCUMENTOS ===
Write-Host "`n=== PRUEBAS DE DOCUMENTOS ===" -ForegroundColor Magenta

Test-Endpoint -Method "GET" -Endpoint "/documents" -Description "Obtener lista de documentos"

# === RESUMEN DE RESULTADOS ===
Write-Host "`n=== RESUMEN DE PRUEBAS ===" -ForegroundColor Magenta

$exitosos = ($testResults | Where-Object { $_.Status -eq "ÉXITO" }).Count
$fallidos = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count
$total = $testResults.Count

Write-Host "📊 TOTAL DE PRUEBAS: $total" -ForegroundColor White
Write-Host "✅ EXITOSAS: $exitosos" -ForegroundColor Green
Write-Host "❌ FALLIDAS: $fallidos" -ForegroundColor Red

if ($fallidos -eq 0) {
    Write-Host "`n🎉 ¡TODAS LAS PRUEBAS FUERON EXITOSAS!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  ALGUNAS PRUEBAS FALLARON - REVISAR DETALLES" -ForegroundColor Yellow
}

Write-Host "`n📋 Detalles completos guardados en variable testResults" -ForegroundColor Cyan
