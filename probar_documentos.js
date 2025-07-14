// Script para probar la carga de documentos
const fs = require('fs');
const FormData = require('form-data');
const http = require('http');
const path = require('path');

function probarCargaDocumento() {
  try {
    console.log('🧪 Iniciando prueba de carga de documento...');
    
    // Verificar que el archivo existe
    const rutaArchivo = path.join(__dirname, 'documento_prueba.txt');
    if (!fs.existsSync(rutaArchivo)) {
      console.error('❌ El archivo documento_prueba.txt no existe');
      return;
    }
    
    // Crear FormData
    const form = new FormData();
    form.append('archivoPdf', fs.createReadStream(rutaArchivo));
    form.append('id_usuario', '10000001');
    form.append('tipo_documento', 'Certificado ART');
    form.append('fecha_emision', '2025-07-14');
    form.append('fecha_vencimiento', '2026-07-14');
    
    console.log('📤 Enviando documento al servidor...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/documents',
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
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Documento subido exitosamente!');
            console.log('📄 Información:', resultado);
          } else {
            console.error('❌ Error en la carga:', resultado);
          }
        } catch (error) {
          console.error('❌ Error parseando respuesta:', error.message);
          console.log('📄 Respuesta raw:', data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Error en la petición:', error.message);
    });
    
    form.pipe(req);
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

function probarListarDocumentos() {
  console.log('🧪 Probando listar documentos...');
  
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/documents',
    method: 'GET'
  }, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const resultado = JSON.parse(data);
        console.log('✅ Documentos obtenidos exitosamente!');
        console.log('📊 Total:', resultado.total || resultado.documentos?.length || 0);
        if (resultado.documentos && resultado.documentos.length > 0) {
          console.log('📄 Primer documento:', resultado.documentos[0]);
        }
      } catch (error) {
        console.error('❌ Error parseando respuesta:', error.message);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Error en la petición:', error.message);
  });
  
  req.end();
}

// Ejecutar pruebas
console.log('🎯 Iniciando pruebas de documentos...\n');

// Primero cargar un documento
probarCargaDocumento();

// Esperar un poco y luego listar documentos
setTimeout(() => {
  console.log('\n📋 Listando documentos...');
  probarListarDocumentos();
}, 2000);
