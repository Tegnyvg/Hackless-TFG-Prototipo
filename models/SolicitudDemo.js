// models/SolicitudDemo.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SolicitudDemo = sequelize.define('SolicitudDemo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'solicitudes_demo',
  timestamps: true
});

module.exports = SolicitudDemo;
