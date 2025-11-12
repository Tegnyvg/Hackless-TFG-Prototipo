// Controlador de autenticación con JWT y bcrypt según lineamientos TFG
const bcrypt = require('bcryptjs');
const { Usuario } = require('../../models/Usuario');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwtAuth');

const authController = {
  // Registro de usuario con hash bcrypt
  register: async (req, res) => {
    try {
      const { nombre, apellido, email, password, dni, rol = 'empleado' } = req.body;
      
      // Validaciones básicas
      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son requeridos'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findOne({ 
        where: { correo_electronico: email } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con este email'
        });
      }

      // Hash de contraseña con bcrypt (factor 12 según lineamientos)
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const newUser = await Usuario.create({
        nombre,
        apellido,
        correo_electronico: email,
        contraseña: hashedPassword,
        rol,
        dni,
        fecha_creacion: new Date(),
        activo: true
      });

      // Generar tokens
      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id_usuario,
          nombre: newUser.nombre,
          email: newUser.correo_electronico,
          rol: newUser.rol
        },
        accessToken,
        refreshToken,
        expiresIn: '15m'
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message
      });
    }
  },

  // Login de usuario con JWT
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validación básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }
      
      // Buscar usuario por email
      const user = await Usuario.findOne({
        where: { correo_electronico: email }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }
      
      // Verificar si la cuenta está activa
      if (!user.activo) {
        return res.status(401).json({
          success: false,
          message: 'Cuenta desactivada'
        });
      }
      
      // Verificar contraseña con bcrypt
      const isValidPassword = await bcrypt.compare(password, user.contraseña);
      
      if (!isValidPassword) {
        // TODO: Implementar contador de intentos fallidos según lineamientos
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }
      
      // Generar tokens JWT
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          email: user.correo_electronico,
          rol: user.rol
        },
        accessToken,
        refreshToken,
        expiresIn: '15m',
        redirect: '/escritorio.html'
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  },

  // Logout de usuario (invalidar token en cliente)
  logout: (req, res) => {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente - eliminar tokens del cliente'
    });
  },

  // Verificar token JWT
  checkAuth: (req, res) => {
    // Este endpoint se ejecuta después del middleware verifyToken
    res.json({
      authenticated: true,
      user: req.user
    });
  }
};

module.exports = authController;
