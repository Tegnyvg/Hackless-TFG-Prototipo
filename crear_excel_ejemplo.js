const XLSX = require('xlsx');
const path = require('path');

// Crear datos de ejemplo para el Excel
const datosEmpleados = [
    {
        'Nombre': 'Ana García Rodríguez',
        'Email': 'ana.garcia@empresa.com',
        'Rol': 'empleado',
        'Puesto': 'Operador de Planta',
        'Area': 'Producción',
        'Telefono': '011-4567-8901'
    },
    {
        'Nombre': 'Carlos López Martínez',
        'Email': 'carlos.lopez@empresa.com',
        'Rol': 'supervisor',
        'Puesto': 'Supervisor de Seguridad',
        'Area': 'Seguridad e Higiene',
        'Telefono': '011-4567-8902'
    },
    {
        'Nombre': 'María Fernández Silva',
        'Email': 'maria.fernandez@empresa.com',
        'Rol': 'administrador',
        'Puesto': 'Jefe de RRHH',
        'Area': 'Recursos Humanos',
        'Telefono': '011-4567-8903'
    },
    {
        'Nombre': 'Juan Pedro Sánchez',
        'Email': 'juan.sanchez@empresa.com',
        'Rol': 'empleado',
        'Puesto': 'Técnico de Mantenimiento',
        'Area': 'Mantenimiento',
        'Telefono': '011-4567-8904'
    },
    {
        'Nombre': 'Laura Morales Vega',
        'Email': 'laura.morales@empresa.com',
        'Rol': 'auditor',
        'Puesto': 'Auditor Interno',
        'Area': 'Calidad',
        'Telefono': '011-4567-8905'
    }
];

// Crear libro de trabajo
const workbook = XLSX.utils.book_new();

// Crear hoja de cálculo
const worksheet = XLSX.utils.json_to_sheet(datosEmpleados);

// Agregar la hoja al libro
XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

// Guardar archivo
const rutaArchivo = path.join(__dirname, 'empleados_ejemplo.xlsx');
XLSX.writeFile(workbook, rutaArchivo);

console.log('✅ Archivo Excel de ejemplo creado:', rutaArchivo);
