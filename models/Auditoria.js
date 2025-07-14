// hackless-backend/models/Auditoria.js
// Modelo temporal simplificado para evitar errores de índices

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
  id_auditoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  responsable: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'auditorias',
  timestamps: false
});

module.exports = Auditoria;

module.exports = Auditoria;