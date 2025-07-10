# 🛡️ Hackless - Sistema de Gestión Documental

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18%2B-black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green)](https://www.mongodb.com/)

## 📋 Descripción

Hackless es un sistema integral de gestión documental diseñado para empresas que necesitan organizar, gestionar y auditar sus documentos de manera eficiente. Desarrollado como Trabajo Final de Grado para la Tecnicatura en Informática.

### 🎯 Características Principales

- **Gestión de Usuarios**: Sistema completo de autenticación y autorización
- **Gestión Documental**: Carga, organización y control de documentos
- **Gestión de Empleados**: CRUD completo para administración de personal
- **Hallazgos y Auditorías**: Seguimiento de incidencias y mejoras
- **Capacitaciones**: Gestión de formación y desarrollo profesional
- **Interfaz Moderna**: Diseño responsivo con tema oscuro profesional

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Multer** - Manejo de archivos multipart
- **bcryptjs** - Hashing de contraseñas
- **express-session** - Manejo de sesiones

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsivos
- **JavaScript ES6+** - Funcionalidades interactivas
- **Arquitectura CSS Modular** - Código organizado y mantenible

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 16.0.0
MongoDB >= 5.0.0
npm >= 8.0.0
```

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Tegnyvg/Hackless-TFG-Prototipo.git
   cd Hackless-TFG-Prototipo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hackless
   SESSION_SECRET=tu_clave_secreta_aqui
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

### Desarrollo

```bash
# Modo desarrollo con recarga automática
npm run dev

# Ejecutar pruebas
npm test

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
hackless-backend/
├── config/                 # Configuraciones
│   ├── database.js         # Conexión a MongoDB
│   └── multer.js           # Configuración de archivos
├── models/                 # Modelos de datos
│   ├── Usuario.js          # Modelo de usuario
│   ├── Documento.js        # Modelo de documento
│   └── Empleado.js         # Modelo de empleado
├── routes/                 # Rutas de la API
│   ├── auth.js            # Autenticación
│   ├── users.js           # Gestión de usuarios
│   └── documents.js       # Gestión de documentos
├── controllers/           # Controladores
├── middleware/            # Middlewares personalizados
├── public/                # Archivos estáticos
│   ├── css/               # Estilos CSS modulares
│   ├── js/                # Scripts JavaScript
│   └── *.html             # Páginas HTML
├── uploads/               # Archivos subidos
├── tests/                 # Pruebas automatizadas
└── app.js                 # Punto de entrada
```

## 🎨 Arquitectura CSS

El sistema implementa una arquitectura CSS modular profesional:

- **hackless-global.css** (576 líneas): Tema base y variables globales
- **cargar-empleados.css** (338 líneas): Gestión completa de empleados
- **gestion-empleados.css** (237 líneas): Dashboard de empleados
- **escritorio.css** (216 líneas): Panel principal
- **documents.css** (249 líneas): Gestión documental
- **hallazgos.css** (241 líneas): Seguimiento de hallazgos
- **alta-empleado.css** (152 líneas): Formularios de empleados

### Beneficios de la Arquitectura
- ✅ Eliminación de +1,549 líneas de código duplicado
- ✅ Tema oscuro profesional unificado
- ✅ Variables CSS para consistencia
- ✅ Diseño completamente responsivo
- ✅ Cero estilos inline

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Documentos
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Subir documento
- `GET /api/documents/:id` - Obtener documento
- `DELETE /api/documents/:id` - Eliminar documento

## 🔐 Seguridad

- Autenticación basada en sesiones
- Hashing de contraseñas con bcrypt
- Validación de datos de entrada
- Protección contra ataques CSRF
- Configuración de headers de seguridad

## 📊 Funcionalidades Principales

### Gestión de Empleados
- Carga manual y masiva (Excel/CSV)
- Edición y eliminación de registros
- Búsqueda y filtrado avanzado
- Validación de datos completa

### Gestión Documental
- Carga de múltiples formatos
- Organización por categorías
- Control de versiones
- Auditoría de accesos

### Dashboard Administrativo
- Métricas en tiempo real
- Gráficos de actividad
- Reportes personalizados
- Notificaciones del sistema

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas con coverage
npm run test:coverage

# Pruebas de integración
npm run test:integration
```

## 📋 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo
- `npm test` - Ejecutar pruebas
- `npm run lint` - Verificar código con ESLint
- `npm run format` - Formatear código con Prettier

## 🤝 Contribución

Este proyecto es un Trabajo Final de Grado académico. Para contribuciones:

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Verónica García**
- GitHub: [@Tegnyvg](https://github.com/Tegnyvg)
- Email: [contacto@example.com](mailto:contacto@example.com)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)

---

**Trabajo Final de Grado - Tecnicatura en Informática**  
*Código: VINF01264*  
*Año: 2025*

## 🙏 Agradecimientos

- A los profesores de la Tecnicatura en Informática
- A la comunidad de desarrolladores de Node.js
- A todos los que contribuyeron con feedback y pruebas

---

*Desarrollado con ❤️ para la gestión documental empresarial*
