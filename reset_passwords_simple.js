const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

async function resetearPasswords() {
  try {
    console.log('🔧 Reseteando contraseñas...');
    
    // Hash de la nueva contraseña
    const passwordHash = await bcrypt.hash('admin123!', 12);
    console.log('🔑 Hash generado:', passwordHash.substring(0, 20) + '...');
    
    // Actualizar usando SQL crudo
    const [results] = await sequelize.query(
      "UPDATE usuarios SET contraseña = :password WHERE rol = 'administrador'",
      {
        replacements: { password: passwordHash }
      }
    );
    
    console.log('✅ Contraseñas actualizadas para administradores');
    console.log('📊 Filas afectadas:', results.affectedRows || 'Desconocido');
    
    // Verificar un usuario específico
    const [admin] = await sequelize.query(
      "SELECT correo_electronico, contraseña FROM usuarios WHERE correo_electronico = 'admin@hackless.com'",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (admin) {
      const esValida = await bcrypt.compare('admin123!', admin.contraseña);
      console.log('🧪 Verificación para admin@hackless.com:', esValida ? '✅ VÁLIDA' : '❌ INVÁLIDA');
    }
    
    await sequelize.close();
    console.log('🎉 Proceso completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetearPasswords();
