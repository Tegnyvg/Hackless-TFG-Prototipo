// src/controllers/metricsController.js
// Controlador simple para métricas - versión de diagnóstico

const SimulacionPhishing = require('../../models/SimulacionPhishing');
const RespuestaPhishing = require('../../models/RespuestaPhishing');
const Usuario = require('../../models/Usuario');
const { Op } = require('sequelize');

const metricsController = {
  
  getDashboardMetrics: async function(req, res) {
    try {
      // Métricas básicas de prueba
      const totalUsuarios = await Usuario.count({ where: { activo: true } });
      const totalCampanas = await SimulacionPhishing.count({ where: { activo: true } });
      
      res.json({
        success: true,
        dashboard: {
          resumen: {
            total_usuarios: totalUsuarios || 0,
            total_campanas: totalCampanas || 0,
            campanas_activas: 0,
            emails_enviados: 0,
            clicks_recibidos: 0,
            credenciales_comprometidas: 0,
            tasa_vulnerabilidad_general: "0",
            tasa_click_general: "0"
          },
          usuarios_por_rol: [
            { rol: 'administrador', cantidad: 1 },
            { rol: 'empleado', cantidad: totalUsuarios - 1 }
          ],
          campanas_recientes: [],
          tendencia_mensual: [],
          efectividad_templates: []
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error obteniendo métricas de dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener métricas del dashboard',
        error: error.message
      });
    }
  },

  getCampaignMetrics: async function(req, res) {
    try {
      const { id } = req.params;
      
      const campana = await SimulacionPhishing.findByPk(id);
      if (!campana) {
        return res.status(404).json({
          success: false,
          message: 'Campaña no encontrada'
        });
      }

      res.json({
        success: true,
        campana: {
          id: campana.id_simulacion,
          nombre: campana.nombre_campana,
          estado: campana.estado,
          template: campana.template_usado,
          fecha_inicio: campana.fecha_inicio
        },
        metricas: {
          total_destinatarios: 0,
          emails_enviados: 0,
          emails_abiertos: 0,
          clicks_recibidos: 0,
          credenciales_ingresadas: 0,
          phishing_reportado: 0
        },
        tasas: {
          tasa_envio: "0",
          tasa_apertura: "0", 
          tasa_click: "0",
          tasa_vulnerabilidad: "0",
          tasa_reporte: "0"
        },
        analisis_por_area: [],
        timeline_respuestas: [],
        respuestas_detalladas: []
      });

    } catch (error) {
      console.error('Error obteniendo métricas de campaña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de la campaña'
      });
    }
  },

  getSecurityReport: async function(req, res) {
    try {
      res.json({
        success: true,
        reporte_ejecutivo: {
          resumen: {
            periodo_analizado: '3m',
            fecha_inicio: new Date(),
            total_simulaciones: 0,
            empleados_evaluados: 0,
            total_intentos_phishing: 0,
            empleados_vulnerables: 0,
            nivel_riesgo_organizacional: 'BAJO'
          },
          recomendaciones: [],
          campanas_analizadas: []
        }
      });

    } catch (error) {
      console.error('Error generando reporte de seguridad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de seguridad'
      });
    }
  }
};

module.exports = metricsController;

module.exports = metricsController;