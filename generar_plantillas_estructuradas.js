const XLSX = require('xlsx');
const path = require('path');

// Crear plantilla Excel estructurada según la base de datos
function crearPlantillaEstructurada() {
    console.log('📋 Creando plantilla Excel estructurada...');

    // Estructura de columnas que coincide exactamente con el modelo Usuario
    const encabezados = [
        'Nombre',           // nombre - VARCHAR(100) - OBLIGATORIO
        'Email',            // correo_electronico - VARCHAR(100) - OBLIGATORIO, ÚNICO
        'Rol',              // rol - ENUM - OBLIGATORIO
        'Puesto',           // puesto - VARCHAR(100) - OPCIONAL
        'Area',             // area - VARCHAR(100) - OPCIONAL  
        'Telefono'          // telefono - VARCHAR(20) - OPCIONAL
    ];

    // Datos de ejemplo que muestran la estructura correcta
    const datosEjemplo = [
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

    // Crear hoja principal con datos de ejemplo
    const worksheetPrincipal = XLSX.utils.json_to_sheet(datosEjemplo);
    XLSX.utils.book_append_sheet(workbook, worksheetPrincipal, 'Empleados');

    // Crear hoja de instrucciones
    const instrucciones = [
        ['INSTRUCCIONES PARA CARGA MASIVA DE EMPLEADOS'],
        [''],
        ['ESTRUCTURA REQUERIDA:'],
        ['Columna A: Nombre (OBLIGATORIO)'],
        ['Columna B: Email (OBLIGATORIO, debe ser único)'],
        ['Columna C: Rol (OBLIGATORIO)'],
        ['Columna D: Puesto (Opcional)'],
        ['Columna E: Area (Opcional)'],
        ['Columna F: Telefono (Opcional)'],
        [''],
        ['ROLES VÁLIDOS:'],
        ['- administrador'],
        ['- operativo'],
        ['- auditor'],
        ['- supervisor'],
        ['- rrhh'],
        ['- seguridad_higiene'],
        ['- empleado'],
        [''],
        ['VALIDACIONES:'],
        ['• El campo Nombre es obligatorio'],
        ['• El campo Email es obligatorio y debe tener formato válido'],
        ['• El campo Rol es obligatorio y debe ser uno de los listados'],
        ['• Los emails deben ser únicos (no duplicados)'],
        ['• Los campos Puesto, Area y Telefono son opcionales'],
        [''],
        ['NOTAS IMPORTANTES:'],
        ['• Todos los usuarios nuevos tendrán la contraseña: Hackless2025!'],
        ['• Los usuarios deben cambiar su contraseña en el primer acceso'],
        ['• Si un email ya existe, se omitirá la fila'],
        ['• Máximo 1000 usuarios por carga'],
        [''],
        ['FORMATO DE EJEMPLO:'],
        ['Ver hoja "Empleados" para estructura correcta']
    ];

    const worksheetInstrucciones = XLSX.utils.aoa_to_sheet(instrucciones);
    XLSX.utils.book_append_sheet(workbook, worksheetInstrucciones, 'Instrucciones');

    // Crear hoja de plantilla vacía para completar
    const plantillaVacia = [
        {
            'Nombre': '',
            'Email': '',
            'Rol': 'empleado',
            'Puesto': '',
            'Area': '',
            'Telefono': ''
        }
    ];

    const worksheetVacia = XLSX.utils.json_to_sheet(plantillaVacia);
    XLSX.utils.book_append_sheet(workbook, worksheetVacia, 'Plantilla Vacía');

    // Guardar archivo
    const rutaArchivo = path.join(__dirname, 'empleados_plantilla_estructurada.xlsx');
    XLSX.writeFile(workbook, rutaArchivo);

    console.log('✅ Plantilla estructurada creada:', rutaArchivo);
    return rutaArchivo;
}

// Crear archivo de ejemplo actualizado
function crearEjemploActualizado() {
    console.log('📋 Creando archivo de ejemplo actualizado...');

    // Datos más variados para pruebas
    const empleadosEjemplo = [
        {
            'Nombre': 'Ana María Gutiérrez',
            'Email': 'ana.gutierrez@hackless.com',
            'Rol': 'empleado',
            'Puesto': 'Operadora de Línea de Producción',
            'Area': 'Producción',
            'Telefono': '+54 9 11 1234-5678'
        },
        {
            'Nombre': 'Carlos Eduardo López',
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
            'Nombre': 'Juan Carlos Rodríguez',
            'Email': 'juan.rodriguez@hackless.com',
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
        },
        {
            'Nombre': 'Roberto Daniel Martínez',
            'Email': 'roberto.martinez@hackless.com',
            'Rol': 'rrhh',
            'Puesto': 'Especialista en Capacitación',
            'Area': 'Recursos Humanos',
            'Telefono': '+54 9 11 6789-0123'
        },
        {
            'Nombre': 'Patricia Elena Sánchez',
            'Email': 'patricia.sanchez@hackless.com',
            'Rol': 'seguridad_higiene',
            'Puesto': 'Responsable de Higiene y Seguridad',
            'Area': 'Seguridad e Higiene',
            'Telefono': '+54 9 11 7890-1234'
        },
        {
            'Nombre': 'Miguel Ángel Torres',
            'Email': 'miguel.torres@hackless.com',
            'Rol': 'operativo',
            'Puesto': 'Coordinador de Producción',
            'Area': 'Operaciones',
            'Telefono': '+54 9 11 8901-2345'
        }
    ];

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(empleadosEjemplo);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

    // Guardar archivo
    const rutaArchivo = path.join(__dirname, 'empleados_ejemplo_actualizado.xlsx');
    XLSX.writeFile(workbook, rutaArchivo);

    console.log('✅ Ejemplo actualizado creado:', rutaArchivo);
    return rutaArchivo;
}

// Validar estructura de archivo Excel
function validarEstructuraExcel(rutaArchivo) {
    console.log('🔍 Validando estructura del archivo Excel...');
    
    try {
        const workbook = XLSX.readFile(rutaArchivo);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const datos = XLSX.utils.sheet_to_json(worksheet);

        if (datos.length === 0) {
            console.log('❌ El archivo está vacío');
            return false;
        }

        const primeraFila = datos[0];
        const columnasRequeridas = ['Nombre', 'Email'];
        const columnasOpcionales = ['Rol', 'Puesto', 'Area', 'Telefono'];
        const todasLasColumnas = [...columnasRequeridas, ...columnasOpcionales];

        console.log('📋 Columnas encontradas:', Object.keys(primeraFila));

        // Verificar columnas obligatorias
        const faltanObligatorias = columnasRequeridas.filter(col => 
            !Object.keys(primeraFila).includes(col)
        );

        if (faltanObligatorias.length > 0) {
            console.log('❌ Faltan columnas obligatorias:', faltanObligatorias);
            return false;
        }

        console.log('✅ Estructura válida');
        console.log(`📊 Total de filas: ${datos.length}`);
        
        return true;

    } catch (error) {
        console.error('❌ Error al validar:', error.message);
        return false;
    }
}

// Ejecutar funciones
if (require.main === module) {
    console.log('🚀 Generando plantillas Excel estructuradas...\n');
    
    const plantilla = crearPlantillaEstructurada();
    const ejemplo = crearEjemploActualizado();
    
    console.log('\n🔍 Validando archivos creados...');
    validarEstructuraExcel(plantilla);
    validarEstructuraExcel(ejemplo);
    
    console.log('\n📋 RESUMEN DE ARCHIVOS CREADOS:');
    console.log('📁 empleados_plantilla_estructurada.xlsx - Plantilla completa con instrucciones');
    console.log('📁 empleados_ejemplo_actualizado.xlsx - Archivo con datos de ejemplo');
    console.log('\n✅ Plantillas listas para usar en el sistema Hackless');
}

module.exports = {
    crearPlantillaEstructurada,
    crearEjemploActualizado,
    validarEstructuraExcel
};
