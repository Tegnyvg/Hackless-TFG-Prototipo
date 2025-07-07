# Script final para commit y cierre del proyecto
Write-Host "FINALIZACION DEL PROYECTO HACKLESS" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta
Write-Host ""

# Verificar estado de git
Write-Host "Verificando estado de Git..." -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "Cambios detectados en el repositorio:" -ForegroundColor Cyan
        git status --short
    } else {
        Write-Host "No hay cambios pendientes" -ForegroundColor Green
    }
} catch {
    Write-Host "Error: No se puede verificar Git. Asegurate de estar en un repositorio." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "RESUMEN DE LIMPIEZA REALIZADA:" -ForegroundColor Cyan
Write-Host "- Carpeta MD movida a ARCHIVOS_INTERNOS_LOCAL" -ForegroundColor White
Write-Host "- Scripts de prueba movidos localmente" -ForegroundColor White
Write-Host "- Archivos de desarrollo interno movidos" -ForegroundColor White
Write-Host "- .gitignore actualizado" -ForegroundColor White
Write-Host "- Repositorio listo para evaluacion academica" -ForegroundColor White

Write-Host ""
$continue = Read-Host "Continuar con el commit final? (s/n)"

if ($continue -eq "s" -or $continue -eq "S") {
    Write-Host ""
    Write-Host "Preparando commit final..." -ForegroundColor Yellow
    
    # Agregar cambios
    git add .
    Write-Host "Archivos agregados al staging" -ForegroundColor Green
    
    # Commit con mensaje profesional
    $commitMessage = "feat: Finalizacion del proyecto - Repositorio limpio para evaluacion academica

- Implementacion completa del sistema de gestion documental
- Frontend responsive con interfaces de usuario profesionales  
- Backend robusto con autenticacion y autorizacion
- Carga masiva y manual de empleados
- Gestion documental con validaciones
- Sistema de auditoria y seguimiento
- Deployment funcional en Railway
- Documentacion tecnica y de usuario completa
- Tests automatizados implementados

Proyecto listo para evaluacion del TFG"

    git commit -m $commitMessage
    Write-Host "Commit realizado exitosamente" -ForegroundColor Green
    
    Write-Host ""
    $push = Read-Host "Hacer push a GitHub? (s/n)"
    
    if ($push -eq "s" -or $push -eq "S") {
        git push
        Write-Host "Cambios enviados a GitHub" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "PROYECTO SUBIDO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "============================" -ForegroundColor Green
        
        # Mostrar URLs importantes
        Write-Host ""
        Write-Host "INFORMACION PARA EL PROFESOR:" -ForegroundColor Cyan
        Write-Host "=============================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "REPOSITORIO GITHUB:" -ForegroundColor Yellow
        git remote get-url origin
        Write-Host ""
        Write-Host "APLICACION EN VIVO:" -ForegroundColor Yellow
        Write-Host "https://hackless-backend-production.up.railway.app" -ForegroundColor White
        Write-Host ""
        Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Yellow
        Write-Host "Admin: admin@hackless.com / Admin2024!" -ForegroundColor White
        Write-Host "RRHH:  rrhh@hackless.com / Rrhh2024!" -ForegroundColor White
        Write-Host ""
        Write-Host "DOCUMENTACION:" -ForegroundColor Yellow
        Write-Host "- README.md (documentacion principal del proyecto)" -ForegroundColor White
        Write-Host "- public/ (codigo frontend completo)" -ForegroundColor White
        Write-Host "- app.js (servidor backend principal)" -ForegroundColor White
        Write-Host "- models/ (modelos de base de datos)" -ForegroundColor White
        Write-Host "- tests/ (pruebas automatizadas)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "CERRANDO SERVIDOR..." -ForegroundColor Yellow

# Buscar y cerrar procesos de Node.js
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        Write-Host "Servidor Node.js cerrado" -ForegroundColor Green
    } else {
        Write-Host "No hay procesos Node.js ejecutandose" -ForegroundColor White
    }
} catch {
    Write-Host "Error al cerrar procesos Node.js" -ForegroundColor Red
}

Write-Host ""
Write-Host "PROYECTO HACKLESS COMPLETADO Y ENTREGADO" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "El proyecto esta listo para la evaluacion." -ForegroundColor Cyan
Write-Host "Todos los archivos internos estan seguros en ARCHIVOS_INTERNOS_LOCAL/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Gracias por usar el sistema de desarrollo Hackless!" -ForegroundColor Yellow
