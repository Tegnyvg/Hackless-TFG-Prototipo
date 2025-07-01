// hackless-backend/models/ParticipacionCapacitacion.js
// Definición del modelo para la tabla de unión entre Usuario y Capacitacion.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ParticipacionCapacitacion = sequelize.define('ParticipacionCapacitacion', {
  id_participacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_usuario: { // Clave foránea que se relaciona con el modelo Usuario
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_capacitacion: { // Clave foránea que se relaciona con el modelo Capacitacion
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_inscripcion: { // Puedes añadir la fecha en que el usuario se inscribió
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  certificado_emitido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'participacion_capacitaciones', // Nombre de la tabla en la base de datos
  timestamps: false
});

module.exports = ParticipacionCapacitacion;