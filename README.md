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

## 🤖 Servidor MCP

Este proyecto incluye un **servidor MCP (Model Context Protocol)** que permite interactuar con la información del proyecto a través de herramientas de IA como Claude Desktop.

**Características del servidor MCP:**
- 🌤️ Herramientas meteorológicas de demostración
- 🎯 Información del proyecto Hackless accesible via IA
- 📊 Datos del stack tecnológico y funcionalidades

Ver: [`mcp-server/README.md`](mcp-server/README.md) para más detalles.

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
<summary><strong>🏗️ Arquitectura del Sistema</strong></summary>

### 🔧 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (NAVEGADOR)                     │
├─────────────────────────────────────────────────────────────┤
│             HTML5 + CSS3 + JavaScript                      │
│                Bootstrap + SweetAlert2                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 SERVIDOR WEB (Node.js)                     │
├─────────────────────────────────────────────────────────────┤
│   Express.js Framework                                     │
│   ├── Router de Rutas                                      │
│   ├── Middleware de Autenticación                          │
│   ├── Middleware de Sesiones                               │
│   └── Gestión de Archivos (Multer)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL Queries
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                BASE DE DATOS (MySQL)                       │
├─────────────────────────────────────────────────────────────┤
│   Sequelize ORM                                            │
│   ├── Usuarios (users)                                     │
│   ├── Documentos (documents)                               │
│   ├── Empleados (employees)                                │
│   └── Configuraciones (settings)                           │
└─────────────────────────────────────────────────────────────┘
```

### 🛠️ Modelo de Capas

#### **Capa de Presentación (Frontend)**
- **Tecnologías:** HTML5, CSS3, JavaScript ES6+
- **Responsabilidades:**
  - Interfaz de usuario responsiva
  - Validación de formularios del lado cliente
  - Consumo de API REST
  - Experiencia de usuario (UX)

#### **Capa de Lógica de Negocio (Backend)**
- **Tecnologías:** Node.js, Express.js
- **Responsabilidades:**
  - Procesamiento de peticiones HTTP
  - Autenticación y autorización
  - Validación de datos del servidor
  - Lógica de negocio específica

#### **Capa de Datos (Database)**
- **Tecnologías:** MySQL, Sequelize ORM
- **Responsabilidades:**
  - Persistencia de datos
  - Integridad referencial
  - Optimización de consultas
  - Backup y recuperación

### 🔄 Flujo de Datos

```
Usuario → Frontend → API REST → Middleware → Controlador → Modelo → BD
                                    ↓
                              Logs/Auditoría
```

### 🔐 Arquitectura de Seguridad

#### **Niveles de Seguridad Implementados**

1. **Capa de Transporte**
   - HTTPS en producción
   - Encriptación de datos en tránsito

2. **Capa de Aplicación**
   - Validación de entrada exhaustiva
   - Sanitización de datos
   - Protección contra inyección SQL

3. **Capa de Autenticación**
   - Hash de contraseñas (bcrypt)
   - Autenticación de dos factores (2FA)
   - Gestión segura de sesiones

4. **Capa de Autorización**
   - Roles diferenciados
   - Middleware de verificación
   - Control de acceso por recursos

### 📊 Modelo de Base de Datos

#### **Entidades Principales**

```sql
-- Usuarios del sistema
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'empleado', 'supervisor'),
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Empleados de la empresa
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    cargo VARCHAR(100),
    fecha_ingreso DATE,
    salario DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentos del sistema
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### **Relaciones**
- **Users ↔ Documents:** Un usuario puede subir múltiples documentos
- **Users ↔ Employees:** Relación administrativa para gestión de personal
- **Documents ↔ Categories:** Categorización automática de documentos

### 🚀 Arquitectura de Despliegue

#### **Entorno de Desarrollo**
```
localhost:3000 → Node.js Server → MySQL Local (XAMPP)
```

#### **Entorno de Producción**
```
Railway.app → Node.js Container → MySQL Database Service
```

#### **Componentes de Producción**
- **Servidor Web:** Railway.app con Node.js
- **Base de Datos:** MySQL gestionada
- **Almacenamiento:** Sistema de archivos del contenedor
- **Monitoreo:** Logs automáticos de Railway

### 📈 Escalabilidad y Performance

#### **Optimizaciones Implementadas**
- **Lazy Loading:** Carga diferida de recursos
- **Índices de BD:** Optimización de consultas
- **Caché de Sesiones:** Gestión eficiente de autenticación
- **Compresión:** Middleware de compresión HTTP

#### **Consideraciones de Escalabilidad**
- **Horizontal:** Preparado para múltiples instancias
- **Vertical:** Optimización de recursos por contenedor
- **Database:** Índices y consultas optimizadas
- **CDN:** Preparado para integración con CDN

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión documental
- **Profesionalismo:** Código limpio, documentado y desplegado

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
<summary><strong>📁 Anexos Académicos Completos</strong></summary>

### 📚 Documentación TFG - Universidad Siglo 21

Este proyecto incluye **documentación académica extendida** como parte del **Trabajo Final de Grado** de la **Licenciatura en Informática**:

#### 📑 Índice General de Anexos

**[00_INDICE_GENERAL](./anexos_tfg_digitales/indice_anexos_moderno.html)** - Navegación completa de toda la documentación académica

#### 📋 Anexos Digitales Principales

1. **[01_README_ANEXOS](./anexos_tfg_digitales/README.md)** - Introducción y guía de anexos
2. **[02_README_PRINCIPAL](./README.md)** - Documentación principal del proyecto
3. **[03_ANALISIS_REQUISITOS](./anexos_tfg_digitales/analisis_requisitos.html)** - Análisis completo de requisitos
4. **[04_DISENO_UX](./anexos_tfg_digitales/mockups_interfaces.html)** - Diseño UX/UI y wireframes
5. **[05_GUIA_INSTALACION](./anexos_tfg_digitales/documentacion_tecnica.html)** - Guía técnica de instalación
6. **[06_MANUAL_USUARIO](./anexos_tfg_digitales/manual_usuario.html)** - Manual completo de usuario
7. **[07_CASOS_DE_PRUEBA](./anexos_tfg_digitales/casos_de_prueba.html)** - Testing y validación
8. **[08_METRICAS_PERFORMANCE](./anexos_tfg_digitales/metricas_performance.html)** - Análisis de rendimiento
9. **[09_TABLA_ANEXOS_COMPLETA](./anexos_tfg_digitales/tabla_anexos.html)** - Inventario completo
10. **[10_INVENTARIO_ANEXOS](./anexos_tfg_digitales/inventario_anexos.html)** - Lista final de entregables

#### 🔧 Documentación Técnica Detallada

- **[📊 Cronograma de Sprints](./anexos_tfg_digitales/cronograma_sprints.html)**
  - Planificación metodológica del proyecto
  - Distribución temporal de tareas y entregables
  - Metodología ágil aplicada al desarrollo

- **[🔄 Diagramas BPMN](./anexos_tfg_digitales/diagramas_bpmn.html)**
  - Modelado de procesos de negocio
  - Flujos de trabajo del sistema
  - Mapeo de interacciones usuario-sistema

- **[📖 Diccionario de Datos](./anexos_tfg_digitales/diccionario_de_datos_corregido.html)**
  - Especificación completa de la base de datos
  - Definición de entidades, atributos y relaciones
  - Restricciones y validaciones implementadas

- **[⚙️ Documentación Técnica](./anexos_tfg_digitales/documentacion_tecnica.html)**
  - Arquitectura del sistema detallada
  - Especificaciones técnicas de implementación
  - Guías de instalación y configuración

#### 🎨 Diseño y Experiencia de Usuario

- **[🎨 Mockups e Interfaces](./anexos_tfg_digitales/mockups_interfaces.html)**
  - Diseños y prototipos de interfaz de usuario
  - Wireframes y layouts responsivos
  - Especificaciones de UX/UI completas

- **[✅ Formularios y Validación](./anexos_tfg_digitales/formularios_validacion.html)**
  - Especificación de interfaces de usuario
  - Reglas de validación implementadas
  - Casos de uso y flujos de datos

#### 🧪 Testing y Calidad

- **[📋 Casos de Prueba Completos](./anexos_tfg_digitales/casos_de_prueba.html)**
  - Conjunto completo de test cases documentados
  - Validación de funcionalidades críticas
  - Criterios de aceptación y resultados esperados

- **[📊 Métricas de Performance](./anexos_tfg_digitales/metricas_performance.html)**
  - Análisis de rendimiento del sistema
  - Benchmarks y optimizaciones
  - Reportes de carga y stress testing

#### 📝 Gestión de Proyecto

- **[📝 Reuniones de Equipo](./anexos_tfg_digitales/reuniones_equipo.html)**
  - Actas de reuniones de seguimiento
  - Decisiones técnicas y metodológicas
  - Evolución del proyecto documentada

- **[� Inventario de Anexos](./anexos_tfg_digitales/inventario_anexos.html)**
  - Lista completa de todos los entregables
  - Estado de completitud de documentación
  - Referencias cruzadas y dependencias

### 🎓 Marco Académico del TFG

#### Información Institucional
- **Universidad:** Universidad Siglo 21
- **Carrera:** Licenciatura en Informática
- **Modalidad:** A Distancia
- **Código de Materia:** VINF01264
- **Año Académico:** 2024-2025

#### Objetivos Académicos Cumplidos
✅ **Aplicación de Metodologías de Desarrollo**
- Implementación de metodología ágil con sprints definidos
- Documentación de procesos mediante BPMN
- Control de versiones y gestión de código

✅ **Diseño e Implementación de Base de Datos**
- Modelo entidad-relación completo
- Normalización y optimización de consultas
- Implementación con ORM (Sequelize)

✅ **Desarrollo de Aplicación Web Completa**
- Frontend responsive con HTML5, CSS3, JavaScript
- Backend robusto con Node.js y Express
- API REST con documentación completa

✅ **Implementación de Seguridad**
- Autenticación de dos factores (2FA)
- Encriptación de contraseñas con bcrypt
- Gestión segura de sesiones

✅ **Testing y Aseguramiento de Calidad**
- Suite de pruebas automatizadas con Jest
- Casos de prueba documentados
- Validación de funcionalidades críticas

#### Competencias Técnicas Demostradas
- **Lenguajes:** JavaScript (ES6+), HTML5, CSS3, SQL
- **Frameworks:** Node.js, Express.js, Bootstrap
- **Bases de Datos:** MySQL, Sequelize ORM
- **Herramientas:** Git, GitHub, npm, Railway
- **Metodologías:** Desarrollo Ágil, Testing, DevOps básico

#### Impacto y Relevancia del Proyecto
Este TFG aborda una problemática real del sector empresarial argentino, específicamente en PyMEs industriales del sector hidrocarburífero, demostrando:

- **Relevancia Social:** Solución a necesidades concretas de digitalización
- **Viabilidad Técnica:** Implementación con tecnologías actuales y escalables
- **Innovación:** Integración de ciberseguridad en gestión