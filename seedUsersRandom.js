// seedUsersRandom.js
// Script para insertar usuarios ficticios aleatorios en la base de datos Hackless
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const Usuario = require('./models/Usuario');

const roles = [
  'operativo',
  'rrhh',
  'supervisor',
  'auditor',
  'seguridad_higiene'
];

function randomName() {
  const nombres = ['Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Lucia', 'Diego', 'Valentina', 'Javier', 'Camila', 'Andres', 'Paula', 'Marcos', 'Florencia'];
  const apellidos = ['Perez', 'Lopez', 'Gomez', 'Martinez', 'Ramirez', 'Fernandez', 'Torres', 'Sanchez', 'Diaz', 'Romero', 'Alvarez', 'Ruiz', 'Moreno', 'Muñoz', 'Castro', 'Silva'];
  return `${nombres[Math.floor(Math.random()*nombres.length)]} ${apellidos[Math.floor(Math.random()*apellidos.length)]}`;
}

function randomEmail(nombre) {
  const doms = ['hackless.com', 'empresa.com', 'demo.com'];
  const base = nombre.toLowerCase().replace(/ /g, '.');
  return `${base}${Math.floor(Math.random()*1000)}@${doms[Math.floor(Math.random()*doms.length)]}`;
}

function randomRole() {
  return roles[Math.floor(Math.random()*roles.length)];
}

async function seedRandomUsers(cantidad = 50) {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida para seeding aleatorio.');
    await Usuario.sync({ alter: true });
    console.log('Tabla de usuarios sincronizada.');

    let insertados = 0;
    for (let i = 0; i < cantidad; i++) {
      const nombre = randomName();
      const correo_electronico = randomEmail(nombre);
      const rol = randomRole();
      const contraseña_simple = 'Password123!';
      const hashedPassword = await bcrypt.hash(contraseña_simple, 10);
      // Evitar duplicados por correo
      const existe = await Usuario.findOne({ where: { correo_electronico } });
      if (existe) {
        i--;
        continue;
      }
      await Usuario.create({
        nombre,
        correo_electronico,
        contraseña: hashedPassword,
        rol
      });
      insertados++;
      console.log(`Usuario ${correo_electronico} (${rol}) insertado.`);
    }
    console.log(`Se insertaron ${insertados} usuarios aleatorios.`);
  } catch (error) {
    console.error('Error durante el seeding aleatorio:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión a la base de datos cerrada.');
  }
}

// Cambia el número para la cantidad deseada
seedRandomUsers(50);
