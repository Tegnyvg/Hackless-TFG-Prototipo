// models/SimulacionPhishing.js
// Modelo para campañas de simulación de phishing según lineamientos TFG

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SimulacionPhishing = sequelize.define('SimulacionPhishing', {
  id_simulacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre_campana: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Nombre descriptivo de la campaña'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada de la campaña'
  },
  tipo_ataque: {
    type: DataTypes.ENUM('email', 'sms', 'llamada', 'link_malicioso'),
    allowNull: false,
    defaultValue: 'email',
    comment: 'Tipo de vector de ataque simulado'
  },
  template_usado: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Template de phishing utilizado'
  },
  objetivo_simulacion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Objetivo educativo de la simulación'
  },
  estado: {
    type: DataTypes.ENUM('borrador', 'activa', 'pausada', 'finalizada'),
    allowNull: false,
    defaultValue: 'borrador',
    comment: 'Estado actual de la campaña'
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de inicio de la campaña'
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de finalización de la campaña'
  },
  total_destinatarios: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número total de empleados objetivo'
  },
  emails_enviados: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Emails de phishing enviados'
  },
  clicks_recibidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Número de empleados que hicieron clic'
  },
  datos_ingresados: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Empleados que ingresaron credenciales'
  },
  reportes_recibidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Empleados que reportaron el email como sospechoso'
  },
  tasa_exito: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Porcentaje de empleados vulnerables'
  },
  creado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    },
    comment: 'Usuario que creó la campaña'
  },
  configuracion_email: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Configuración específica del email (remitente, asunto, etc.)'
  },
  url_phishing: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL única generada para la campaña'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'simulaciones_phishing',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_modificacion',
  comment: 'Tabla para gestionar campañas de simulación de phishing'
});

module.exports = SimulacionPhishing;