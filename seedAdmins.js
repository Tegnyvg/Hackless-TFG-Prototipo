// seedAdmins.js
// Script específico para insertar usuarios administradores para demostraciones
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const Usuario = require('./models/Usuario');

async function seedAdmins() {
    try {
        await sequelize.authenticate();
        console.log('🔗 Conexión a la base de datos establecida para seeding de administradores.');
        // No usar sync para evitar problemas con índices
        console.log('📋 Usando tabla de usuarios existente.');

        // --- Usuarios administradores para demo ---
        const adminUsers = [
            {
                nombre: 'Admin Principal',
                correo_electronico: 'admin@hackless.com',
                contraseña_simple: 'AdminPass123!',
                rol: 'admin'
            },
            {
                nombre: 'Admin Demo',
                correo_electronico: 'demo@hackless.com',
                contraseña_simple: 'DemoPass123!',
                rol: 'admin'
            },
            {
                nombre: 'Super Administrador',
                correo_electronico: 'superadmin@hackless.com',
                contraseña_simple: 'SuperPass123!',
                rol: 'admin'
            },
            {
                nombre: 'Admin Seguridad',
                correo_electronico: 'security@hackless.com',
                contraseña_simple: 'SecurePass123!',
                rol: 'admin'
            },
            {
                nombre: 'Administrador Sistemas',
                correo_electronico: 'sistemas@hackless.com',
                contraseña_simple: 'SisPass123!',
                rol: 'admin'
            }
        ];

        console.log('👤 Insertando usuarios administradores...\n');

        let insertedCount = 0;
        for (const userData of adminUsers) {
            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findOne({ where: { correo_electronico: userData.correo_electronico } });
            if (existingUser) {
                console.log(`⚠️  Usuario ${userData.correo_electronico} ya existe. Saltando.`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.contraseña_simple, 10);
            await Usuario.create({
                nombre: userData.nombre,
                correo_electronico: userData.correo_electronico,
                contraseña: hashedPassword,
                rol: userData.rol
            });
            
            console.log(`✅ Admin insertado: ${userData.nombre} (${userData.correo_electronico})`);
            insertedCount++;
        }

        console.log(`\n🎉 Proceso completado. ${insertedCount} administradores insertados.`);
        
        if (insertedCount > 0) {
            console.log('\n📝 Credenciales para la demo:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            adminUsers.forEach(admin => {
                console.log(`👤 ${admin.nombre}`);
                console.log(`   📧 Email: ${admin.correo_electronico}`);
                console.log(`   🔐 Pass:  ${admin.contraseña_simple}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Error durante el seeding de administradores:', error);
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

seedAdmins();
