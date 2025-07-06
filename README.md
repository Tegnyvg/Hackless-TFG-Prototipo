# Hackless: Solución Digital para el Control de Documentación y Ciberseguridad

## 📋 Descripción

**Hackless** es una solución digital integral diseñada para el control de documentación y ciberseguridad en PyMEs industriales vinculadas al sector hidrocarburífero. Este prototipo funcional implementa un sistema web robusto que permite la gestión centralizada de documentos, control de acceso de usuarios, y monitoreo de seguridad mediante herramientas modernas de desarrollo web.

La aplicación resuelve la problemática de la falta de digitalización en la gestión documental y los riesgos de ciberseguridad en pequeñas y medianas empresas del sector industrial, proporcionando una plataforma segura, escalable y fácil de usar.

## 🎯 Objetivo del Prototipo

Desarrollar un sistema web funcional que demuestre las capacidades core de una solución de gestión documental y ciberseguridad, incluyendo:

- ✅ Sistema de autenticación seguro con 2FA
- ✅ Gestión de usuarios con roles diferenciados
- ✅ Carga y administración de documentos digitales
- ✅ Interfaz web moderna y responsive
- ✅ API REST para integración futura
- ✅ Procesamiento de archivos Excel para gestión de nóminas

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL/MariaDB** - Base de datos relacional
- **Multer** - Gestión de archivos
- **bcryptjs** - Encriptación de contraseñas
- **Speakeasy** - Autenticación de dos factores (2FA)
- **Nodemailer** - Envío de correos electrónicos
- **XLSX** - Procesamiento de archivos Excel

### Frontend
- **HTML5** - Estructura web
- **CSS3** - Estilos y diseño responsive
- **JavaScript ES6+** - Lógica del frontend
- **Bootstrap** - Framework CSS

### Herramientas de Desarrollo
- **Jest** - Testing framework
- **Supertest** - Pruebas de API
- **Git** - Control de versiones

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **XAMPP** o **MySQL** instalado y configurado
- **Git** para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Tegnyg/Hackless-TFG-Prototipo.git
   cd hackless-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Iniciar XAMPP y activar MySQL/MariaDB
   - Crear una base de datos llamada `hackless_db`
   - Configurar usuario `root` con contraseña (o sin contraseña según tu configuración)

4. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=hackless_db
   DB_PORT=3306
   SESSION_SECRET=tu_clave_secreta_session
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_app
   ```

5. **Ejecutar seeders para datos de prueba (opcional)**
   ```bash
   # Solo administradores
   node seedAdmins.js
   
   # O todos los usuarios
   node seedUsers.js
   ```

6. **Iniciar el servidor**
   ```bash
   node app.js
   ```

7. **Acceder a la aplicación**
   - Abrir navegador y dirigirse a: http://localhost:3000/index.html
   - Para login directo: http://localhost:3000/login.html

## 🔑 Credenciales de Acceso para Demo

### Usuario Administrador Principal
- **Email:** `admin@hackless.com`
- **Contraseña:** `AdminPass123!`
- **Rol:** Administrador

### Usuario Demo
- **Email:** `demo@hackless.com`
- **Contraseña:** `DemoPass123!`
- **Rol:** Administrador

*Nota: Estas credenciales están disponibles después de ejecutar el seeder de administradores.*

## 🎥 Video Demostración

🎬 **[Enlace al Video Demo](ENLACE_PENDIENTE)**

*El video de demostración mostrará todas las funcionalidades implementadas y el flujo completo de la aplicación.*

## 🌐 Demo en Línea

🔗 **[Aplicación en Línea](https://hackless-backend-production.up.railway.app)**

*Prototipo desplegado en Railway.app para demostración del TFG*

## ⚡ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- ✅ Login seguro con validación
- ✅ Registro de nuevos usuarios
- ✅ Recuperación de contraseñas vía email
- ✅ Autenticación de dos factores (2FA) con QR
- ✅ Gestión de sesiones seguras

### 👥 Gestión de Usuarios
- ✅ Perfiles de usuario diferenciados
- ✅ Roles y permisos (admin/empleado/supervisor)
- ✅ Listado y administración de usuarios
- ✅ Edición de información personal

### �‍♀️ Sistema RRHH - Gestión de Empleados
- ✅ **Carga Masiva**: Subida de empleados vía Excel/CSV
- ✅ **Carga Manual**: Formulario individual con validaciones
- ✅ **Plantillas**: Descarga de formato estándar y ejemplos
- ✅ **Validaciones**: Email único, campos obligatorios
- ✅ **Feedback**: Estadísticas detalladas y manejo de errores
- ✅ **Campos**: Nombre, Email, Rol, Puesto, Área, Teléfono
- ✅ **Contraseñas**: Generación automática de credenciales temporales

### �📄 Gestión Documental
- ✅ Carga de documentos con archivos adjuntos
- ✅ Listado y visualización de documentos
- ✅ Categorización y metadatos
- ✅ Control de acceso por usuario

### 📊 Gestión de Nóminas
- ✅ Visualización tabular de empleados
- ✅ Integración con sistema de carga RRHH
- ✅ Datos completos: contacto, rol, área, puesto
- ✅ Exportación de reportes

### 🌐 Interfaz Web
- ✅ Diseño responsive y moderno
- ✅ Navegación intuitiva
- ✅ Dashboards informativos
- ✅ Formularios con validación

### 📝 Solicitudes de Demo
- ✅ Formulario de contacto funcional
- ✅ Gestión de solicitudes de demostración
- ✅ Panel administrativo de seguimiento

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Generar reporte HTML de pruebas
npm run test
```

Los reportes se generan en `test-report.html` en la raíz del proyecto.

## 📁 Estructura del Proyecto

```
hackless-backend/
├── config/              # Configuración de base de datos
├── models/              # Modelos de Sequelize
├── public/              # Archivos estáticos del frontend
│   ├── css/            # Hojas de estilo
│   ├── js/             # Scripts del frontend
│   └── images/         # Imágenes y recursos
├── uploads/            # Archivos subidos por usuarios
├── tests/              # Pruebas automatizadas
├── MD/                 # Documentación del proyecto
├── app.js              # Servidor principal
├── package.json        # Dependencias del proyecto
└── README.md           # Este archivo
```

## 🚧 Estado del Desarrollo

Este es un **prototipo funcional** desarrollado como Trabajo Final de Grado. Las funcionalidades core están implementadas y son completamente operativas para demostración y pruebas.

### Próximas Mejoras Potenciales
- 🔄 Integración con sistemas externos
- 📱 Aplicación móvil
- 🔍 Búsqueda avanzada de documentos
- 📈 Analytics y reportes avanzados
- 🛡️ Mejoras adicionales de seguridad

## 👨‍💻 Autor

**Verónica García**  
Legajo: VINF01264  
Trabajo Final de Grado - Universidad Siglo 21  
Año: 2025

---

## 📞 Contacto

Para consultas sobre el proyecto, demostración o colaboración:
- 📧 Email: veronicaandrea.garcia@gmail.com
- 🔗 LinkedIn: [www.linkedin.com/in/verónicaandreagarcía](https://www.linkedin.com/in/verónicaandreagarcía)
- 🐙 GitHub: [Tegnyg](https://github.com/Tegnyg)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos como parte de un Trabajo Final de Grado.

---

*⭐ Si este proyecto te resulta útil, no dudes en darle una estrella en GitHub*
