# Script para Configurar GitHub Pages

Write-Host "Configurando GitHub Pages para el proyecto Hackless..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en un repositorio git
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: No estamos en un repositorio Git" -ForegroundColor Red
    Write-Host "Ejecuta primero: git init" -ForegroundColor Yellow
    exit 1
}

# Agregar archivos de documentación
Write-Host "1. Agregando archivos de documentación..." -ForegroundColor Yellow
git add docs/
git add .github/
git add MD/

# Verificar status
Write-Host ""
Write-Host "2. Estado del repositorio:" -ForegroundColor Yellow
git status --short

# Confirmar commit
Write-Host ""
$commit = Read-Host "¿Hacer commit de los cambios? (s/n)"
if ($commit -eq "s" -or $commit -eq "S") {
    git commit -m "Agregar documentación GitHub Pages y configuración de deployment
    
    - Página de documentación completa en docs/index.html
    - Guía de configuración GitHub Pages
    - Workflow para deployment automático
    - Información del TFG y credenciales demo
    - Enlaces a aplicación en Railway"
    
    Write-Host "✅ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "❌ Commit cancelado" -ForegroundColor Red
    exit 0
}

# Confirmar push
Write-Host ""
$push = Read-Host "¿Subir cambios a GitHub? (s/n)"
if ($push -eq "s" -or $push -eq "S") {
    git push origin main
    Write-Host "✅ Cambios subidos a GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ Push cancelado" -ForegroundColor Red
    exit 0
}

# Instrucciones finales
Write-Host ""
Write-Host "🎯 SIGUIENTE PASO: Configurar GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host "1. Ve a tu repositorio en GitHub" -ForegroundColor White
Write-Host "2. Clic en 'Settings'" -ForegroundColor White
Write-Host "3. Scroll hasta 'Pages'" -ForegroundColor White
Write-Host "4. En 'Source' selecciona 'Deploy from a branch'" -ForegroundColor White
Write-Host "5. Branch: 'main', Folder: '/docs'" -ForegroundColor White
Write-Host "6. Clic 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Tu documentación estará en:" -ForegroundColor Green
Write-Host "https://tu-usuario.github.io/hackless-backend/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 La aplicación sigue funcionando en Railway:" -ForegroundColor Green
Write-Host "https://hackless-backend-production.up.railway.app" -ForegroundColor Cyan
