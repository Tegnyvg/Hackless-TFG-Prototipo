// src/middleware/jwtAuth.js
// Middleware de autenticación JWT según lineamientos de seguridad TFG

const jwt = require('jsonwebtoken');
const { Usuario } = require('../../models/Usuario');

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hackless_jwt_secret_2025_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Token corto según lineamientos
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Genera token JWT con expiración corta
 */
const generateAccessToken = (user) => {
    const payload = {
        userId: user.id_usuario,
        email: user.correo_electronico,
        role: user.rol,
        type: 'access'
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'hackless-tfg',
        audience: 'hackless-users'
    });
};

/**
 * Genera refresh token
 */
const generateRefreshToken = (user) => {
    const payload = {
        userId: user.id_usuario,
        type: 'refresh'
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'hackless-tfg',
        audience: 'hackless-users'
    });
};

/**
 * Middleware de verificación JWT
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido',
                error: 'NO_TOKEN'
            });
        }
        
        const token = authHeader.substring(7);
        
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'hackless-tfg',
            audience: 'hackless-users'
        });
        
        // Verificar que sea token de acceso
        if (decoded.type !== 'access') {
            return res.status(401).json({
                success: false,
                message: 'Tipo de token inválido',
                error: 'INVALID_TOKEN_TYPE'
            });
        }
        
        // Buscar usuario en base de datos
        const user = await Usuario.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado',
                error: 'USER_NOT_FOUND'
            });
        }
        
        // Agregar datos del usuario al request
        req.user = {
            id: user.id_usuario,
            email: user.correo_electronico,
            role: user.rol,
            nombre: user.nombre
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado - renovación requerida',
                error: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'INVALID_TOKEN'
            });
        }
        
        console.error('Error en verificación JWT:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: 'INTERNAL_ERROR'
        });
    }
};

/**
 * Middleware de verificación de roles
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Permisos insuficientes para esta operación',
                required_roles: allowedRoles,
                user_role: req.user.role
            });
        }
        
        next();
    };
};

/**
 * Renovar token de acceso usando refresh token
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token requerido'
            });
        }
        
        // Verificar refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        
        if (decoded.type !== 'refresh') {
            return res.status(400).json({
                success: false,
                message: 'Token de tipo incorrecto'
            });
        }
        
        // Buscar usuario
        const user = await Usuario.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Generar nuevo access token
        const newAccessToken = generateAccessToken(user);
        
        res.json({
            success: true,
            message: 'Token renovado exitosamente',
            accessToken: newAccessToken,
            expiresIn: JWT_EXPIRES_IN
        });
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expirado - login requerido',
                error: 'REFRESH_TOKEN_EXPIRED'
            });
        }
        
        console.error('Error renovando token:', error);
        return res.status(500).json({
            success: false,
            message: 'Error renovando token'
        });
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    requireRole,
    refreshToken,
    JWT_SECRET
};