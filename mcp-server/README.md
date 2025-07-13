# Servidor MCP - Hackless TFG

Servidor **Model Context Protocol (MCP)** para el proyecto Hackless TFG. Este servidor proporciona herramientas de información meteorológica y datos del proyecto a través del protocolo MCP.

## Instalación

Desde la carpeta `mcp-server`:

```bash
cd mcp-server
npm install
npm run build
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Herramientas Disponibles

### 🌤️ Herramientas Meteorológicas
- **`get-alerts`**: Alertas meteorológicas para estados de EE.UU.
- **`get-forecast`**: Pronósticos meteorológicos por coordenadas

### 🎯 Herramientas del Proyecto
- **`hackless-info`**: Información sobre el proyecto Hackless TFG
  - `general`: Información general del proyecto
  - `features`: Funcionalidades disponibles
  - `tech-stack`: Stack tecnológico utilizado
  - `deployment`: Información de despliegue

## Configuración con Claude Desktop

Agrega esta configuración a tu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hackless": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA/Hackless-TFG-Prototipo/mcp-server/build/index.js"]
    }
  }
}
```

## Estructura del Servidor MCP

```
mcp-server/
├── src/
│   └── index.ts          # Código principal del servidor
├── build/                # Archivos compilados
├── package.json          # Dependencias específicas de MCP
├── tsconfig.json         # Configuración TypeScript
└── README.md             # Este archivo
```

## Integración con el Proyecto Principal

Este servidor MCP está diseñado para complementar la aplicación web principal de Hackless, proporcionando acceso a información del proyecto a través de herramientas de IA como Claude.
