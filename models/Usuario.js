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
  id_usuario: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  contraseña: { // Guardará la contraseña cifrada
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('administrador', 'operativo', 'auditor', 'supervisor', 'rrhh', 'seguridad_higiene', 'empleado'), // Roles definidos
    allowNull: false
  },
  puesto: {
    type: DataTypes.STRING(100),
    allowNull: true // Campo opcional
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: true // Campo opcional
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true // Campo opcional
  },
  twofa_secret: {
    type: DataTypes.STRING(255),
    allowNull: true // Solo si el admin activa 2FA
  },
  twofa_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_token_expires: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: false // Desactiva los campos createdAt y updatedAt
});

module.exports = Usuario;