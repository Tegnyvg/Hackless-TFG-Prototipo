# Limpieza del repositorio para evaluacion
Write-Host "LIMPIANDO REPOSITORIO PARA EVALUACION..." -ForegroundColor Cyan

# Crear carpeta local
$localFolder = "ARCHIVOS_INTERNOS_LOCAL"
if (-not (Test-Path $localFolder)) {
    New-Item -ItemType Directory -Path $localFolder -Force | Out-Null
    Write-Host "Carpeta local creada: $localFolder" -ForegroundColor Green
}

# Crear subcarpetas
New-Item -ItemType Directory -Path "$localFolder\documentacion" -Force | Out-Null
New-Item -ItemType Directory -Path "$localFolder\scripts_prueba" -Force | Out-Null
New-Item -ItemType Directory -Path "$localFolder\archivos_trabajo" -Force | Out-Null

Write-Host "Moviendo archivos internos..." -ForegroundColor Yellow

# Mover documentacion MD completa
if (Test-Path "MD") {
    Move-Item "MD" "$localFolder\documentacion\MD" -Force
    Write-Host "Movido: carpeta MD completa" -ForegroundColor White
}

# Mover archivos de documentacion individual
$docsToMove = @(
    "CHECKLIST_VIDEO.md",
    "GUIA_VIDEO_DEMOSTRACION.md", 
    "REPORTE_PRUEBAS_COMPLETO.md",
    "SCRIPT_COMANDOS_VIDEO.md",
    "PROYECTO_COMPLETADO.md",
    "diagnostico_modal.md"
)

foreach ($doc in $docsToMove) {
    if (Test-Path $doc) {
        Move-Item $doc "$localFolder\documentacion\" -Force
        Write-Host "Movido: $doc" -ForegroundColor White
    }
}

# Mover scripts de prueba
$scriptsToMove = @(
    "demo_script.ps1",
    "demo_script_clean.ps1", 
    "demo_quick.ps1",
    "demo_quick_clean.ps1",
    "prepare_demo.ps1",
    "prepare_demo_clean.ps1",
    "validate_demo.ps1",
    "verify_server.ps1",
    "setup_github_pages.ps1",
    "cerrar_proyecto.ps1",
    "limpiar_repositorio.ps1"
)

# Mover todos los archivos test_*.ps1
Get-ChildItem "test_*.ps1" | ForEach-Object {
    Move-Item $_.FullName "$localFolder\scripts_prueba\" -Force
    Write-Host "Movido: $($_.Name)" -ForegroundColor White
}

foreach ($script in $scriptsToMove) {
    if (Test-Path $script) {
        Move-Item $script "$localFolder\scripts_prueba\" -Force
        Write-Host "Movido: $script" -ForegroundColor White
    }
}

# Mover archivos de trabajo
$workFiles = @(
    "Credenciales para pruebas.txt",
    "app_backup.js",
    "app_clean.js", 
    "employees.xlsx",
    "jest-report.json",
    "test-report.html",
    "railway.env"
)

foreach ($file in $workFiles) {
    if (Test-Path $file) {
        Move-Item $file "$localFolder\archivos_trabajo\" -Force
        Write-Host "Movido: $file" -ForegroundColor White
    }
}

# Actualizar gitignore
Write-Host "Actualizando .gitignore..." -ForegroundColor Yellow
Add-Content ".gitignore" ""
Add-Content ".gitignore" "# Archivos internos locales"
Add-Content ".gitignore" "ARCHIVOS_INTERNOS_LOCAL/"
Add-Content ".gitignore" "*.local"
Add-Content ".gitignore" "temp_*"

Write-Host ""
Write-Host "LIMPIEZA COMPLETADA" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Archivos principales que QUEDAN para evaluacion:" -ForegroundColor Cyan
Write-Host "- README.md (documentacion principal)" -ForegroundColor White
Write-Host "- package.json (dependencias)" -ForegroundColor White
Write-Host "- app.js (aplicacion principal)" -ForegroundColor White
Write-Host "- config/ (configuracion base de datos)" -ForegroundColor White
Write-Host "- models/ (modelos de datos)" -ForegroundColor White
Write-Host "- public/ (frontend completo)" -ForegroundColor White
Write-Host "- tests/ (pruebas automatizadas)" -ForegroundColor White
Write-Host "- .env.example (ejemplo configuracion)" -ForegroundColor White
Write-Host "- Archivos deployment (Procfile, railway.json)" -ForegroundColor White
Write-Host "- Archivos seed y ejemplos" -ForegroundColor White
Write-Host ""
Write-Host "Archivos internos guardados en: $localFolder" -ForegroundColor Yellow
Write-Host ""
Write-Host "SIGUIENTE PASO: Hacer commit y push a GitHub" -ForegroundColor Cyan
