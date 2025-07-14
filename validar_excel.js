// Validador de estructura Excel para Hackless
const XLSX = require('xlsx');
const path = require('path');

class ValidadorExcel {
    constructor() {
        // Definir estructura según la base de datos Usuario
        this.camposObligatorios = ['Nombre', 'Email'];
        this.camposOpcionales = ['Rol', 'Puesto', 'Area', 'Telefono'];
        this.todosLosCampos = [...this.camposObligatorios, ...this.camposOpcionales];
        
        // Roles válidos según el modelo
        this.rolesValidos = [
            'administrador', 
            'operativo', 
            'auditor', 
            'supervisor', 
            'rrhh', 
            'seguridad_higiene', 
            'empleado'
        ];
    }

    validarArchivo(entrada) {
        let workbook;
        let nombreArchivo = 'archivo_excel';
        
        try {
            // Determinar si es buffer o ruta de archivo
            if (Buffer.isBuffer(entrada)) {
                console.log(`🔍 Validando archivo desde buffer`);
                workbook = XLSX.read(entrada, { type: 'buffer' });
            } else {
                console.log(`🔍 Validando archivo: ${path.basename(entrada)}`);
                nombreArchivo = path.basename(entrada);
                workbook = XLSX.readFile(entrada);
            }
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const datos = XLSX.utils.sheet_to_json(worksheet);

            const resultado = {
                valido: true,
                errores: [],
                advertencias: [],
                resumen: {
                    totalFilas: datos.length,
                    columnasEncontradas: [],
                    filasProcesables: 0
                }
            };

            // Verificar que no esté vacío
            if (datos.length === 0) {
                resultado.valido = false;
                resultado.errores.push('El archivo Excel está vacío');
                return resultado;
            }

            // Obtener columnas del archivo
            resultado.resumen.columnasEncontradas = Object.keys(datos[0]);

            // Validar estructura de columnas
            this.validarColumnas(datos[0], resultado);

            // Validar contenido de cada fila
            this.validarContenido(datos, resultado);

            // Generar resumen
            this.generarResumen(resultado);

            return resultado;

        } catch (error) {
            return {
                valido: false,
                errores: [`Error al leer archivo: ${error.message}`],
                advertencias: [],
                resumen: { totalFilas: 0, columnasEncontradas: [], filasProcesables: 0 }
            };
        }
    }

    validarColumnas(primeraFila, resultado) {
        const columnasEncontradas = Object.keys(primeraFila);

        // Verificar campos obligatorios
        const faltanObligatorios = this.camposObligatorios.filter(campo => 
            !columnasEncontradas.includes(campo)
        );

        if (faltanObligatorios.length > 0) {
            resultado.valido = false;
            resultado.errores.push(`Faltan columnas obligatorias: ${faltanObligatorios.join(', ')}`);
        }

        // Verificar columnas desconocidas
        const columnasDesconocidas = columnasEncontradas.filter(col => 
            !this.todosLosCampos.includes(col)
        );

        if (columnasDesconocidas.length > 0) {
            resultado.advertencias.push(`Columnas no reconocidas (serán ignoradas): ${columnasDesconocidas.join(', ')}`);
        }

        // Verificar si falta el campo Rol
        if (!columnasEncontradas.includes('Rol')) {
            resultado.advertencias.push('Columna "Rol" no encontrada. Se asignará rol "empleado" por defecto');
        }
    }

    validarContenido(datos, resultado) {
        let filasProcesables = 0;
        const emailsEncontrados = new Set();

        datos.forEach((fila, index) => {
            const numeroFila = index + 2; // +2 por el encabezado y base 1
            let filaValida = true;

            // Validar campos obligatorios
            this.camposObligatorios.forEach(campo => {
                const valor = fila[campo];
                if (!valor || valor.toString().trim() === '') {
                    resultado.errores.push(`Fila ${numeroFila}: Campo "${campo}" está vacío`);
                    filaValida = false;
                }
            });

            // Validar formato de email
            if (fila.Email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fila.Email)) {
                    resultado.errores.push(`Fila ${numeroFila}: Email inválido "${fila.Email}"`);
                    filaValida = false;
                }

                // Verificar emails duplicados
                if (emailsEncontrados.has(fila.Email.toLowerCase())) {
                    resultado.errores.push(`Fila ${numeroFila}: Email duplicado "${fila.Email}"`);
                    filaValida = false;
                } else {
                    emailsEncontrados.add(fila.Email.toLowerCase());
                }
            }

            // Validar rol si está presente
            if (fila.Rol) {
                const rolNormalizado = fila.Rol.toLowerCase().trim();
                if (!this.rolesValidos.includes(rolNormalizado)) {
                    resultado.errores.push(`Fila ${numeroFila}: Rol inválido "${fila.Rol}". Roles válidos: ${this.rolesValidos.join(', ')}`);
                    filaValida = false;
                }
            }

            // Validar longitud de campos
            if (fila.Nombre && fila.Nombre.length > 100) {
                resultado.advertencias.push(`Fila ${numeroFila}: Nombre muy largo (máximo 100 caracteres)`);
            }
            if (fila.Email && fila.Email.length > 100) {
                resultado.errores.push(`Fila ${numeroFila}: Email muy largo (máximo 100 caracteres)`);
                filaValida = false;
            }
            if (fila.Puesto && fila.Puesto.length > 100) {
                resultado.advertencias.push(`Fila ${numeroFila}: Puesto muy largo (máximo 100 caracteres)`);
            }
            if (fila.Area && fila.Area.length > 100) {
                resultado.advertencias.push(`Fila ${numeroFila}: Area muy larga (máximo 100 caracteres)`);
            }
            if (fila.Telefono && fila.Telefono.length > 20) {
                resultado.advertencias.push(`Fila ${numeroFila}: Teléfono muy largo (máximo 20 caracteres)`);
            }

            if (filaValida) {
                filasProcesables++;
            }
        });

        resultado.resumen.filasProcesables = filasProcesables;
    }

    generarResumen(resultado) {
        const { resumen } = resultado;
        
        console.log('\n📊 RESUMEN DE VALIDACIÓN:');
        console.log(`📋 Total de filas: ${resumen.totalFilas}`);
        console.log(`✅ Filas procesables: ${resumen.filasProcesables}`);
        console.log(`❌ Filas con errores: ${resumen.totalFilas - resumen.filasProcesables}`);
        console.log(`📁 Columnas encontradas: ${resumen.columnasEncontradas.join(', ')}`);
        
        if (resultado.errores.length > 0) {
            console.log(`\n❌ ERRORES (${resultado.errores.length}):`);
            resultado.errores.forEach(error => console.log(`   • ${error}`));
        }
        
        if (resultado.advertencias.length > 0) {
            console.log(`\n⚠️ ADVERTENCIAS (${resultado.advertencias.length}):`);
            resultado.advertencias.forEach(advertencia => console.log(`   • ${advertencia}`));
        }
        
        if (resultado.valido && resultado.errores.length === 0) {
            console.log('\n✅ ARCHIVO VÁLIDO - Listo para cargar');
        } else {
            console.log('\n❌ ARCHIVO INVÁLIDO - Corrija los errores antes de cargar');
        }
    }

    // Método para validar archivos desde línea de comandos
    static validarDesdeArgumentos() {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            console.log('📋 Uso: node validar_excel.js <ruta_archivo.xlsx>');
            console.log('📋 Ejemplo: node validar_excel.js empleados_ejemplo.xlsx');
            return;
        }

        const validador = new ValidadorExcel();
        const rutaArchivo = path.resolve(args[0]);
        
        if (!require('fs').existsSync(rutaArchivo)) {
            console.log(`❌ Archivo no encontrado: ${rutaArchivo}`);
            return;
        }

        const resultado = validador.validarArchivo(rutaArchivo);
        
        console.log('\n🎯 RESULTADO FINAL:');
        console.log(`Estado: ${resultado.valido ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
        
        if (resultado.valido) {
            console.log('🚀 El archivo está listo para cargar en Hackless');
        } else {
            console.log('🔧 Corrija los errores antes de intentar la carga');
        }
    }
}

// Ejecutar validación si se llama directamente
if (require.main === module) {
    ValidadorExcel.validarDesdeArgumentos();
}

module.exports = ValidadorExcel;
