const XLSX = require('xlsx');
const path = require('path');

// Datos de ejemplo con estructura exacta de la base de datos
// Campos obligatorios: Nombre, Email, Rol
// Campos opcionales: Puesto, Area, Telefono
const datosEmpleados = [
    {
        'Nombre': 'Ana García Rodríguez',
        'Email': 'ana.garcia@hackless.com',
        'Rol': 'empleado',
        'Puesto': 'Operadora de Línea de Producción',
        'Area': 'Producción',
        'Telefono': '+54 9 11 1234-5678'
    },
    {
        'Nombre': 'Carlos López Martínez',
        'Email': 'carlos.lopez@hackless.com',
        'Rol': 'supervisor',
        'Puesto': 'Supervisor de Seguridad Industrial',
        'Area': 'Seguridad e Higiene',
        'Telefono': '+54 9 11 2345-6789'
    },
    {
        'Nombre': 'María José Fernández',
        'Email': 'maria.fernandez@hackless.com',
        'Rol': 'administrador',
        'Puesto': 'Jefe de Recursos Humanos',
        'Area': 'Administración',
        'Telefono': '+54 9 11 3456-7890'
    },
    {
        'Nombre': 'Juan Carlos Sánchez',
        'Email': 'juan.sanchez@hackless.com',
        'Rol': 'empleado',
        'Puesto': 'Técnico en Mantenimiento Mecánico',
        'Area': 'Mantenimiento',
        'Telefono': '+54 9 11 4567-8901'
    },
    {
        'Nombre': 'Laura Patricia Morales',
        'Email': 'laura.morales@hackless.com',
        'Rol': 'auditor',
        'Puesto': 'Auditor Interno de Calidad',
        'Area': 'Calidad',
        'Telefono': '+54 9 11 5678-9012'
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
