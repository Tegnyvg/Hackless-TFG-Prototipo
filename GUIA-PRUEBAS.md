# 🧪 GUÍA DE PRUEBAS - Hackless TFG Prototipo
## Sistema de Ciberseguridad para PyMEs del Sector Petrolero

### 📋 PRERREQUISITOS

1. **XAMPP iniciado** con MySQL corriendo
2. **Base de datos** `hackless_db` creada
3. **Dependencias** instaladas (`npm install`)

---

## 🔧 INICIALIZACIÓN

### 1. Arrancar el servidor:
```bash
cd "c:\Users\pc\proyectos Vero\Hackless-TFG-Prototipo"
node app.js
```

**✅ Confirmación exitosa:**
```
🚀 Iniciando servidor Hackless...
🔌 Conectando a la base de datos...
Conexión a la base de datos establecida correctamente.
📦 Sincronizando modelos de base de datos...
✅ Base de datos sincronizada correctamente.
🎉 Servidor Hackless ejecutándose exitosamente!
🌐 URL: http://localhost:3000
🛡️ Sistema listo para recibir conexiones
```

---

## 🧪 PRUEBAS FUNCIONALES

### 1️⃣ PRUEBAS DE AUTENTICACIÓN JWT

#### A) Registro de usuario:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"nombre":"Admin Test","correo_electronico":"admin@hackless.com","password":"Admin123!","rol":"administrador"}'
```

**✅ Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "nombre": "Admin Test",
    "correo_electronico": "admin@hackless.com",
    "rol": "administrador"
  }
}
```

#### B) Login con JWT:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"correo_electronico":"admin@hackless.com","password":"Admin123!"}'
```

**✅ Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Admin Test",
    "rol": "administrador"
  }
}
```

**📝 IMPORTANTE:** Guardar el `access_token` para las siguientes pruebas.

---

### 2️⃣ PRUEBAS DEL SIMULADOR DE PHISHING

#### A) Crear campaña de phishing:
```powershell
$token = "TU_ACCESS_TOKEN_AQUI"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    nombre_campana = "Prueba Bancaria"
    template_usado = "banco_falso"
    destinatarios = @("empleado1@empresa.com", "empleado2@empresa.com")
    descripcion = "Simulación de phishing bancario para capacitación"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/phishing/crear-campana" -Method POST -Headers $headers -Body $body
```

**✅ Respuesta esperada:**
```json
{
  "success": true,
  "message": "Campaña de phishing creada exitosamente",
  "campana": {
    "id": 1,
    "nombre_campana": "Prueba Bancaria",
    "estado": "borrador",
    "template_usado": "banco_falso",
    "destinatarios": 2,
    "url_phishing": "http://localhost:3000/phishing/capture/abc123"
  }
}
```

#### B) Iniciar campaña:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/phishing/iniciar-campana/1" -Method POST -Headers $headers
```

#### C) Simular click de empleado:
```powershell
# Visitar la URL de phishing desde un navegador:
# http://localhost:3000/phishing/capture/abc123

# O simular con PowerShell:
Invoke-WebRequest -Uri "http://localhost:3000/phishing/capture/abc123"
```

#### D) Obtener estadísticas de campaña:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/phishing/estadisticas/1" -Headers $headers
```

---

### 3️⃣ PRUEBAS DEL DASHBOARD DE MÉTRICAS

#### A) Obtener métricas generales del dashboard:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/dashboard" -Headers $headers
```

**✅ Datos esperados:**
```json
{
  "success": true,
  "dashboard": {
    "resumen": {
      "total_usuarios": 1,
      "total_campanas": 1,
      "campanas_activas": 1,
      "emails_enviados": 2,
      "clicks_recibidos": 0,
      "credenciales_comprometidas": 0,
      "tasa_vulnerabilidad_general": "0.00",
      "tasa_click_general": "0.00"
    },
    "usuarios_por_rol": [...],
    "campanas_recientes": [...],
    "tendencia_mensual": [...],
    "efectividad_templates": [...]
  }
}
```

#### B) Métricas específicas de campaña:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/campaign/1" -Headers $headers
```

#### C) Reporte ejecutivo de seguridad:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/security-report" -Headers $headers
```

---

### 4️⃣ PRUEBAS DEL FRONTEND

#### A) Acceder al dashboard visual:
1. Abrir navegador en: `http://localhost:3000/dashboard-metricas.html`
2. **Si no hay token:** será redirigido a login
3. **Con token válido:** verá el dashboard con gráficos interactivos

#### B) Probar simulador de phishing:
1. Ir a: `http://localhost:3000/simulador-phishing.html`
2. Crear nueva campaña desde la interfaz
3. Ver métricas en tiempo real

#### C) Probar autenticación JWT:
1. Ir a: `http://localhost:3000/test-jwt.html`
2. Registrar nuevo usuario
3. Hacer login y obtener token
4. Probar endpoints protegidos

---

### 5️⃣ PRUEBAS DE SEGURIDAD

#### A) Acceso sin token (debería fallar):
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/dashboard"
# Resultado esperado: Error 401 Unauthorized
```

#### B) Token inválido (debería fallar):
```powershell
$badHeaders = @{
    "Authorization" = "Bearer token_invalido"
    "Content-Type" = "application/json"
}
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/dashboard" -Headers $badHeaders
# Resultado esperado: Error 401 Token inválido
```

#### C) Acceso a endpoint de administrador sin permisos:
```powershell
# Con usuario rol 'empleado', intentar acceder a reporte ejecutivo
Invoke-WebRequest -Uri "http://localhost:3000/api/metrics/security-report" -Headers $headers
# Resultado esperado: Error 403 Forbidden
```

---

## 📊 VERIFICACIÓN DE CARACTERÍSTICAS

### ✅ Autenticación JWT:
- [x] Registro de usuarios con hash bcrypt
- [x] Login con generación de tokens JWT
- [x] Refresh de tokens automático
- [x] Middleware de verificación en todas las rutas protegidas
- [x] Control de acceso por roles

### ✅ Simulador de Phishing:
- [x] Creación de campañas con templates
- [x] Envío simulado de emails
- [x] Captura de clicks y credenciales
- [x] Tracking detallado por empleado
- [x] Cálculo de métricas de vulnerabilidad
- [x] Estados de campaña (borrador/activa/finalizada)

### ✅ Dashboard de Métricas:
- [x] KPIs en tiempo real
- [x] Gráficos interactivos con Chart.js
- [x] Análisis temporal (tendencias mensuales)
- [x] Breakdown por área/departamento
- [x] Reportes ejecutivos automáticos
- [x] Interface responsive y actualización automática

### ✅ Seguridad:
- [x] Autenticación obligatoria en endpoints sensibles
- [x] Validación de roles y permisos
- [x] Encriptación de contraseñas con bcrypt
- [x] Tokens JWT con expiración corta (15min)
- [x] Refresh tokens para sesiones largas
- [x] Sanitización de inputs

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: "Cannot GET /api/metrics/dashboard"
**Solución:** Verificar que:
1. El servidor esté corriendo
2. Las rutas estén cargadas correctamente
3. El middleware JWT esté funcionando

### Problema: Error de conexión a base de datos
**Solución:** 
1. Verificar que XAMPP/MySQL esté corriendo
2. Comprobar credenciales en `config/database.js`
3. Crear la base de datos `hackless_db` manualmente

### Problema: Frontend no carga gráficos
**Solución:**
1. Verificar que Chart.js esté cargando
2. Comprobar que los endpoints de API respondan
3. Revisar la consola del navegador para errores

---

## 📋 CHECKLIST DE PRUEBAS COMPLETO

### Pre-requisitos:
- [ ] XAMPP iniciado
- [ ] Base de datos creada
- [ ] Servidor Node.js corriendo
- [ ] Dependencias instaladas

### Autenticación:
- [ ] Registro de usuario exitoso
- [ ] Login con JWT funcional
- [ ] Token válido recibido
- [ ] Middleware protegiendo rutas

### Phishing:
- [ ] Creación de campaña
- [ ] Inicio de campaña
- [ ] Captura de clicks
- [ ] Generación de estadísticas

### Dashboard:
- [ ] Métricas generales
- [ ] Métricas por campaña
- [ ] Reportes ejecutivos
- [ ] Frontend visual funcional

### Seguridad:
- [ ] Acceso denegado sin token
- [ ] Control de roles funcionando
- [ ] Refresh de tokens automático

---

**🎉 ¡Sistema completamente funcional y listo para demostración!**