// Script para mostrar credenciales de testing manual
require('dotenv').config();
const { connectDB } = require('./config/database');
const Usuario = require('./models/Usuario');

async function mostrarCredenciales() {
  try {
    console.log('🔐 CREDENCIALES PARA TESTING MANUAL DE HACKLESS');
    console.log('='.repeat(60));
    
    await connectDB();
    
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol'],
      order: [['rol', 'DESC'], ['nombre', 'ASC']]
    });
    
    console.log(`\n👥 USUARIOS ENCONTRADOS: ${usuarios.length}`);
    console.log('-'.repeat(40));
    
    const admins = usuarios.filter(u => u.rol === 'administrador');
    const empleados = usuarios.filter(u => u.rol === 'empleado');
    
    if (admins.length > 0) {
      console.log('\n🛡️  ADMINISTRADORES:');
      console.log('   (Acceso completo al sistema)');
      console.log('-'.repeat(35));
      admins.forEach(admin => {
        console.log(`   📧 Email: ${admin.correo_electronico}`);
        console.log(`   👤 Nombre: ${admin.nombre}`);
        console.log(`   🔑 Contraseña: admin123!`);
        console.log(`   🆔 ID: ${admin.id_usuario}`);
        console.log('   ' + '·'.repeat(30));
      });
    }
    
    if (empleados.length > 0) {
      console.log('\n👷 EMPLEADOS:');
      console.log('   (Acceso limitado)');
      console.log('-'.repeat(25));
      empleados.forEach(emp => {
        console.log(`   📧 Email: ${emp.correo_electronico}`);
        console.log(`   👤 Nombre: ${emp.nombre}`);
        console.log(`   🔑 Contraseña: Hackless2025!`);
        console.log(`   🆔 ID: ${emp.id_usuario}`);
        console.log('   ' + '·'.repeat(30));
      });
    }
    
    console.log('\n🌐 URLS DE ACCESO:');
    console.log('-'.repeat(20));
    console.log('🏠 Página principal: http://localhost:3000');
    console.log('🔐 Login: http://localhost:3000/login.html');
    console.log('📝 Registro: http://localhost:3000/registro.html');
    console.log('📋 Testing Center: http://localhost:3000/testing-center.html');
    console.log('🖥️  Escritorio: http://localhost:3000/escritorio.html');
    console.log('📄 Documentos: http://localhost:3000/documents.html');
    console.log('🎯 Solicitudes Demo: http://localhost:3000/solicitudes-demo.html');
    
    console.log('\n💡 INFORMACIÓN DE TESTING:');
    console.log('-'.repeat(30));
    console.log('• Base de datos: MySQL en puerto 3306');
    console.log('• Servidor: http://localhost:3000');
    console.log('• Los administradores pueden:');
    console.log('  - Ver solicitudes de demo');
    console.log('  - Gestionar usuarios');
    console.log('  - Subir documentos');
    console.log('  - Configurar 2FA');
    console.log('• Los empleados pueden:');
    console.log('  - Subir documentos');
    console.log('  - Ver su escritorio');
    
    console.log('\n🔄 Para crear más usuarios:');
    console.log('• Usar el registro manual en /registro.html');
    console.log('• Subir archivo Excel con usuarios en bulk');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.log('\n🔧 Verifica que:');
    console.log('• MySQL esté ejecutándose en puerto 3306');
    console.log('• La base de datos "hackless_db" exista');
    console.log('• Las credenciales en .env sean correctas');
    process.exit(1);
  }
}

mostrarCredenciales();
