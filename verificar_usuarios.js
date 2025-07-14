const Usuario = require('./models/Usuario');

async function verificarUsuarios() {
    try {
        console.log('🔍 Verificando usuarios en la base de datos...');
        
        // Listar todos los usuarios
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombre', 'correo_electronico', 'telefono', 'rol'],
            limit: 10
        });
        
        console.log(`📊 Total de usuarios encontrados: ${usuarios.length}`);
        
        if (usuarios.length > 0) {
            console.log('\n👥 Usuarios disponibles:');
            usuarios.forEach(user => {
                console.log(`   ID: ${user.id_usuario} - ${user.nombre} (${user.correo_electronico}) - Rol: ${user.rol}`);
            });
            
            // Retornar el primer usuario para usar en las pruebas
            return usuarios[0];
        } else {
            console.log('❌ No hay usuarios en la base de datos');
            return null;
        }
        
    } catch (error) {
        console.error('❌ Error al verificar usuarios:', error.message);
        return null;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    verificarUsuarios().then(() => {
        console.log('✅ Verificación completada');
        process.exit(0);
    });
}

module.exports = { verificarUsuarios };
