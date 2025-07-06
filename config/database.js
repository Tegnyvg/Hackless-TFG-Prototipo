// hackless-backend/config/database.js
// Configuración de la conexión a la base de datos MySQL utilizando Sequelize.

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { Sequelize, DataTypes } = require('sequelize'); // Importa Sequelize y DataTypes

// Crea una nueva instancia de Sequelize para conectar a la base de datos.
// Los parámetros se obtienen de las variables de entorno para mayor seguridad y flexibilidad.
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nombre de la base de datos (hackless_db)
  process.env.DB_USER,      // Usuario de la base de datos (root)
  process.env.DB_PASSWORD,  // Contraseña del usuario de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos (localhost)
    port: process.env.DB_PORT || 3306, // Puerto de MySQL, por defecto 3306
    dialect: 'mysql', // Especifica el dialecto de la base de datos a usar
    logging: false, // Desactiva los logs SQL en la consola para un output más limpio (puedes poner 'true' para depurar)
    dialectOptions: {
      charset: 'utf8mb4',
    },
    // Opciones adicionales para el pool de conexiones (recomendado para producción)
    pool: {
      max: 10,  // Número máximo de conexiones en el pool
      min: 0,   // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo, en ms, que el pool intentará obtener una conexión antes de lanzar un error
      idle: 10000 // Tiempo máximo, en ms, que una conexión puede estar inactiva antes de ser liberada
    }
  }
);

// Función asíncrona para probar la conexión a la base de datos.
async function connectDB() {
  try {
    await sequelize.authenticate(); // Intenta autenticarse con la base de datos
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    // Sale de la aplicación si no se puede establecer la conexión a la base de datos.
    process.exit(1);
  }
}

// Exporta la instancia de Sequelize, DataTypes y la función de conexión
// para que puedan ser utilizados en otros archivos del proyecto.
module.exports = {
  sequelize,
  DataTypes,
  connectDB
};