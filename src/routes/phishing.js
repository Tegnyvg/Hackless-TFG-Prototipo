// src/routes/phishing.js
// Rutas para simulaciones de phishing según lineamientos TFG

const express = require('express');
const router = express.Router();
const phishingController = require('../controllers/phishingController');
const { verifyToken, requireRole } = require('../middleware/jwtAuth');

// Rutas protegidas - requieren autenticación y roles específicos
router.post('/campana', 
  verifyToken, 
  requireRole(['administrador', 'supervisor', 'auditor']), 
  phishingController.crearCampana
);

router.get('/campanas', 
  verifyToken, 
  requireRole(['administrador', 'supervisor', 'auditor']), 
  phishingController.listarCampanas
);

router.post('/campana/:id/iniciar', 
  verifyToken, 
  requireRole(['administrador', 'supervisor']), 
  phishingController.iniciarCampana
);

router.get('/campana/:id/estadisticas', 
  verifyToken, 
  requireRole(['administrador', 'supervisor', 'auditor']), 
  phishingController.obtenerEstadisticas
);

// Rutas públicas - para captura de clicks de phishing (sin autenticación)
router.get('/click/:token', phishingController.capturarClick);
router.post('/credenciales', phishingController.registrarCredenciales);

module.exports = router;