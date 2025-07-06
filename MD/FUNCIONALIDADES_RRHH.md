# Funcionalidades de Recursos Humanos - Sistema Hackless

## 📋 Resumen de Funcionalidades Implementadas

El sistema Hackless cuenta con **dos modalidades completas** para la gestión de empleados por parte de RRHH:

### 1. 📤 Carga Masiva de Empleados (Excel/CSV)

#### Características:
- **Formato soportado**: Archivos Excel (.xlsx) y CSV
- **Plantilla descargable**: Con formato predefinido y datos de ejemplo
- **Campos obligatorios**: Nombre, Email, Rol
- **Campos opcionales**: Puesto, Área, Teléfono
- **Validaciones automáticas**: Email único, formato válido
- **Contraseña temporal**: Se asigna automáticamente (Hackless2025!)
- **Feedback visual**: Progreso en tiempo real y estadísticas detalladas

#### Columnas del Excel/CSV:
```
Nombre,Email,Rol,Puesto,Area,Telefono
```

#### Proceso de Uso:
1. Acceder a `/cargar-empleados.html`
2. Seleccionar pestaña "📤 Carga Masiva (Excel)"
3. Descargar plantilla o archivo de ejemplo
4. Completar archivo con datos de empleados
5. Subir archivo y procesar
6. Revisar estadísticas y resultados

### 2. ✏️ Carga Manual de Empleados

#### Características:
- **Formulario web intuitivo**: Con validaciones en tiempo real
- **Campos obligatorios**: Nombre, Email, Rol (marcados con *)
- **Campos opcionales**: Puesto, Área, Teléfono
- **Vista previa**: Muestra datos antes de confirmar
- **Validaciones**: Email único, formato válido
- **Contraseña temporal**: Se asigna automáticamente (Hackless2025!)
- **Feedback inmediato**: Confirmación o error detallado

#### Roles Disponibles:
- Empleado
- Supervisor
- Administrador

#### Áreas Predefinidas:
- Operaciones
- HSE (Salud, Seguridad y Ambiente)
- Mantenimiento
- Administración
- Recursos Humanos
- Ingeniería
- Legal y Compliance
- Auditoría
- Logística
- Finanzas

## 🔧 Implementación Técnica

### Frontend (`/cargar-empleados.html`):
- **Pestañas dinámicas**: Alternancia entre carga masiva y manual
- **Drag & Drop**: Para subida de archivos Excel
- **Validaciones client-side**: Email, campos requeridos
- **Progress bar**: Animada durante procesamiento
- **Responsive design**: Compatible con móviles y tablets

### Backend (`app.js`):
- **Endpoint carga masiva**: `POST /users/upload-excel`
- **Endpoint carga manual**: `POST /register`
- **Validaciones robustas**: Email único, formato, campos requeridos
- **Manejo de errores**: Detallado por fila en carga masiva
- **Encriptación segura**: bcrypt con salt factor 12

### Base de Datos (`models/Usuario.js`):
- **Campos obligatorios**: nombre, correo_electronico, contraseña, rol
- **Campos opcionales**: puesto, area, telefono
- **Validaciones**: Email único, formato válido
- **Roles**: Enum con tipos predefinidos

## 📊 Flujo de Trabajo RRHH

### Carga Masiva (Recomendada para múltiples empleados):
1. **Preparación**: Descargar plantilla Excel
2. **Datos**: Completar con información de empleados
3. **Validación**: Verificar formato y campos obligatorios
4. **Carga**: Subir archivo y procesar
5. **Verificación**: Revisar estadísticas y errores
6. **Confirmación**: Ver empleados en nómina actualizada

### Carga Manual (Ideal para empleados individuales):
1. **Formulario**: Completar datos del empleado
2. **Preview**: Verificar información en vista previa
3. **Envío**: Crear empleado con un clic
4. **Confirmación**: Ver resultado y datos del nuevo empleado
5. **Opciones**: Registrar otro o ver nómina

## 🔐 Seguridad y Contraseñas

### Contraseña Temporal:
- **Formato**: `Hackless2025!` (año actual)
- **Seguridad**: Cumple requisitos (8+ caracteres, mayús, minús, números, símbolos)
- **Cambio obligatorio**: Recomendado en primer login
- **Encriptación**: bcrypt con salt factor 12

### Validaciones:
- **Email único**: No permite duplicados
- **Formato email**: Validación con regex
- **Campos requeridos**: Nombre, Email, Rol
- **Sanitización**: Trim de espacios en blanco

## 📈 Estadísticas y Reporting

### Carga Masiva:
- **Total Procesados**: Número de filas leídas
- **Empleados Creados**: Nuevos usuarios agregados
- **Ya Existían**: Emails duplicados detectados
- **Errores**: Problemas por fila con detalle

### Mensajes de Error Detallados:
- Campos faltantes por fila
- Emails inválidos con formato específico
- Usuarios existentes identificados
- Errores de base de datos con contexto

## 🔗 Integración con Sistema

### Navegación:
- **Desde Escritorio**: Enlace directo "Cargar Empleados"
- **Hacia Nómina**: Botón "Ver Nómina Actualizada"
- **Breadcrumbs**: Navegación contextual

### Archivos de Ejemplo:
- **CSV**: `/empleados_ejemplo.csv` (10 empleados muestra)
- **Plantilla**: Generada dinámicamente con formato correcto
- **Datos reales**: Sectores petroleros y gasíferos

## ✅ Estado de Implementación

- ✅ **Modelo de datos**: Actualizado con campos opcionales
- ✅ **Carga masiva**: Funcional con validaciones
- ✅ **Carga manual**: Formulario completo con preview
- ✅ **Validaciones**: Backend y frontend
- ✅ **UI/UX**: Pestañas, progress, feedback
- ✅ **Ejemplos**: Archivos CSV y plantillas
- ✅ **Integración**: Enlaces desde escritorio
- ✅ **Testing**: Servidor local funcional

## 🚀 Listo para Demo

El sistema está **completamente funcional** y listo para:
- Demostración académica
- Evaluación de TFG
- Uso en entorno productivo (Railway)
- Presentación a evaluadores

### Credenciales Demo:
- **Admin**: admin@hackless.com / Admin2024!
- **RRHH**: rrhh@hackless.com / Rrhh2024!
- **Supervisor**: supervisor@hackless.com / Supervisor2024!

### URLs de Acceso:
- **Local**: http://localhost:3000/cargar-empleados.html
- **Production**: https://[railway-url]/cargar-empleados.html
