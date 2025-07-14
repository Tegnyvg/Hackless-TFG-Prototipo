/* Copilot: Modelo de Empleado para gestión de RRHH con DNI como identificador único.
   Diseñado para sincronizar con planillas Excel y mantener registro completo del personal. */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  dni: {
    type: DataTypes.STRING(8),
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [8, 8],
      isNumeric: true
    },
    comment: 'DNI de 8 dígitos como identificador único del empleado'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    },
    comment: 'Nombre completo del empleado'
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Email único del empleado para acceso al sistema'
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Contraseña encriptada para acceso al sistema'
  },
  rol: {
    type: DataTypes.ENUM('empleado', 'supervisor', 'administrador'),
    allowNull: false,
    defaultValue: 'empleado',
    comment: 'Rol del empleado en el sistema'
  },
  puesto: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Puesto de trabajo del empleado'
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Área o departamento donde trabaja'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Número de teléfono de contacto'
  },
  fecha_ingreso: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha de ingreso a la empresa'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    allowNull: false,
    defaultValue: 'activo',
    comment: 'Estado actual del empleado'
  },
  legajo: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'Número de legajo interno de la empresa'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones adicionales sobre el empleado'
  },
  cambio_password_requerido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si debe cambiar la contraseña en el próximo login'
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha y hora del último acceso al sistema'
  }
}, {
  tableName: 'empleados',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  indexes: [
    {
      unique: true,
      fields: ['correo_electronico']
    },
    {
      fields: ['area']
    },
    {
      fields: ['puesto']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['fecha_ingreso']
    }
  ],
  hooks: {
    beforeValidate: (empleado) => {
      // Normalizar DNI (quitar espacios y caracteres no numéricos)
      if (empleado.dni) {
        empleado.dni = empleado.dni.toString().replace(/\D/g, '');
      }
      
      // Normalizar email a minúsculas
      if (empleado.correo_electronico) {
        empleado.correo_electronico = empleado.correo_electronico.toLowerCase().trim();
      }
      
      // Normalizar nombre (capitalizar)
      if (empleado.nombre) {
        empleado.nombre = empleado.nombre.trim().replace(/\s+/g, ' ');
      }
    }
  }
});

// Método para obtener información básica sin datos sensibles
Empleado.prototype.getPublicInfo = function() {
  const empleado = this.toJSON();
  delete empleado.contraseña;
  return empleado;
};

// Método estático para buscar por DNI
Empleado.findByDNI = async function(dni) {
  const dniNormalizado = dni.toString().replace(/\D/g, '');
  return await this.findByPk(dniNormalizado);
};

// Método estático para obtener estadísticas de empleados
Empleado.getEstadisticas = async function() {
  const total = await this.count();
  const activos = await this.count({ where: { estado: 'activo' } });
  const inactivos = await this.count({ where: { estado: 'inactivo' } });
  const suspendidos = await this.count({ where: { estado: 'suspendido' } });
  
  const porArea = await this.findAll({
    attributes: [
      'area',
      [sequelize.fn('COUNT', sequelize.col('dni')), 'cantidad']
    ],
    where: { area: { [sequelize.Op.not]: null } },
    group: ['area'],
    order: [[sequelize.fn('COUNT', sequelize.col('dni')), 'DESC']]
  });
  
  const porPuesto = await this.findAll({
    attributes: [
      'puesto',
      [sequelize.fn('COUNT', sequelize.col('dni')), 'cantidad']
    ],
    where: { puesto: { [sequelize.Op.not]: null } },
    group: ['puesto'],
    order: [[sequelize.fn('COUNT', sequelize.col('dni')), 'DESC']]
  });
  
  return {
    total,
    porEstado: { activos, inactivos, suspendidos },
    porArea: porArea.map(item => ({
      area: item.area,
      cantidad: parseInt(item.dataValues.cantidad)
    })),
    porPuesto: porPuesto.map(item => ({
      puesto: item.puesto,
      cantidad: parseInt(item.dataValues.cantidad)
    }))
  };
};

module.exports = Empleado;
