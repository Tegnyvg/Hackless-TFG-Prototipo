# API de Carga de Usuarios desde Excel

## Endpoint: POST /users/upload-excel

### Descripción
Esta API permite cargar múltiples usuarios al sistema Hackless desde un archivo Excel (.xlsx).

### Parámetros
- **Método**: POST
- **Content-Type**: multipart/form-data
- **Campo del archivo**: `excelFile`
- **Tipos de archivo soportados**: .xlsx, .xls

### Formato del Archivo Excel

El archivo Excel debe contener las siguientes columnas (los nombres pueden variar):

| Columna Requerida | Nombres Alternativos Aceptados |
|-------------------|--------------------------------|
| Nombre            | nombre, Name                   |
| Email             | Correo, correo_electronico, Correo Electrónico |
| Rol               | rol, Role (opcional, por defecto: "empleado") |

### Ejemplo de estructura del Excel:

```
| Nombre          | Email                    | Rol        |
|-----------------|--------------------------|------------|
| Juan Pérez      | juan.perez@empresa.com   | empleado   |
| María García    | maria.garcia@empresa.com | supervisor |
| Carlos López    | carlos.lopez@empresa.com | admin      |
```

### Respuesta de la API

#### Respuesta Exitosa (200 OK)
```json
{
  "message": "Proceso de carga completado",
  "resumen": {
    "totalFilas": 10,
    "usuariosCreados": 8,
    "usuariosExistentes": 1,
    "errores": 1
  },
  "contrasenaTemporalInfo": "Los nuevos usuarios tienen la contraseña: Hackless2025!",
  "detalleErrores": [
    "Fila 5: Email inválido (correo-malformado)"
  ]
}
```

#### Respuesta de Error (400 Bad Request)
```json
{
  "message": "No se ha proporcionado ningún archivo Excel."
}
```

### Funcionalidades Implementadas

1. **Validación de archivo**: Verifica que se proporcione un archivo
2. **Lectura flexible**: Acepta diferentes nombres de columnas
3. **Validación de datos**: 
   - Campos obligatorios (Nombre y Email)
   - Formato de email válido
   - Detección de usuarios duplicados
4. **Contraseña temporal**: Se asigna automáticamente `Hackless2025!`
5. **Reporte detallado**: Resumen completo del proceso con errores específicos
6. **Manejo de errores**: Continúa procesando aunque haya errores en filas individuales

### Ejemplo de uso con curl

```bash
curl -X POST \
  http://localhost:3000/users/upload-excel \
  -H 'Content-Type: multipart/form-data' \
  -F 'excelFile=@/ruta/al/archivo/employees.xlsx'
```

### Notas Importantes

1. Los usuarios creados tendrán la contraseña temporal: `Hackless2025!`
2. Los emails se convierten automáticamente a minúsculas
3. Si un usuario ya existe (mismo email), se saltará sin error
4. Los roles se convierten a minúsculas automáticamente
5. Si no se especifica rol, se asigna "empleado" por defecto

### Códigos de Estado HTTP

- **200**: Proceso completado (puede incluir errores parciales)
- **400**: Error en el archivo o formato
- **500**: Error interno del servidor
