// Script para migrar la tabla usuarios con los nuevos campos
// Ejecutar: node scripts/migrate_usuario_fields.js

require('dotenv').config();
const { sequelize } = require('../config/database');
const Usuario = require('../models/Usuario');

async function migrateUsuarioFields() {
  try {
    console.log('🔄 Iniciando migración de campos en tabla usuarios...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');
    
    // Sincronizar el modelo (esto agregará los campos faltantes)
    await Usuario.sync({ alter: true });
    console.log('✅ Modelo Usuario sincronizado');
    
    // Verificar la estructura de la tabla
    const tableDescription = await sequelize.getQueryInterface().describeTable('usuarios');
    console.log('📋 Estructura actual de la tabla usuarios:');
    console.log(Object.keys(tableDescription));
    
    // Verificar que los nuevos campos estén presentes
    const requiredFields = ['fecha_ingreso', 'estado', 'created_at', 'updated_at'];
    const missingFields = requiredFields.filter(field => !tableDescription[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ Todos los campos requeridos están presentes');
      
      // Actualizar registros existentes con valores por defecto
      await sequelize.query(`
        UPDATE usuarios 
        SET estado = 'activo', 
            updated_at = NOW(),
            created_at = COALESCE(created_at, NOW())
        WHERE estado IS NULL OR created_at IS NULL
      `);
      
      console.log('✅ Registros existentes actualizados con valores por defecto');
    } else {
      console.log('❌ Campos faltantes:', missingFields);
    }
    
    console.log('🎉 Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar solo si el archivo se llama directamente
if (require.main === module) {
  migrateUsuarioFields()
    .then(() => {
      console.log('✅ Proceso de migración finalizado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en migración:', error.message);
      process.exit(1);
    });
}

module.exports = { migrateUsuarioFields };
