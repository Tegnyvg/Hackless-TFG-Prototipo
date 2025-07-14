# 🛡️ Hackless - Sistema de Gestión Documental y Ciberseguridad

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Sistema integral de gestión documental diseñado específicamente para PyMEs del sector petrolero. Hackless automatiza el cumplimiento normativo y protege la información crítica en entornos de alta exigencia.

## ✨ Características Principales

### 🏢 Gestión de Empleados

- **Registro masivo** via Excel/CSV con validación DNI
- **Gestión individual** con formularios intuitivos
- **Control de accesos** por roles (empleado, supervisor, admin)
- **Trazabilidad completa** de acciones y cambios

### 📄 Sistema Documental

- **Carga de documentos** PDF, DOC, DOCX
- **Control de vencimientos** con alertas automáticas
- **Categorización inteligente** por tipo de documento
- **Búsqueda y filtrado** avanzado

### 🎓 Gestión de Capacitaciones

- **Programación de cursos** HSE y compliance
- **Seguimiento de progreso** por empleado
- **Certificaciones digitales** automáticas
- **Reportes de cumplimiento** normativo

### ⚠️ Registro de Hallazgos

- **Clasificación por severidad** (Baja, Media, Alta)
- **Asignación de responsables** automática
- **Seguimiento de acciones** correctivas
- **Dashboard visual** de métricas

### 🔐 Seguridad Avanzada

- **Autenticación robusta** con sesiones seguras
- **Control de acceso** basado en roles
- **Encriptación de datos** sensibles
- **Logs de auditoría** completos

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js 18+
- MySQL 8.0+
- Git

### Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/Tegnyvg/Hackless-TFG-Prototipo.git
cd Hackless-TFG-Prototipo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar migraciones de base de datos
npm run db:migrate

# Inicializar datos de prueba (opcional)
npm run seed

# Iniciar servidor
npm start
```

### Configuración de Base de Datos

```sql
CREATE DATABASE hackless_db;
CREATE USER 'hackless_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON hackless_db.* TO 'hackless_user'@'localhost';
FLUSH PRIVILEGES;
```

### Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hackless_db
DB_USER=hackless_user
DB_PASS=secure_password

# Servidor
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_secure_session_secret

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🏗️ Arquitectura del Sistema

### Estructura del Proyecto

```text
hackless-backend/
├── config/              # Configuraciones de BD y servidor
├── models/              # Modelos de datos (Sequelize)
├── public/              # Frontend (HTML, CSS, JS)
│   ├── css/            # Estilos (tema oscuro unificado)
│   ├── images/         # Recursos gráficos
│   └── js/             # Scripts del cliente
├── src/                # Backend modularizado
│   ├── controllers/    # Lógica de negocio
│   ├── middleware/     # Middlewares de autenticación
│   └── routes/         # Definición de rutas API
├── uploads/            # Archivos subidos por usuarios
├── app.js              # Servidor principal
└── package.json        # Dependencias y scripts
```

### Stack Tecnológico

**Backend:**

- **Node.js** - Runtime del servidor
- **Express.js** - Framework web minimalista
- **Sequelize** - ORM para MySQL
- **Multer** - Manejo de archivos
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Gestión de sesiones

**Frontend:**

- **HTML5** semántico y accesible
- **CSS3** con variables personalizadas
- **JavaScript ES6+** nativo
- **Font Awesome** para iconografía
- **Inter** como tipografía principal

## 📊 Uso del Sistema

### Roles y Permisos

| Funcionalidad | Empleado | Supervisor | Administrador |
|---------------|----------|------------|---------------|
| Ver documentos propios | ✅ | ✅ | ✅ |
| Ver documentos del equipo | ❌ | ✅ | ✅ |
| Subir documentos | ✅ | ✅ | ✅ |
| Gestionar empleados | ❌ | ❌ | ✅ |
| Configurar sistema | ❌ | ❌ | ✅ |
| Ver reportes | ❌ | ✅ | ✅ |

### Flujo de Trabajo Típico

1. **Registro de Empleados**: Admin carga lista via Excel
2. **Onboarding**: Empleado sube documentación requerida
3. **Capacitaciones**: Supervisor asigna cursos HSE
4. **Monitoreo**: Sistema alerta sobre vencimientos
5. **Auditoría**: Generación de reportes de cumplimiento

## 🧪 Testing

```bash
# Ejecutar suite de tests
npm test

# Tests específicos
npm run test:auth          # Autenticación
npm run test:documents     # Gestión documental
npm run test:users         # Gestión de usuarios

# Coverage
npm run test:coverage
```

## 📈 Deployment

### Producción con Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy en Render/Railway

```yaml
# render.yaml
services:
  - type: web
    name: hackless-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

## 🤝 Contribuciones

Este proyecto fue desarrollado como Trabajo Final de Grado. Para contribuciones:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👤 Autor

### Verónica García

- 📧 Email: <veronica.garcia@example.com>
- 📚 TFG: VINF01264
- 🎓 Universidad: [Nombre Universidad]

## 🙏 Agradecimientos

- Font Awesome por los iconos
- Inter Font por la tipografía
- Comunidad Node.js por las herramientas
- Sector petrolero argentino por la inspiración

---

🛡️ Desarrollado con seguridad y calidad para PyMEs del sector petrolero
