// hackless-backend/models/Usuario.js
// Definición del modelo Usuario para la tabla 'usuarios' en la base de datos.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Importa la instancia de Sequelize

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Asegura que cada correo electrónico sea único
    validate: {
      isEmail: true // Valida que el formato sea de correo electrónico
    }
  },
  contraseña: { // Guardará la contraseña cifrada
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('administrador', 'operativo', 'auditor', 'supervisor', 'rrhh', 'seguridad_higiene'), // Roles definidos
    allowNull: false
  }
}, {
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: false // Desactiva los campos createdAt y updatedAt
});

module.exports = Usuario;