// Rutas de autenticación con JWT según lineamientos TFG
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, refreshToken } = require('../middleware/jwtAuth');

// Rutas públicas (sin autenticación)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', refreshToken);

// Rutas protegidas (requieren token JWT)
router.post('/logout', verifyToken, authController.logout);
router.get('/check-auth', verifyToken, authController.checkAuth);

module.exports = router;