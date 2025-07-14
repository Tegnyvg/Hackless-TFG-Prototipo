const express = require('express');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, dni } = req.body;
    
    // Implementar lógica de registro
    res.json({ 
      success: true, 
      message: 'Usuario registrado exitosamente',
      userId: 1 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Implementar lógica de login
    req.session.userId = 1;
    req.session.userRole = 'admin';
    
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      redirect: '/escritorio.html'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
});

// Logout de usuario
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error al cerrar sesión' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Sesión cerrada exitosamente' 
    });
  });
});

// Obtener perfil del usuario
router.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado' 
    });
  }
  
  res.json({
    success: true,
    user: {
      id: req.session.userId,
      nombre: 'Usuario',
      apellido: 'Demo',
      email: 'demo@hackless.com',
      role: req.session.userRole
    }
  });
});

module.exports = router;
