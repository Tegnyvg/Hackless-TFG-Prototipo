# ✅ CHECKLIST PRE-GRABACIÓN - VIDEO DEMOSTRACIÓN

## 🎯 PREPARACIÓN TÉCNICA

### 🖥️ **Sistema y Entorno**
- [ ] Servidor Hackless ejecutándose en puerto 3000
- [ ] Base de datos MySQL funcionando correctamente
- [ ] VS Code abierto con proyecto Hackless
- [ ] PowerShell preparado para comandos
- [ ] Navegador con pestañas preparadas

### 📁 **Archivos y Documentación**
- [ ] GUIA_VIDEO_DEMOSTRACION.md abierto
- [ ] SCRIPT_COMANDOS_VIDEO.md listo para copiar
- [ ] REPORTE_PRUEBAS_COMPLETO.md visible
- [ ] app.js principal abierto en VS Code
- [ ] Modelos de base de datos visibles

### 🌐 **URLs Pre-cargadas en Pestañas**
- [ ] http://localhost:3000/index.html (Página principal)
- [ ] http://localhost:3000/registro.html (Registro)
- [ ] http://localhost:3000/login.html (Login)
- [ ] http://localhost:3000/escritorio.html (Dashboard)
- [ ] http://localhost:3000/nomina.html (Nómina)
- [ ] http://localhost:3000/documents.html (Documentos)
- [ ] http://localhost:3000/solicitudes-demo.html (Solicitudes)

---

## 🎬 CONFIGURACIÓN DE GRABACIÓN

### 📹 **Software de Grabación**
- [ ] OBS Studio configurado (recomendado)
- [ ] Resolución: 1920x1080 (Full HD)
- [ ] Frame rate: 30 FPS mínimo
- [ ] Audio del micrófono activado
- [ ] Audio del sistema desactivado (evitar ruidos)

### 🎙️ **Audio**
- [ ] Micrófono funcionando correctamente
- [ ] Prueba de audio realizada
- [ ] Ambiente silencioso
- [ ] Velocidad de habla moderada y clara

### 🖱️ **Configuración de Pantalla**
- [ ] Resolución de pantalla optimizada
- [ ] Zoom del navegador al 100%
- [ ] Zoom de VS Code legible (120-130%)
- [ ] Cursor visible y destacado
- [ ] Notificaciones del sistema desactivadas

---

## 📝 CONTENIDO PREPARADO

### 💾 **Datos de Prueba Listos**
- [ ] Usuarios de ejemplo para registro
- [ ] Credenciales para login
- [ ] Datos para solicitud de demo
- [ ] Información académica del profesor

### 🧪 **Comandos PowerShell Preparados**
- [ ] Comando de conectividad copiado
- [ ] Comandos de registro de usuarios
- [ ] Comandos de login
- [ ] Comandos de consulta de datos
- [ ] Comandos de verificación del sistema

### 📄 **Scripts y Notas**
- [ ] Guión de presentación impreso/visible
- [ ] Puntos clave destacados
- [ ] Tiempo estimado por sección
- [ ] Frases de transición preparadas

---

## 🎯 VERIFICACIÓN FUNCIONAL

### ⚡ **Pruebas Rápidas Pre-Grabación**
- [ ] Servidor responde en http://localhost:3000
- [ ] Endpoint /test funciona correctamente
- [ ] Registro de usuario exitoso
- [ ] Login de usuario exitoso
- [ ] Login de administrador exitoso
- [ ] Interfaces cargan sin errores
- [ ] Base de datos responde correctamente

### 🔧 **Comandos de Verificación**
```powershell
# Verificar servidor
Invoke-RestMethod -Uri "http://localhost:3000/test" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"mensaje":"Pre-test"}'

# Verificar usuarios
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET

# Verificar documentos
Invoke-RestMethod -Uri "http://localhost:3000/documents" -Method GET
```

---

## 🎪 ASPECTOS DE PRESENTACIÓN

### 🗣️ **Comunicación**
- [ ] Tono profesional y académico
- [ ] Explicaciones técnicas claras
- [ ] Términos apropiados para evaluación
- [ ] Velocidad de habla adecuada
- [ ] Pausas estratégicas para demostrar

### 📊 **Contenido a Destacar**
- [ ] Arquitectura MVC implementada
- [ ] Seguridad robusta con 2FA
- [ ] API RESTful completa
- [ ] Frontend responsivo
- [ ] Base de datos normalizada
- [ ] Manejo de errores robusto
- [ ] Validaciones completas
- [ ] Código limpio y documentado

### 💼 **Aspectos Académicos**
- [ ] Mencionar tecnologías utilizadas
- [ ] Explicar decisiones de diseño
- [ ] Destacar buenas prácticas
- [ ] Mostrar calidad del código
- [ ] Demostrar funcionalidad completa

---

## 🕐 CRONOGRAMA DEL VIDEO

### **Distribución de Tiempo (10 minutos total)**
- [ ] **Minuto 1-2:** Introducción y estructura del proyecto
- [ ] **Minuto 3-4:** Demostración del backend (APIs)
- [ ] **Minuto 5-7:** Recorrido por interfaces frontend
- [ ] **Minuto 8-9:** Características técnicas avanzadas
- [ ] **Minuto 10:** Conclusión y resumen de logros

### **Checkpoints de Tiempo**
- [ ] ⏰ 2 min: Backend funcionando
- [ ] ⏰ 4 min: APIs probadas
- [ ] ⏰ 7 min: Frontend demostrado
- [ ] ⏰ 9 min: Aspectos técnicos explicados
- [ ] ⏰ 10 min: Conclusión completa

---

## 🆘 PLAN B - CONTINGENCIAS

### 🔧 **Si algo falla durante la grabación:**
- [ ] Comandos de reinicio preparados
- [ ] Servidor de respaldo listo
- [ ] Capturas de pantalla como backup
- [ ] Script alternativo más corto
- [ ] Puntos clave sin demostración técnica

### 🎬 **Alternativas de Demostración:**
- [ ] Screenshots de funcionalidades
- [ ] Explicación de código sin ejecución
- [ ] Presentación del reporte de pruebas
- [ ] Revisión de documentación técnica

---

## ✅ CHECKLIST FINAL

### **Antes de iniciar grabación:**
- [ ] Todo funcionando correctamente
- [ ] Audio y video configurados
- [ ] Comandos y datos preparados
- [ ] Tiempo estimado confirmado
- [ ] Backup plan listo

### **Durante la grabación:**
- [ ] Hablar claro y pausado
- [ ] Mostrar funcionalidades paso a paso
- [ ] Explicar aspectos técnicos
- [ ] Mantener ritmo dinámico
- [ ] Destacar calidad profesional

### **Después de la grabación:**
- [ ] Revisar calidad de audio/video
- [ ] Verificar que se cubrieron todos los puntos
- [ ] Editar si es necesario
- [ ] Formato final apropiado para entrega

---

**🎯 OBJETIVO FINAL:** Video de demostración profesional que muestre competencias técnicas completas y calidad de desarrollo del Sistema Hackless.

**⭐ RESULTADO ESPERADO:** Evaluación académica exitosa demostrando dominio de tecnologías web, arquitectura de software y desarrollo full-stack.
