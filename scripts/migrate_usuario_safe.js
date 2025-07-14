// Script para migrar la tabla usuarios con los nuevos campos - Versión segura
// Ejecutar: node scripts/migrate_usuario_safe.js

require('dotenv').config();
const { sequelize } = require('../config/database');

async function migrateUsuarioSafe() {
  try {
    console.log('🔄 Iniciando migración segura de campos en tabla usuarios...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');
    
    // Ejecutar comandos SQL seguros paso a paso
    const queries = [
      // 1. Agregar campo fecha_ingreso
      `ALTER TABLE usuarios ADD COLUMN fecha_ingreso DATE NULL COMMENT 'Fecha de ingreso del empleado'`,
      
      // 2. Agregar campo estado
      `ALTER TABLE usuarios ADD COLUMN estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Estado del empleado'`,
      
      // 3. Agregar campo created_at (permitir NULL inicialmente)
      `ALTER TABLE usuarios ADD COLUMN created_at DATETIME NULL DEFAULT NULL`,
      
      // 4. Agregar campo updated_at (permitir NULL inicialmente)
      `ALTER TABLE usuarios ADD COLUMN updated_at DATETIME NULL DEFAULT NULL`,
      
      // 5. Actualizar registros existentes con fecha actual
      `UPDATE usuarios SET 
         created_at = NOW(), 
         updated_at = NOW() 
       WHERE created_at IS NULL OR updated_at IS NULL`,
      
      // 6. Hacer los campos de timestamp NOT NULL después de llenarlos
      `ALTER TABLE usuarios MODIFY COLUMN created_at DATETIME NOT NULL`,
      `ALTER TABLE usuarios MODIFY COLUMN updated_at DATETIME NOT NULL`
    ];
    
    for (let i = 0; i < queries.length; i++) {
      try {
        console.log(`📝 Ejecutando paso ${i + 1}/${queries.length}...`);
        await sequelize.query(queries[i]);
        console.log(`✅ Paso ${i + 1} completado`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`⚠️  Paso ${i + 1} omitido - Campo ya existe`);
        } else {
          console.error(`❌ Error en paso ${i + 1}:`, error.message);
          throw error;
        }
      }
    }
    
    // Verificar la estructura final
    const [results] = await sequelize.query("DESCRIBE usuarios");
    console.log('📋 Estructura final de la tabla usuarios:');
    results.forEach(col => {
      console.log(`  ${col.Field} (${col.Type}) - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('🎉 Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar solo si el archivo se llama directamente
if (require.main === module) {
  migrateUsuarioSafe()
    .then(() => {
      console.log('✅ Proceso de migración finalizado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en migración:', error.message);
      process.exit(1);
    });
}

module.exports = { migrateUsuarioSafe };
