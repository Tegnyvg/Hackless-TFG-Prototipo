// hackless-backend/models/Documentacion.js
// Definición del modelo Documentacion para la tabla 'documentos'.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 
// Importa el modelo Usuario. Es crucial que Usuario esté definido antes de que Documentacion se asocie a él.
const Usuario = require('./Usuario.js'); 

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
    references: { 
      model: Usuario, 
      key: 'id_usuario'
    }
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

// --- Definir las relaciones AQUI, DESPUÉS de que AMBOS modelos estén definidos ---
// Esto es muy importante para Sequelize: las asociaciones deben hacerse una vez que ambos modelos existan.
// Aunque ya lo tenías, a veces el orden de importación/ejecución afecta.
Usuario.hasMany(Documentacion, { 
  foreignKey: 'id_usuario', 
  as: 'documentos' // Alias usado cuando consultas desde Usuario (ej. Usuario.findAll({ include: Documentacion.documentos }))
});
Documentacion.belongsTo(Usuario, { 
  foreignKey: 'id_usuario', 
  as: 'usuarioInfo' // Alias usado cuando consultas desde Documentacion (ej. Documentacion.findAll({ include: Documentacion.usuarioInfo }))
});
// --------------------------------------------------------------------------------

module.exports = Documentacion;