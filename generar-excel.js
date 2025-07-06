// Script para generar archivo Excel de ejemplo con empleados
const XLSX = require('xlsx');
const fs = require('fs');

// Datos de empleados de ejemplo para el sector petrolero
const empleadosData = [
    {
        'Nombre': 'Juan Carlos Martinez',
        'Email': 'jmartinez@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Ingeniero de Producción',
        'Area': 'Operaciones',
        'Telefono': '+54 9 11 2345-6789'
    },
    {
        'Nombre': 'Maria Elena Rodriguez',
        'Email': 'mrodriguez@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Técnica en Seguridad Industrial',
        'Area': 'HSE',
        'Telefono': '+54 9 11 3456-7890'
    },
    {
        'Nombre': 'Carlos Alberto Fernandez',
        'Email': 'cfernandez@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Supervisor de Campo',
        'Area': 'Operaciones',
        'Telefono': '+54 9 11 4567-8901'
    },
    {
        'Nombre': 'Ana Sofia Gutierrez',
        'Email': 'agutierrez@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Analista de Compliance',
        'Area': 'Legal',
        'Telefono': '+54 9 11 5678-9012'
    },
    {
        'Nombre': 'Roberto Daniel Lopez',
        'Email': 'rlopez@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Operador de Equipo',
        'Area': 'Operaciones',
        'Telefono': '+54 9 11 6789-0123'
    },
    {
        'Nombre': 'Lucia Beatriz Morales',
        'Email': 'lmorales@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Coordinadora de Documentación',
        'Area': 'Administración',
        'Telefono': '+54 9 11 7890-1234'
    },
    {
        'Nombre': 'Miguel Angel Torres',
        'Email': 'mtorres@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Ingeniero en HSE',
        'Area': 'HSE',
        'Telefono': '+54 9 11 8901-2345'
    },
    {
        'Nombre': 'Patricia Isabel Ruiz',
        'Email': 'pruiz@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Asistente de RRHH',
        'Area': 'Recursos Humanos',
        'Telefono': '+54 9 11 9012-3456'
    },
    {
        'Nombre': 'Diego Alejandro Silva',
        'Email': 'dsilva@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Técnico en Mantenimiento',
        'Area': 'Mantenimiento',
        'Telefono': '+54 9 11 0123-4567'
    },
    {
        'Nombre': 'Carolina Fernanda Castro',
        'Email': 'ccastro@hacklesstest.com',
        'Rol': 'empleado',
        'Puesto': 'Auditora Interna',
        'Area': 'Auditoría',
        'Telefono': '+54 9 11 1234-5678'
    }
];

// Crear workbook
const wb = XLSX.utils.book_new();

// Crear worksheet con los datos
const ws = XLSX.utils.json_to_sheet(empleadosData);

// Ajustar anchos de columnas
const columnWidths = [
    { wch: 25 }, // Nombre
    { wch: 30 }, // Email
    { wch: 12 }, // Rol
    { wch: 30 }, // Puesto
    { wch: 20 }, // Area
    { wch: 18 }  // Telefono
];
ws['!cols'] = columnWidths;

// Agregar worksheet al workbook
XLSX.utils.book_append_sheet(wb, ws, 'Empleados');

// Guardar archivo
const fileName = 'empleados_demo.xlsx';
XLSX.writeFile(wb, fileName);

console.log(`✅ Archivo Excel creado: ${fileName}`);
console.log(`📊 Total de empleados: ${empleadosData.length}`);
console.log(`📁 Ubicación: ${process.cwd()}/${fileName}`);
