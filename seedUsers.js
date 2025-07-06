// seedUsers.js
// Script para insertar usuarios ficticios masivamente en la base de datos Hackless
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const Usuario = require('./models/Usuario');

// Función para generar usuarios ficticios únicos y distribuir roles equitativamente
function generateUsers(count, roles) {
    const users = [];
    for (let i = 1; i <= count; i++) {
        const role = roles[(i - 1) % roles.length]; // Distribuye roles de forma rotativa
        const name = `Usuario Demo ${i}`;
        const email = `user${i}.${role}@hackless.com`;
        const password = 'password123!'; // Contraseña simple para todos los usuarios demo
        users.push({
            nombre: name,
            correo_electronico: email,
            contraseña_simple: password,
            rol: role
        });
    }
    return users;
}

async function seedUsers() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida para seeding.');
        await Usuario.sync({ alter: true });
        console.log('Tabla de usuarios sincronizada.');

        // --- Configura aquí la cantidad y los roles que quieres generar ---
        const numberOfUsersToGenerate = 20; // Cambia la cantidad según lo que necesites
        const desiredRoles = ['operativo', 'rrhh', 'supervisor', 'auditor', 'seguridad_higiene']; // Tus roles de ENUM

        const usersToSeed = generateUsers(numberOfUsersToGenerate, desiredRoles);

        for (const userData of usersToSeed) {
            // Verificar si el usuario ya existe
            const existingUser = await Usuario.findOne({ where: { correo_electronico: userData.correo_electronico } });
            if (existingUser) {
                console.log(`Usuario ${userData.correo_electronico} ya existe. Saltando.`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(userData.contraseña_simple, 10);
            await Usuario.create({
                nombre: userData.nombre,
                correo_electronico: userData.correo_electronico,
                contraseña: hashedPassword,
                rol: userData.rol
            });
            console.log(`Usuario ${userData.correo_electronico} insertado exitosamente.`);
        }
        console.log('Proceso de seeding de usuarios finalizado.');
    } catch (error) {
        console.error('Error durante el seeding de usuarios:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
}

seedUsers();
