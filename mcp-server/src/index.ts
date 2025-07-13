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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP de Hackless ejecutándose en stdio");
}

main().catch((error) => {
  console.error("Error fatal en main():", error);
  process.exit(1);
});
