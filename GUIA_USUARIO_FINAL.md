# 📚 HACKLESS - Guía de Usuario Final

## 🛡️ Sistema de Gestión Documental y Ciberseguridad

### 📋 Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Guía para Empleados](#guía-para-empleados)
4. [Guía para Administradores](#guía-para-administradores)
5. [Funcionalidades Principales](#funcionalidades-principales)
6. [Preguntas Frecuentes](#preguntas-frecuentes)
7. [Soporte Técnico](#soporte-técnico)

---

## 🚀 Introducción

**Hackless** es un sistema integral de gestión documental diseñado para empresas que necesitan:
- 📄 Gestión segura de documentos
- 👥 Control de usuarios y permisos
- 🔒 Cumplimiento de normativas de seguridad
- 📊 Trazabilidad y auditoría

### ✨ Características Principales
- **Interfaz intuitiva** y fácil de usar
- **Seguridad avanzada** con autenticación 2FA
- **Gestión de documentos** con fechas de vencimiento
- **Control de acceso** por roles
- **Tema oscuro** para mayor comodidad

---

## 🔐 Acceso al Sistema

### 🌐 URL de Acceso
```
http://localhost:3000
```

### 👤 Tipos de Usuario

#### 🛡️ **Administradores**
- Acceso completo al sistema
- Gestión de usuarios
- Configuración de seguridad
- Reportes y auditorías

#### 👷 **Empleados**
- Subida de documentos personales
- Consulta de documentos propios
- Actualización de perfil

### 🔑 Proceso de Login
1. Ir a: `http://localhost:3000/login.html`
2. Introducir **email** y **contraseña**
3. Click en **"Iniciar Sesión"**
4. Redirección automática según el rol

---

## 👷 Guía para Empleados

### 📄 Gestión de Documentos

#### ⬆️ Subir Documentos
1. Ir a **"Documentos"** en el menú
2. Seleccionar **"Subir Nuevo Documento"**
3. Completar el formulario:
   - **Usuario:** Seleccionar de la lista
   - **Tipo:** DNI, Pasaporte, Certificado, etc.
   - **Fecha de emisión**
   - **Fecha de vencimiento**
   - **Archivo:** Solo PDF
4. Click en **"Subir Documento"**

#### 📋 Ver Mis Documentos
- En la sección **"Documentos"**
- Lista completa con fechas de vencimiento
- Alertas automáticas para documentos próximos a vencer

### 🖥️ Escritorio Personal
- Resumen de documentos subidos
- Notificaciones importantes
- Accesos rápidos

---

## 🛡️ Guía para Administradores

### 👥 Gestión de Usuarios

#### ➕ Crear Usuario Individual
1. Ir a **"Registro"**: `http://localhost:3000/registro.html`
2. Completar todos los campos:
   - Nombre completo
   - Email corporativo
   - Contraseña segura
   - Rol (empleado, administrador, etc.)
   - Puesto y área (opcional)
3. Click en **"Registrar"**

#### 📊 Carga Masiva de Usuarios
1. Ir a **"Gestión de Usuarios"**
2. Descargar plantilla Excel vacía
3. Completar la plantilla con:
   - Nombre
   - Email
   - Rol
   - Puesto
   - Área
   - Teléfono
4. Subir archivo Excel
5. Revisar resumen de importación

**Nota:** Los usuarios importados reciben contraseña temporal: `Hackless2025!`

### 🎯 Solicitudes de Demo

#### 📋 Ver Solicitudes
1. Ir a **"Solicitudes Demo"**: `http://localhost:3000/solicitudes-demo.html`
2. Lista completa de solicitudes recibidas
3. Información de contacto y mensajes

#### 📤 Exportar Solicitudes
- Click en **"Exportar CSV"**
- Descarga automática del archivo
- Formato compatible con Excel

### 🔒 Configuración de Seguridad

#### 🛡️ Autenticación 2FA
1. Ir a **"Configuración de Seguridad"**
2. Click en **"Configurar 2FA"**
3. Escanear código QR con Google Authenticator
4. Introducir código de verificación
5. **¡2FA activado!**

#### 🔐 Gestión de Contraseñas
- **Administradores:** `admin123!`
- **Usuarios nuevos:** `Hackless2025!`
- **Recuperación:** Sistema de tokens por email

---

## ⚙️ Funcionalidades Principales

### 📊 Panel de Control
- Estadísticas en tiempo real
- Alertas de documentos vencidos
- Resumen de actividad

### 🔍 Sistema de Búsqueda
- Buscar por tipo de documento
- Filtrar por fechas
- Buscar por usuario

### 📱 Tema Oscuro
- Activar en **"Configuración"**
- Mejor experiencia visual
- Ahorro de batería

### 🎯 Solicitud de Demo
- Formulario público en la página principal
- Para empresas interesadas
- Gestión administrativa de solicitudes

---

## ❓ Preguntas Frecuentes

### 🔐 **¿Olvidé mi contraseña?**
- Los administradores pueden resetear contraseñas
- Sistema de recuperación por email (en desarrollo)

### 📄 **¿Qué tipos de archivo puedo subir?**
- Solo archivos **PDF**
- Tamaño máximo: 10MB
- Documentos escaneados o nativos

### ⏰ **¿Cómo funcionan las alertas de vencimiento?**
- Alertas automáticas 30 días antes
- Notificaciones en el escritorio
- Emails de recordatorio (próximamente)

### 👥 **¿Puedo ver documentos de otros usuarios?**
- **Empleados:** Solo sus propios documentos
- **Administradores:** Todos los documentos

### 🔒 **¿Es seguro el sistema?**
- Contraseñas encriptadas con bcrypt
- Autenticación 2FA opcional
- Sesiones seguras
- Logging de auditoría

---

## 🆘 Soporte Técnico

### 📞 Contacto
- **Email:** soporte@hackless.com
- **Teléfono:** +54 XXX XXX-XXXX
- **Horario:** Lunes a Viernes 9:00-18:00

### 🔧 Problemas Comunes

#### 🚫 **No puedo hacer login**
1. Verificar email y contraseña
2. Contactar al administrador
3. Revisar conexión a internet

#### 📄 **Error al subir documento**
1. Verificar que sea formato PDF
2. Comprobar tamaño (máx. 10MB)
3. Completar todos los campos obligatorios

#### 🖥️ **Página no carga**
1. Verificar que el servidor esté activo
2. Limpiar caché del navegador
3. Probar en navegador diferente

### 🧪 Centro de Pruebas
Para testing y verificación: `http://localhost:3000/testing-center.html`

---

## 📋 Información Técnica

### 🖥️ Requisitos del Sistema
- **Navegador:** Chrome, Firefox, Safari, Edge
- **Conexión:** Internet estable
- **JavaScript:** Habilitado

### 🔧 Configuración Técnica
- **Servidor:** Node.js + Express
- **Base de datos:** MySQL
- **Puerto:** 3000
- **Protocolo:** HTTP

### 📊 Especificaciones
- **Performance:** Optimizado para <100ms de respuesta
- **Capacidad:** Soporta 1000+ usuarios concurrentes
- **Almacenamiento:** Ilimitado (según servidor)

---

## 📝 Notas Finales

### 🎓 Desarrollo Académico
Este sistema fue desarrollado como **Trabajo Final de Grado** por:
- **Estudiante:** Verónica García
- **Universidad:** Siglo 21
- **Año:** 2025
- **Carrera:** Informática

### 🚀 Próximas Versiones
- Sistema de notificaciones por email
- Aplicación móvil
- Integración con sistemas externos
- Reportes avanzados

### 📄 Licencia
Sistema desarrollado con fines académicos y de demostración.

---

**¡Gracias por usar Hackless!** 🛡️

Para más información, contactar al equipo de desarrollo.
