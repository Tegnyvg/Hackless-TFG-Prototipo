// hackless-backend/config/database.js
// Configuración de la conexión a la base de datos utilizando Sequelize.
// Soporta tanto MySQL (desarrollo local) como PostgreSQL (producción en Railway)

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { Sequelize, DataTypes } = require('sequelize'); // Importa Sequelize y DataTypes

// Detectar el entorno y configurar el dialecto apropiado
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.DATABASE_URL;

let sequelize;

if (isRailway || process.env.DATABASE_URL) {
  // Configuración para Railway (PostgreSQL)
  console.log('🚀 Configurando base de datos PostgreSQL para Railway...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Configuración para desarrollo local (MySQL)
  console.log('🛠️ Configurando base de datos MySQL para desarrollo local...');
  sequelize = new Sequelize(
    process.env.DB_NAME,      // Nombre de la base de datos (hackless_db)
    process.env.DB_USER,      // Usuario de la base de datos (root)
    process.env.DB_PASSWORD,  // Contraseña del usuario de la base de datos
    {
      host: process.env.DB_HOST, // Host de la base de datos (localhost)
      port: process.env.DB_PORT || 3306, // Puerto de MySQL, por defecto 3306
      dialect: 'mysql', // Especifica el dialecto de la base de datos a usar
      logging: false, // Desactiva los logs SQL en la consola para un output más limpio
      dialectOptions: {
        charset: 'utf8mb4',
      },
      // Opciones adicionales para el pool de conexiones
      pool: {
        max: 10,  // Número máximo de conexiones en el pool
        min: 0,   // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo, en ms, que el pool intentará obtener una conexión antes de lanzar un error
        idle: 10000 // Tiempo máximo, en ms, que una conexión puede estar inactiva antes de ser liberada
      }
    }
  );
}

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