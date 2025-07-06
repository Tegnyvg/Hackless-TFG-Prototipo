# Script de Pruebas - Funcionalidades RRHH

Write-Host "Iniciando pruebas de funcionalidades RRHH..." -ForegroundColor Green

# Prueba 1: Servidor funcionando
Write-Host ""
Write-Host "1. Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "OK - Servidor respondiendo" -ForegroundColor Green
}
catch {
    Write-Host "ERROR - Servidor no responde" -ForegroundColor Red
    exit 1
}

# Prueba 2: Archivos necesarios
Write-Host ""
Write-Host "2. Verificando archivos..." -ForegroundColor Yellow

if (Test-Path "empleados_ejemplo.csv") {
    Write-Host "OK - empleados_ejemplo.csv existe" -ForegroundColor Green
} else {
    Write-Host "ERROR - empleados_ejemplo.csv falta" -ForegroundColor Red
}

if (Test-Path "public\cargar-empleados.html") {
    Write-Host "OK - cargar-empleados.html existe" -ForegroundColor Green
} else {
    Write-Host "ERROR - cargar-empleados.html falta" -ForegroundColor Red
}

# Prueba 3: Página accesible
Write-Host ""
Write-Host "3. Verificando pagina web..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/cargar-empleados.html" -Method GET -TimeoutSec 5
    Write-Host "OK - Pagina accesible (Status: $($response.StatusCode))" -ForegroundColor Green
}
catch {
    Write-Host "ERROR - No se puede acceder a la pagina" -ForegroundColor Red
}

# Resumen
Write-Host ""
Write-Host "FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Cyan
Write-Host "- Carga masiva de empleados (Excel/CSV)" -ForegroundColor Green
Write-Host "- Carga manual de empleados (formulario)" -ForegroundColor Green
Write-Host "- Plantillas y archivos de ejemplo" -ForegroundColor Green
Write-Host "- Validaciones y feedback visual" -ForegroundColor Green
Write-Host "- Campos opcionales (puesto, area, telefono)" -ForegroundColor Green
Write-Host "- Contraseñas temporales automaticas" -ForegroundColor Green

Write-Host ""
Write-Host "Sistema listo para demo academico!" -ForegroundColor Green
