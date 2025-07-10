# Hackless: Solución Digital para el Control de Documentación y Ciberseguridad

[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)](https://github.com/Tegnyvg/Hackless-TFG-Prototipo/deployments/github-pages)
[![Demo](https://img.shields.io/badge/Demo-Railway-green)](https://hackless-backend-production.up.railway.app)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Descripción

**Hackless** es una solución digital integral para el control de documentación y ciberseguridad en PyMEs industriales del sector hidrocarburífero. Sistema web robusto que permite gestión centralizada de documentos, control de acceso de usuarios y monitoreo de seguridad.

**Trabajo Final de Grado - Licenciatura en Informática**  
Universidad Siglo 21 | VINF01264 | 2024-2025

## 🌐 Demos y Documentación

| Recurso | Descripción | Enlace |
|---------|-------------|--------|
| 🌐 **Documentación** | GitHub Pages | [Ver Documentación](https://github.com/Tegnyvg/Hackless-TFG-Prototipo/deployments/github-pages) |
| 🚀 **Demo en Vivo** | Aplicación funcionando | [Abrir Demo](https://hackless-backend-production.up.railway.app) |
| 📋 **Presentación** | Prototipo TFG | [Ver Presentación](https://tegnyvg.github.io/Hackless-TFG-Prototipo/) |

## 🎯 Características Principales

<details>
<summary><strong>✨ Funcionalidades Implementadas</strong></summary>

### 🔐 Sistema de Autenticación

- ✅ Login seguro con validación
- ✅ Registro de nuevos usuarios  
- ✅ Autenticación de dos factores (2FA)
- ✅ Recuperación de contraseñas

### 👥 Gestión de Usuarios

- ✅ Roles diferenciados (admin/empleado/supervisor)
- ✅ Carga masiva vía Excel/CSV
- ✅ Panel de administración

### 📄 Gestión Documental

- ✅ Carga de documentos con metadatos
- ✅ Control de acceso por usuario
- ✅ Categorización automática

### 📊 Sistema RRHH

- ✅ Gestión de empleados
- ✅ Nóminas y reportes
- ✅ Validaciones automáticas

</details>

<details>
<summary><strong>🚀 Tecnologías Utilizadas</strong></summary>

### Backend

- **Node.js + Express.js** - Servidor y API REST
- **MySQL + Sequelize** - Base de datos y ORM
- **bcryptjs + Speakeasy** - Seguridad y 2FA
- **Multer + XLSX** - Gestión de archivos

### Frontend

- **HTML5 + CSS3 + JavaScript** - Interfaz responsive
- **Bootstrap** - Framework CSS

### DevOps

- **Railway.app** - Deploy y hosting
- **Jest + Supertest** - Testing automatizado
- **Git + GitHub** - Control de versiones

</details>

<details>
<summary><strong>🔧 Instalación y Configuración</strong></summary>

### Prerrequisitos

- Node.js (v16+)
- MySQL/XAMPP
- Git

### Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/Tegnyvg/Hackless-TFG-Prototipo.git
cd hackless-backend

# Instalar dependencias
npm install

# Configurar base de datos
# Crear BD: hackless_db en MySQL

# Variables de entorno (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=hackless_db

# Ejecutar seeders (opcional)
node seedAdmins.js

# Iniciar servidor
node app.js
```

### Credenciales Demo

- **Admin:** admin@hackless.com / AdminPass123!
- **Demo:** demo@hackless.com / DemoPass123!

</details>

## 🎓 Información Académica

<details>
<summary><strong>📚 Trabajo Final de Grado</strong></summary>

### Información Institucional

- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Materia:** Trabajo Final de Grado - VINF01264
- **Modalidad:** A Distancia
- **Año Académico:** 2024-2025
- **Estudiante:** Verónica García

### Problemática Abordada

Las PyMEs industriales del sector hidrocarburífero enfrentan:

- Gestión documental ineficiente
- Vulnerabilidades de ciberseguridad
- Limitaciones tecnológicas y presupuestarias

### Solución Propuesta

Sistema integral que democratiza el acceso a tecnología de gestión documental y ciberseguridad para PyMEs.

</details>

<details>
<summary><strong>📊 Métricas del Proyecto</strong></summary>

| Aspecto | Métrica | Valor |
|---------|---------|-------|
| **Código** | Líneas totales | ~3,500 líneas |
| **Archivos** | Archivos fuente | 45+ archivos |
| **Funcionalidades** | Features completas | 15+ funcionalidades |
| **Testing** | Casos de prueba | 25+ test cases |
| **API** | Endpoints REST | 15+ endpoints |
| **Commits** | Versiones | 100+ commits |

### Competencias Técnicas Demostradas

- **Full-Stack Development:** Node.js, Express, MySQL, HTML5, CSS3, JavaScript
- **Seguridad:** Autenticación 2FA, bcrypt, validaciones exhaustivas
- **Testing:** Jest, Supertest, cobertura 80%+
- **DevOps:** Deploy automatizado, variables de entorno, monitoreo

</details>

<details>
<summary><strong>📁 Anexos Académicos</strong></summary>

### Documentación Disponible

Los anexos están en [`anexos_tfg_digitales/`](./anexos_tfg_digitales/):

1. **[📋 Casos de Prueba](./anexos_tfg_digitales/casos_de_prueba.html)** - Test cases completos
2. **[📊 Cronograma Sprints](./anexos_tfg_digitales/cronograma_sprints.html)** - Metodología ágil
3. **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)** - Procesos de negocio
4. **[📖 Diccionario Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)** - Esquema BD
5. **[⚙️ Doc. Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)** - Arquitectura
6. **[✅ Formularios](./anexos_tfg_digitales/formularios_validacion.html)** - Validaciones UI
7. **[🎨 Mockups](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseños UX/UI
8. **[📝 Reuniones](./anexos_tfg_digitales/reuniones_equipo.html)** - Actas proyecto

**[📑 Índice Completo](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación de anexos

</details>

## 📡 API y Documentación Técnica

<details>
<summary><strong>🔧 Endpoints API REST</strong></summary>

### Principales Endpoints

- **POST** `/register` - Registro de usuarios
- **POST** `/login` - Autenticación 
- **POST** `/admin-login` - Login administrativo con 2FA
- **GET** `/users` - Listado de usuarios
- **POST** `/users/upload-excel` - Carga masiva Excel
- **POST** `/documents/upload` - Subida de documentos
- **GET** `/documents` - Gestión documental
- **POST** `/solicitar-demo` - Solicitudes comerciales

### Seguridad Implementada

- **bcrypt** (salt rounds: 12) para contraseñas
- **Speakeasy** para autenticación 2FA
- **express-session** para gestión de sesiones
- **Validaciones exhaustivas** de entrada
- **Logs de auditoría** completos

</details>

## 👨‍💻 Información de Contacto

**Verónica García**  
Licenciatura en Informática - Universidad Siglo 21  
VINF01264 | 2024-2025

📧 **Contacto:** veronicaandrea.garcia@gmail.com  
🌐 **GitHub:** [@Tegnyvg](https://github.com/Tegnyvg)  
💼 **LinkedIn:** [verónicaandreagarcía](https://linkedin.com/in/verónicaandreagarcía)

---

## 📄 Licencia

**MIT License** - Desarrollado con fines académicos  
*© 2024 Verónica García - Universidad Siglo 21 - Licenciatura en Informática*
