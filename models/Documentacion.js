// hackless-backend/models/Documentacion.js
// Definición del modelo Documentacion para la tabla 'documentos'.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Importa la instancia de Sequelize

const Documentacion = sequelize.define('Documentacion', {
  id_documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: { // Clave foránea que se relacionará con el modelo Usuario
    type: DataTypes.INTEGER,
    allowNull: false,
    // La relación se define en app.js, Sequelize gestionará la clave foránea.
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fecha_emision: {
    type: DataTypes.DATEONLY, // Solo la fecha
    allowNull: true // Puede ser nulo si no todas las documentaciones tienen fecha de emisión
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY, // Solo la fecha
    allowNull: false
  },
  archivo_digital: { // Ruta o nombre del archivo almacenado
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'documentos', // Nombre de la tabla en la base de datos
  timestamps: false
});

module.exports = Documentacion;