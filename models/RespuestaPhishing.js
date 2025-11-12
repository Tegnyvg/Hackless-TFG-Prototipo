// models/RespuestaPhishing.js
// Modelo para tracking individual de respuestas a simulaciones de phishing

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RespuestaPhishing = sequelize.define('RespuestaPhishing', {
  id_respuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_simulacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'simulaciones_phishing',
      key: 'id_simulacion'
    },
    comment: 'Referencia a la campaña de phishing'
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    },
    comment: 'Empleado que recibió el email'
  },
  email_enviado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si se envió el email al empleado'
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Momento del envío del email'
  },
  email_abierto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si el empleado abrió el email'
  },
  fecha_apertura: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Momento de apertura del email'
  },
  link_clickeado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si hizo clic en el enlace malicioso'
  },
  fecha_click: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Momento del clic en el enlace'
  },
  credenciales_ingresadas: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si ingresó credenciales en la página falsa'
  },
  fecha_credenciales: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Momento de ingreso de credenciales'
  },
  phishing_reportado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Si reportó el email como sospechoso'
  },
  fecha_reporte: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Momento del reporte del phishing'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IP desde donde se realizó la acción'
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Información del navegador/dispositivo'
  },
  tiempo_respuesta_segundos: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tiempo entre envío y primera acción (en segundos)'
  },
  nivel_vulnerabilidad: {
    type: DataTypes.ENUM('bajo', 'medio', 'alto', 'critico'),
    allowNull: true,
    comment: 'Nivel de vulnerabilidad del empleado según sus acciones'
  },
  notas_adicionales: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones adicionales del comportamiento'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'respuestas_phishing',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_modificacion',
  comment: 'Tracking individual de respuestas a campañas de phishing'
});

module.exports = RespuestaPhishing;