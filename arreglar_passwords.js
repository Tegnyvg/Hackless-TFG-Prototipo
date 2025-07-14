// Script para arreglar las contraseñas de los administradores
require('dotenv').config();
const { connectDB } = require('./config/database');
const Usuario = require('./models/Usuario');
const bcrypt = require('bcryptjs');

async function arreglarPasswords() {
  try {
    console.log('🔧 ARREGLANDO CONTRASEÑAS DE ADMINISTRADORES');
    console.log('='.repeat(50));
    
    await connectDB();
    
    // Obtener todos los administradores
    const admins = await Usuario.findAll({
      where: { rol: 'administrador' }
    });
    
    console.log(`\n👥 Encontrados ${admins.length} administradores`);
    
    for (const admin of admins) {
      console.log(`\n🔧 Procesando: ${admin.correo_electronico}`);
      
      // Verificar si la contraseña actual funciona
      const passwordActualFunciona = await bcrypt.compare('admin123!', admin.contraseña);
      
      if (passwordActualFunciona) {
        console.log('  ✅ La contraseña ya es correcta');
      } else {
        console.log('  🔄 Actualizando contraseña...');
        
        // Crear nuevo hash para admin123!
        const nuevoHash = await bcrypt.hash('admin123!', 12);
        admin.contraseña = nuevoHash;
        await admin.save();
        
        console.log('  ✅ Contraseña actualizada exitosamente');
      }
    }
    
    console.log('\n🎉 ¡Todas las contraseñas están arregladas!');
    console.log('\n🔐 CREDENCIALES PARA LOGIN:');
    console.log('-'.repeat(30));
    
    for (const admin of admins) {
      console.log(`📧 ${admin.correo_electronico}`);
      console.log(`🔑 admin123!`);
      console.log('-'.repeat(25));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

arreglarPasswords();
