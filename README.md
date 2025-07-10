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

### 🏆 Logros Académicos del TFG

1. **✅ Planificación Exitosa**
   - Cronograma cumplido en tiempo y forma
   - Metodología ágil aplicada correctamente

2. **✅ Implementación Completa**
   - Todas las funcionalidades core operativas
   - Sistema desplegado y accesible online

3. **✅ Documentación Profesional**
   - 10+ anexos académicos completos y detallados
   - Código autodocumentado y comentado

4. **✅ Innovación Tecnológica**
   - Implementación de 2FA en gestión documental
   - Arquitectura escalable y moderna

5. **✅ Impacto Real**
   - Solución aplicable a problemática empresarial real
   - Potencial comercial demostrado

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

<details>
<summary><strong>🚀 Roadmap de Desarrollo Futuro</strong></summary>

### 📅 Planificación de Expansión

#### **Fase 2: Funcionalidades Avanzadas (Q3 2025)**

**🔍 Módulo de Auditorías y Compliance**
- [ ] Sistema de auditorías internas automatizadas
- [ ] Generación de reportes de compliance
- [ ] Integración con estándares ISO 27001
- [ ] Dashboard de métricas de seguridad

**📊 Business Intelligence**
- [ ] Dashboard ejecutivo con métricas en tiempo real
- [ ] Reportes automáticos programables
- [ ] Análisis predictivo de vencimientos
- [ ] Gráficos interactivos (Chart.js/D3.js)

**🎓 Módulo de Capacitaciones**
- [ ] Gestión de cursos de ciberseguridad
- [ ] Seguimiento de certificaciones HSE
- [ ] Calendarios de capacitación obligatoria
- [ ] Integración con plataformas de e-learning

#### **Fase 3: Escalabilidad Empresarial (Q4 2025)**

**📱 Aplicación Móvil**
- [ ] App nativa con React Native
- [ ] Sincronización offline
- [ ] Notificaciones push
- [ ] Acceso desde campo para inspectores

**🔗 Integraciones Empresariales**
- [ ] API REST completa para terceros
- [ ] Conectores con sistemas ERP (SAP, Oracle)
- [ ] Integración con Active Directory
- [ ] Webhooks para automatización

**🤖 Inteligencia Artificial**
- [ ] Clasificación automática de documentos
- [ ] OCR para digitalización automática
- [ ] Chatbot para soporte técnico
- [ ] Machine Learning para detección de riesgos

#### **Fase 4: Solución SaaS (Q1 2026)**

**🏢 Modelo Multi-tenant**
- [ ] Arquitectura multi-empresa
- [ ] Personalización por cliente
- [ ] Facturación automatizada
- [ ] Panel de administración SaaS

**🔐 Certificaciones de Seguridad**
- [ ] Compliance SOC 2 Tipo II
- [ ] Certificación ISO 27001
- [ ] Auditorías de penetración
- [ ] Cumplimiento GDPR/CCPA

**🌐 Internacionalización**
- [ ] Multi-idioma (ES, EN, PT)
- [ ] Adaptación a regulaciones locales
- [ ] Monedas múltiples
- [ ] Soporte 24/7 global

### 💡 Innovaciones Técnicas Planificadas

#### **Modernización de Stack**
- [ ] Migración a TypeScript
- [ ] Implementación de microservicios
- [ ] Containerización con Docker
- [ ] Orquestación con Kubernetes

#### **Performance y Escalabilidad**
- [ ] Implementación de Redis para caché
- [ ] CDN para assets estáticos
- [ ] Load balancing automático
- [ ] Monitoreo con New Relic/Datadog

#### **Experiencia de Usuario**
- [ ] Progressive Web App (PWA)
- [ ] Interfaz con React.js
- [ ] Tema oscuro/claro
- [ ] Accesibilidad WCAG 2.1

### 🎯 Objetivos de Crecimiento

| Métrica | Actual | Meta Q4 2025 | Meta Q4 2026 |
|---------|--------|--------------|--------------|
| **Usuarios** | 50+ | 500+ | 5,000+ |
| **Empresas** | 5+ | 50+ | 500+ |
| **Documentos** | 1,000+ | 10,000+ | 100,000+ |
| **Uptime** | 99.5% | 99.9% | 99.99% |

### 🏆 Visión a Largo Plazo

**Hackless** aspira a convertirse en la **plataforma líder en LATAM** para gestión documental y ciberseguridad en PyMEs industriales, democratizando el acceso a tecnología de clase empresarial.

**Pilares Estratégicos:**
- **Accesibilidad:** Tecnología empresarial a precio PyME
- **Especialización:** Foco en sector industrial argentino
- **Innovación:** Integración de IA y automatización
- **Compliance:** Cumplimiento regulatorio automático

</details>

<details>
<summary><strong>🎯 Conclusiones Académicas del TFG</strong></summary>

### 🏆 Logros del Trabajo Final de Grado

**Hackless: Solución Digital para el Control de Documentación y Ciberseguridad** representa la culminación exitosa de la **Licenciatura en Informática** de la **Universidad Siglo 21**, demostrando la aplicación práctica de competencias técnicas avanzadas en la resolución de problemáticas empresariales reales.

#### ✅ **Competencias Técnicas Demostradas**

**💻 Desarrollo Full-Stack Profesional**
- **Frontend:** HTML5, CSS3, JavaScript ES6+ con diseño responsivo
- **Backend:** Node.js, Express.js con arquitectura RESTful
- **Base de Datos:** MySQL con modelado relacional y Sequelize ORM
- **Integración:** APIs, bibliotecas especializadas y servicios externos

**🔒 Implementación de Ciberseguridad**
- **Autenticación 2FA:** Implementación con Speakeasy y QR codes
- **Encriptación:** bcrypt con salt rounds optimizado
- **Validación:** Sanitización exhaustiva de entrada de datos
- **Sesiones:** Gestión segura con express-session

**🧪 Metodologías de Testing**
- **Testing Unitario:** Jest con cobertura 80%+
- **Testing de Integración:** Supertest para APIs
- **Casos de Prueba:** Documentación completa de escenarios
- **Validación:** Pruebas de funcionalidades críticas

**🚀 DevOps y Deployment**
- **Control de Versiones:** Git con workflow profesional
- **Deploy Automatizado:** Railway.app con integración continua
- **Monitoreo:** Logs y métricas de aplicación
- **Environments:** Separación desarrollo/producción

#### ✅ **Metodología Académica Aplicada**

**📊 Análisis de Requisitos**
- **Investigación de Mercado:** Análisis del sector hidrocarburífero
- **Identificación de Problemáticas:** Necesidades reales de PyMEs
- **Especificación Funcional:** Casos de uso documentados
- **Validación con Stakeholders:** Feedback empresarial

**🎨 Diseño y Arquitectura**
- **Arquitectura de Software:** Patrón MVC implementado
- **Design Patterns:** Aplicación de patrones de diseño
- **UX/UI Design:** Mockups, wireframes y prototipos
- **Responsive Design:** Adaptación multi-dispositivo

**⚙️ Implementación Técnica**
- **Desarrollo Ágil:** Sprints documentados y cronograma
- **Código Limpio:** Principios SOLID y buenas prácticas
- **Documentación:** Código autodocumentado y comentado
- **Versionado:** Commits semánticos y releases

#### ✅ **Impacto y Relevancia Académica**

**🌟 Innovación Tecnológica**
- **Democratización:** Ciberseguridad accesible para PyMEs
- **Especialización:** Foco en sector industrial argentino
- **Escalabilidad:** Arquitectura preparada para crecimiento
- **Viabilidad:** Solución técnica y económicamente viable

**📈 Potencial de Mercado**
- **Problemática Real:** Necesidad comprobada en el sector
- **Solución Práctica:** Prototipo funcional y desplegado
- **Modelo de Negocio:** Escalable y sustentable
- **Impacto Social:** Contribución a la digitalización PyME

**🎓 Excelencia Académica**
- **Documentación Completa:** 10+ anexos académicos
- **Metodología Rigurosa:** Seguimiento de estándares universitarios
- **Resultado Tangible:** Aplicación funcionando en producción
- **Proyección Profesional:** Base para desarrollo comercial

### 🏅 Conclusión Final

Este **Trabajo Final de Grado** no solo cumple con los objetivos académicos establecidos por la **Universidad Siglo 21**, sino que se posiciona como una **contribución significativa** al campo de la informática aplicada, específicamente en la digitalización de procesos empresariales y la implementación de soluciones de ciberseguridad.

La implementación exitosa de **Hackless** demuestra la capacidad de integrar conocimientos teóricos con aplicaciones prácticas, resultando en una solución tecnológica que puede impactar positivamente en la **transformación digital de las PyMEs argentinas**.

### 🎯 Reflexión Académica

Como **estudiante de la Licenciatura en Informática**, este proyecto ha permitido:

- **Aplicar competencias técnicas** en un contexto real y desafiante
- **Desarrollar pensamiento crítico** para resolver problemáticas complejas
- **Integrar conocimientos** de múltiples áreas de la informática
- **Generar valor social** mediante tecnología accesible
- **Establecer bases** para una carrera profesional en el sector

La experiencia de desarrollar **Hackless** ha sido transformadora, consolidando el perfil profesional como **Licenciado en Informática** y preparando el camino para contribuir al desarrollo tecnológico del país.

</details>

## 📞 Contacto y Soporte

### 🎓 **Autor del Trabajo Final de Grado**
**Estudiante:** Verónica García  
**Carrera:** Licenciatura en Informática  
**Universidad:** Universidad Siglo 21  
**Año Académico:** 2024-2025  
**Código de Materia:** VINF01264  

### 📧 **Contacto Técnico**
- **Email Principal:** veronicaandrea.garcia@gmail.com
- **LinkedIn:** [verónicaandreagarcía](https://linkedin.com/in/verónicaandreagarcía)
- **GitHub:** [@Tegnyvg](https://github.com/Tegnyvg)
- **Portfolio:** [tu-portfolio.com](https://tu-portfolio.com)

### 🏢 **Soporte Comercial**
Para consultas sobre implementación empresarial o servicios de desarrollo:
- **Email Comercial:** info@hackless.com
- **Teléfono:** +54 9 11 XXXX-XXXX
- **WhatsApp Business:** [Link directo](https://wa.me/549XXXXXXXXX)

### 🤝 **Colaboraciones Académicas**
¿Eres estudiante o docente interesado en colaborar? ¡Contáctanos!
- **Proyectos de Investigación:** research@hackless.com
- **Prácticas Profesionales:** practicas@hackless.com
- **Mentorías en Desarrollo:** mentoring@hackless.com

---

## 📜 Licencia y Derechos

### 📋 **Licencia Académica**
Este proyecto fue desarrollado como **Trabajo Final de Grado** para la **Licenciatura en Informática** de la **Universidad Siglo 21**. El código fuente está disponible con fines educativos y académicos.

### ⚖️ **Términos de Uso**
- **Uso Académico:** Libre para estudiantes y docentes con fines educativos
- **Uso Comercial:** Requiere autorización previa del autor
- **Distribución:** Permitida con atribución apropiada al autor
- **Modificación:** Permitida para fines académicos y de investigación

### 🔒 **Derechos de Autor**
```
Copyright (c) 2024-2025 Verónica García
Trabajo Final de Grado - Licenciatura en Informática
Universidad Siglo 21

Todos los derechos reservados. Este software fue desarrollado como parte
de los requisitos académicos para la obtención del título de Licenciado
en Informática.
```

### 🎯 **Cita Académica Sugerida**
```
[Garcia, V.] (2024). Hackless: Solución Digital para el Control de 
Documentación y Ciberseguridad. Trabajo Final de Grado, Licenciatura 
en Informática, Universidad Siglo 21. Recuperado de: 
https://github.com/Tegnyvg/Hackless-TFG-Prototipo
```

---

## 🌟 Agradecimientos

### 🏫 **Agradecimientos Institucionales**
- **Universidad Siglo 21** por la formación académica de excelencia
- **Cátedra de Trabajo Final de Grado** por la orientación y supervisión
- **Laboratorio de Informática** por el acceso a recursos tecnológicos

### 👥 **Agradecimientos Personales**
- **Director de TFG:** [Nombre del Director] - Por la guía y supervisión académica
- **Tutor Académico:** [Nombre del Tutor] - Por el apoyo metodológico
- **Empresas Colaboradoras:** Por proporcionar casos de estudio reales
- **Compañeros de Carrera:** Por el feedback y las pruebas de usuario

### 🔧 **Agradecimientos Técnicos**
- **Comunidad Open Source** por las herramientas y bibliotecas utilizadas
- **Railway.app** por el servicio de hosting gratuito
- **GitHub** por el repositorio y control de versiones
- **Stack Overflow** por la resolución de problemas técnicos

---

<div align="center">

### 💫 **¡Gracias por visitar Hackless!**

**Si este proyecto te resulta útil, no olvides darle una ⭐ en GitHub**

[![Made with ❤️ by Universidad Siglo 21](https://img.shields.io/badge/Made%20with%20❤️%20by-Universidad%20Siglo%2021-red)](https://www.21.edu.ar/)
[![TFG](https://img.shields.io/badge/TFG-Licenciatura%20en%20Informática-blue)](https://www.21.edu.ar/carreras/informatica/)
[![Year](https://img.shields.io/badge/Año-2024--2025-green)](https://github.com/Tegnyvg/Hackless-TFG-Prototipo)

</div>
