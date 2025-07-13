#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "hackless-mcp-server/1.0";

// Create server instance
const server = new McpServer({
  name: "hackless-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
    description?: string;
    instruction?: string;
  };
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Evento: ${props.event || "Desconocido"}`,
    `Área: ${props.areaDesc || "Desconocida"}`,
    `Severidad: ${props.severity || "Desconocida"}`,
    `Estado: ${props.status || "Desconocido"}`,
    `Descripción: ${props.description || "Sin descripción"}`,
    `Instrucciones: ${props.instruction || "Sin instrucciones específicas"}`,
    "---",
  ].join("\n");
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
  detailedForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

// Register weather alerts tool
server.tool(
  "get-alerts",
  "Obtener alertas meteorológicas para un estado de Estados Unidos",
  {
    state: z.string().length(2).describe("Código de estado de dos letras (ej. CA, NY, TX)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
            text: "Error al recuperar datos de alertas meteorológicas",
          },
        ],
      };
    }

    const features = alertsData.features || [];
    if (features.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No hay alertas activas para el estado ${stateCode}`,
          },
        ],
      };
    }

    const formattedAlerts = features.map(formatAlert);
    const alertsText = `Alertas activas para ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: alertsText,
        },
      ],
    };
  },
);

// Register weather forecast tool
server.tool(
  "get-forecast",
  "Obtener pronóstico meteorológico para una ubicación específica (solo Estados Unidos)",
  {
    latitude: z.number().min(-90).max(90).describe("Latitud de la ubicación"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitud de la ubicación"),
  },
  async ({ latitude, longitude }) => {
    // Get grid point data
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `Error al recuperar datos del punto de cuadrícula para las coordenadas: ${latitude}, ${longitude}. Esta ubicación puede no estar soportada por la API de NWS (solo se soportan ubicaciones de Estados Unidos).`,
          },
        ],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: "Error al obtener la URL del pronóstico desde los datos del punto de cuadrícula",
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
            text: "Error al recuperar datos del pronóstico",
          },
        ],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No hay períodos de pronóstico disponibles",
          },
        ],
      };
    }

    // Format forecast periods (show first 5 periods)
    const formattedForecast = periods.slice(0, 5).map((period: ForecastPeriod) =>
      [
        `${period.name || "Desconocido"}:`,
        `Temperatura: ${period.temperature || "Desconocida"}°${period.temperatureUnit || "F"}`,
        `Viento: ${period.windSpeed || "Desconocido"} ${period.windDirection || ""}`,
        `Pronóstico: ${period.detailedForecast || "Sin pronóstico disponible"}`,
        "---",
      ].join("\n"),
    );

    const forecastText = `Pronóstico para ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  },
);

// Register a Hackless project info tool
server.tool(
  "hackless-info",
  "Información sobre el proyecto Hackless TFG",
  {
    section: z.enum(["general", "features", "tech-stack", "deployment"]).describe("Sección de información a consultar"),
  },
  async ({ section }) => {
    const info = {
      general: `
🎯 **Hackless - TFG Prototipo**

Este es un proyecto de Trabajo de Fin de Grado (TFG) que desarrolla una plataforma de gestión empresarial.

**Características principales:**
- Sistema de gestión de empleados
- Interfaz web moderna
- API RESTful
- Autenticación y autorización
- Dashboard administrativo
      `,
      features: `
✨ **Funcionalidades del Sistema**

- 👥 **Gestión de Empleados**: CRUD completo de datos de empleados
- 📊 **Dashboard**: Panel de control con métricas y estadísticas
- 🔐 **Autenticación**: Sistema seguro de login/logout
- 📁 **Subida de Archivos**: Gestión de documentos y archivos
- 📈 **Reportes**: Generación de reportes en Excel/CSV
- 🎨 **UI Moderna**: Interfaz responsive y atractiva
      `,
      "tech-stack": `
🛠️ **Stack Tecnológico**

**Backend:**
- Node.js con Express
- Base de datos (configurada en config/)
- Multer para subida de archivos
- Scripts de seeding de datos

**Frontend:**
- HTML5, CSS3, JavaScript
- Interfaz responsive
- Assets en carpeta public/

**DevOps:**
- Railway deployment (railway.json)
- Procfile para heroku
- Variables de entorno (.env)
      `,
      deployment: `
🚀 **Despliegue y Configuración**

**Archivos de configuración:**
- \`railway.json\`: Configuración de Railway
- \`Procfile\`: Configuración de Heroku
- \`.env.example\`: Variables de entorno de ejemplo

**Scripts disponibles:**
- \`seedAdmins.js\`: Poblar admins de prueba
- \`seedUsers.js\`: Poblar usuarios de prueba
- \`generar-excel.js\`: Utilidades para Excel

**Estructura de carpetas:**
- \`config/\`: Configuraciones del sistema
- \`models/\`: Modelos de datos
- \`public/\`: Assets estáticos
- \`tests/\`: Pruebas unitarias
- \`uploads/\`: Archivos subidos
      `
    };

    return {
      content: [
        {
          type: "text",
          text: info[section] || "Sección no encontrada",
        },
      ],
    };
  },
);

// Register Hackless documentation tool
server.tool(
  "hackless-docs",
  "Documentación específica de funcionalidades de Hackless",
  {
    topic: z.enum([
      "login", "employee-management", "document-upload", 
      "admin-panel", "security", "api-endpoints",
      "database-schema", "deployment-guide"
    ]).describe("Tema de documentación a consultar"),
  },
  async ({ topic }) => {
    const docs = {
      "login": `
🔐 **Sistema de Autenticación Hackless**

**Funcionalidades:**
- Login seguro con validación
- Registro de nuevos usuarios
- Recuperación de contraseñas
- Roles: Admin, Empleado, Supervisor

**Archivos relacionados:**
- \`public/login.html\` - Interfaz de login
- \`public/js/login.js\` - Lógica del frontend
- \`models/Usuario.js\` - Modelo de usuario

**Uso:**
1. Acceder a /login
2. Ingresar credenciales
3. Redirección según rol de usuario
      `,
      "employee-management": `
👥 **Gestión de Empleados**

**Funcionalidades:**
- CRUD completo de empleados
- Carga masiva via Excel/CSV
- Validaciones automáticas
- Exportación de reportes

**Archivos relacionados:**
- \`public/gestion-empleados.html\` - Interfaz principal
- \`public/alta-empleado.html\` - Formulario de alta
- \`public/cargar-empleados.html\` - Carga masiva
- \`empleados_ejemplo.csv\` - Template de ejemplo

**API Endpoints:**
- GET /api/empleados - Listar empleados
- POST /api/empleados - Crear empleado
- PUT /api/empleados/:id - Actualizar
- DELETE /api/empleados/:id - Eliminar
      `,
      "document-upload": `
📁 **Sistema de Documentos**

**Funcionalidades:**
- Subida de archivos seguros
- Categorización automática
- Control de acceso por usuario
- Metadatos de documentos

**Archivos relacionados:**
- \`public/documents.html\` - Interfaz de documentos
- \`uploads/\` - Directorio de archivos
- \`models/Documentacion.js\` - Modelo de documentos

**Configuración:**
- Límite de archivo: 10MB
- Tipos permitidos: PDF, DOC, XLS, IMG
- Estructura: uploads/[año]/[mes]/[archivo]
      `,
      "admin-panel": `
⚙️ **Panel de Administración**

**Funcionalidades:**
- Dashboard con métricas
- Gestión de usuarios y roles
- Configuración del sistema
- Logs de auditoría

**Archivos relacionados:**
- \`public/escritorio.html\` - Dashboard principal
- \`models/Auditoria\` - Logs de sistema
- \`scripts/seedAdmins.js\` - Crear admins

**Métricas disponibles:**
- Usuarios activos
- Documentos subidos
- Actividad reciente
- Estadísticas de uso
      `,
      "security": `
🛡️ **Seguridad en Hackless**

**Medidas implementadas:**
- Validación de entrada (XSS/SQL Injection)
- Autenticación JWT
- Control de acceso basado en roles
- Logs de auditoría

**Archivos de seguridad:**
- \`.env\` - Variables sensibles
- \`config/database.js\` - Configuración DB
- \`models/Auditoria\` - Logs de seguridad

**Best practices:**
- Nunca hardcodear credenciales
- Validar todas las entradas
- Usar HTTPS en producción
- Backup regular de datos
      `,
      "api-endpoints": `
🔗 **API Endpoints de Hackless**

**Autenticación:**
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/reset-password

**Empleados:**
- GET /api/empleados
- POST /api/empleados
- PUT /api/empleados/:id
- DELETE /api/empleados/:id

**Documentos:**
- GET /api/documentos
- POST /api/documentos/upload
- GET /api/documentos/:id
- DELETE /api/documentos/:id

**Administración:**
- GET /api/admin/stats
- GET /api/admin/logs
- GET /api/admin/users
      `,
      "database-schema": `
🗄️ **Esquema de Base de Datos**

**Tablas principales:**
- \`usuarios\` - Datos de usuarios
- \`empleados\` - Información de empleados
- \`documentos\` - Metadatos de archivos
- \`auditoria\` - Logs del sistema

**Relaciones:**
- Usuario → Empleado (1:1)
- Usuario → Documentos (1:N)
- Empleado → Capacitaciones (N:M)

**Configuración:**
Ver \`config/database.js\` para configuración
Ver \`models/\` para definiciones de esquemas
      `,
      "deployment-guide": `
🚀 **Guía de Despliegue**

**Opciones de deployment:**

**1. Railway:**
- Archivo: \`railway.json\`
- URL: https://hackless-backend-production.up.railway.app
- Variables: Configurar en Railway dashboard

**2. Heroku:**
- Archivo: \`Procfile\`
- Comando: \`web: node app.js\`
- Configurar variables de entorno

**3. Local:**
\`\`\`bash
npm install
cp .env.example .env
# Configurar variables en .env
npm start
\`\`\`

**Variables requeridas:**
- DATABASE_URL
- JWT_SECRET
- UPLOAD_PATH
      `
    };

    return {
      content: [
        {
          type: "text",
          text: docs[topic] || "Documentación no encontrada para ese tema",
        },
      ],
    };
  },
);

// Register Hackless troubleshooting tool
server.tool(
  "hackless-troubleshooting",
  "Resolución de problemas comunes en Hackless",
  {
    issue: z.enum([
      "login-failed", "upload-error", "database-connection", 
      "permission-denied", "slow-performance", "deployment-error"
    ]).describe("Tipo de problema a resolver"),
  },
  async ({ issue }) => {
    const solutions = {
      "login-failed": `
❌ **Error de Login**

**Posibles causas:**
1. Credenciales incorrectas
2. Usuario no registrado
3. Sesión expirada
4. Error de base de datos

**Soluciones:**
1. ✅ Verificar usuario/contraseña
2. ✅ Revisar tabla usuarios en DB
3. ✅ Limpiar cookies/localStorage
4. ✅ Verificar logs en \`logs/\`
5. ✅ Comprobar conexión a DB

**Debugging:**
\`\`\`bash
# Ver logs
tail -f logs/debug.log

# Verificar usuario en DB
SELECT * FROM usuarios WHERE email = 'user@example.com';
\`\`\`
      `,
      "upload-error": `
📁 **Error de Subida de Archivos**

**Verificaciones:**
1. ✅ Tamaño de archivo (< 10MB)
2. ✅ Tipo de archivo permitido
3. ✅ Permisos del directorio \`uploads/\`
4. ✅ Espacio en disco

**Soluciones:**
\`\`\`bash
# Verificar permisos
ls -la uploads/

# Crear directorio si no existe
mkdir -p uploads/temp

# Verificar espacio en disco
df -h
\`\`\`

**Tipos permitidos:** PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
      `,
      "database-connection": `
🗄️ **Error de Conexión a Base de Datos**

**Verificaciones:**
1. ✅ Variable DATABASE_URL en .env
2. ✅ Servicio de DB activo
3. ✅ Credenciales correctas
4. ✅ Firewall/puertos abiertos

**Debugging:**
\`\`\`bash
# Verificar variables
echo $DATABASE_URL

# Probar conexión
node -e "require('./config/database.js')"

# Ver logs de conexión
tail -f logs/database.log
\`\`\`
      `,
      "permission-denied": `
🚫 **Error de Permisos**

**Posibles causas:**
1. Rol insuficiente
2. Sesión expirada
3. Token JWT inválido

**Soluciones:**
1. ✅ Verificar rol del usuario
2. ✅ Renovar sesión
3. ✅ Verificar token en localStorage
4. ✅ Comprobar middleware de autenticación

**Roles válidos:** admin, empleado, supervisor
      `,
      "slow-performance": `
⚡ **Rendimiento Lento**

**Optimizaciones:**
1. ✅ Índices en base de datos
2. ✅ Compresión de archivos estáticos
3. ✅ Cache de consultas frecuentes
4. ✅ Limpieza de logs antiguos

**Monitoring:**
\`\`\`bash
# Ver uso de memoria
node --inspect app.js

# Análisis de DB
EXPLAIN SELECT * FROM usuarios;

# Limpiar logs
find logs/ -name "*.log" -mtime +30 -delete
\`\`\`
      `,
      "deployment-error": `
🚀 **Error de Despliegue**

**Railway:**
1. ✅ Verificar \`railway.json\`
2. ✅ Variables de entorno configuradas
3. ✅ Build exitoso

**Heroku:**
1. ✅ Verificar \`Procfile\`
2. ✅ \`package.json\` con scripts correctos
3. ✅ Variables de entorno

**Comandos útiles:**
\`\`\`bash
# Ver logs de Railway
railway logs

# Ver logs de Heroku
heroku logs --tail

# Verificar build local
npm run build
npm start
\`\`\`
      `
    };

    return {
      content: [
        {
          type: "text",
          text: solutions[issue] || "Solución no encontrada para ese problema",
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP de Hackless ejecutándose en stdio");
}

main().catch((error) => {
  console.error("Error fatal en main():", error);
  process.exit(1);
});
