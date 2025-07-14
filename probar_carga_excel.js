// Script para probar la carga de empleados desde Excel
const fs = require('fs');
const FormData = require('form-data');
const http = require('http');
const path = require('path');

async function probarCargaExcel() {
  try {
    console.log('🧪 Iniciando prueba de carga de Excel...');
    
    // Verificar que el archivo existe
    const rutaArchivo = path.join(__dirname, 'empleados_ejemplo.xlsx');
    if (!fs.existsSync(rutaArchivo)) {
      console.error('❌ El archivo empleados_ejemplo.xlsx no existe');
      return;
    }
    
    // Crear FormData
    const form = new FormData();
    form.append('excelFile', fs.createReadStream(rutaArchivo));
    
    // Realizar petición
    console.log('📤 Enviando archivo al servidor...');
    
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/users/upload-excel',
        method: 'POST',
        headers: form.getHeaders()
      }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const resultado = JSON.parse(data);
            
            if (res.statusCode === 200) {
              console.log('✅ Carga exitosa!');
              console.log('📊 Resumen:', resultado.resumen);
              if (resultado.contrasenaTemporalInfo) {
                console.log('🔐 Info contraseña:', resultado.contrasenaTemporalInfo);
              }
              if (resultado.detalleErrores && resultado.detalleErrores.length > 0) {
                console.log('⚠️ Errores encontrados:', resultado.detalleErrores);
              }
            } else {
              console.error('❌ Error en la carga:', resultado);
            }
            resolve(resultado);
          } catch (error) {
            console.error('❌ Error parseando respuesta:', error.message);
            reject(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ Error en la petición:', error.message);
        reject(error);
      });
      
      form.pipe(req);
    });
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

// Ejecutar prueba
probarCargaExcel();
