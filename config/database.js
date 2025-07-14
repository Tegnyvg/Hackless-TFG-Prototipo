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
  // ...existing code...
} else {
  // Configuración para desarrollo local (MySQL)
  console.log('�️ Configurando base de datos MySQL para desarrollo local...');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
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