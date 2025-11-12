// src/routes/metrics.js
// Rutas para métricas y dashboard

const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const { verifyToken, requireRole } = require('../middleware/jwtAuth');

// Dashboard principal - accesible para todos los roles autenticados
router.get('/dashboard', verifyToken, metricsController.getDashboardMetrics);

// Métricas específicas de campaña
router.get('/campaign/:id', verifyToken, metricsController.getCampaignMetrics);

// Reporte ejecutivo de seguridad - solo administradores
router.get('/security-report', verifyToken, requireRole(['administrador']), metricsController.getSecurityReport);

module.exports = router;