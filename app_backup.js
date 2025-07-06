require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Configuración de base de datos y modelos
const { connectDB, sequelize } = require('./config/database');
const Usuario = require('./models/Usuario');
const Documentacion = require('./models/Documentacion');
const SolicitudDemo = require('./models/SolicitudDemo');

const app = express();

// Configuración de middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'hackless_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Crear directorio de uploads si no existe
const directorioUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(directorioUploads)) {
  fs.mkdirSync(directorioUploads, { recursive: true });
}

// Middleware de autenticación para administradores
function verificarAdministrador(req, res, next) {
  if (req.session?.user?.rol === 'admin') {
    return next();
  }
  res.status(401).json({ 
    message: 'Acceso no autorizado. Se requieren privilegios de administrador.' 
  });
}

// Endpoint de prueba para verificar conectividad
app.post('/test', (req, res) => {
  console.log('📨 Datos recibidos en test:', req.body);
  res.json({ 
    mensaje: 'Conexión exitosa con el servidor Hackless',
    datosRecibidos: req.body,
    timestamp: new Date().toISOString()
  });
});

// === GESTIÓN DE USUARIOS ===

// Registro de nuevos usuarios
app.post('/register', async (req, res) => {
  const { nombre, correo_electronico, password, confirm_password, rol } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
    return res.status(400).json({ 
      message: 'Todos los campos son obligatorios para completar el registro.' 
    });
  }

  // Validación de coincidencia de contraseñas
  if (password !== confirm_password) {
    return res.status(400).json({ 
      message: 'Las contraseñas no coinciden. Verifica e intenta nuevamente.' 
    });
  }

  // Validación de seguridad de contraseña
  const esContrasenaSegura = password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && 
    /[0-9]/.test(password) && 
    /[^A-Za-z0-9]/.test(password);

  if (!esContrasenaSegura) {
    return res.status(400).json({ 
      message: 'La contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos especiales.' 
    });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo_electronico } });
    if (usuarioExistente) {
      return res.status(409).json({ 
        message: 'Este correo electrónico ya está registrado en el sistema.' 
      });
    }

    // Crear nuevo usuario con contraseña encriptada
    const contrasenaEncriptada = await bcrypt.hash(password, 12);
    const nuevoUsuario = await Usuario.create({ 
      nombre, 
      correo_electronico, 
      contraseña: contrasenaEncriptada, 
      rol 
    });

    // Respuesta sin datos sensibles
    const datosUsuario = nuevoUsuario.toJSON();
    delete datosUsuario.contraseña;

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente en el sistema Hackless.', 
      usuario: datosUsuario 
    });

  } catch (error) {
    console.error('❌ Error en registro de usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor. Inténtalo más tarde.' 
    });
  }
});

// Inicio de sesión de usuarios
app.post('/login', async (req, res) => {
  const { correo_electronico, password } = req.body;

  if (!correo_electronico || !password) {
    return res.status(400).json({ 
      message: 'El correo electrónico y la contraseña son obligatorios.' 
    });
  }

  try {
    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    
    if (!usuario) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas. Verifica tu información.' 
      });
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.contraseña);
    if (!contrasenaValida) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas. Verifica tu información.' 
      });
    }

    // Preparar datos de respuesta sin información sensible
    const datosUsuario = usuario.toJSON();
    delete datosUsuario.contraseña;

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso. Bienvenido a Hackless.', 
      usuario: datosUsuario 
    });

  } catch (error) {
    console.error('❌ Error en inicio de sesión:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor. Inténtalo más tarde.' 
    });
  }
});

// Subir documento de usuario
app.post('/documents/upload', upload.single('archivoPdf'), async (req, res) => {
  const { id_usuario, tipo_documento, fecha_emision, fecha_vencimiento } = req.body;
  const archivoSubido = req.file?.filename;

  if (!id_usuario || !tipo_documento || !fecha_vencimiento || !archivoSubido) {
    return res.status(400).json({ 
      message: 'Faltan datos obligatorios: usuario, tipo de documento, fecha de vencimiento o archivo.' 
    });
  }

  try {
    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(parseInt(id_usuario));
    if (!usuario) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado en el sistema.' 
      });
    }

    // Crear registro del documento
    const documento = await Documentacion.create({
      id_usuario,
      tipo_documento,
      fecha_emision,
      fecha_vencimiento,
      archivo_digital: archivoSubido
    });

    res.status(201).json({ 
      message: 'Documento cargado exitosamente en el sistema Hackless.', 
      documento 
    });

  } catch (error) {
    console.error('❌ Error al cargar documento:', error);
    res.status(500).json({ 
      message: 'Error interno al procesar el documento.' 
    });
  }
});

// Listar todos los documentos con información de usuario
app.get('/documents', async (req, res) => {
  try {
    const documentos = await Documentacion.findAll({
      include: [{
        model: Usuario,
        as: 'usuarioInfo',
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      total: documentos.length, 
      documentos,
      mensaje: 'Documentos obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    res.status(500).json({ 
      message: 'Error al obtener la lista de documentos.' 
    });
  }
});

// Obtener documento específico por ID
app.get('/documents/:id', async (req, res) => {
  const idDocumento = req.params.id;

  if (isNaN(idDocumento)) {
    return res.status(400).json({ 
      message: 'ID de documento inválido.' 
    });
  }

  try {
    const documento = await Documentacion.findByPk(idDocumento, {
      include: [{
        model: Usuario,
        as: 'usuarioInfo',
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol']
      }]
    });

    if (!documento) {
      return res.status(404).json({ 
        message: 'Documento no encontrado en el sistema.' 
      });
    }

    res.status(200).json({ 
      documento,
      mensaje: 'Documento obtenido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al buscar documento:', error);
    res.status(500).json({ 
      message: 'Error al buscar el documento solicitado.' 
    });
  }
});

// Procesar solicitud de demostración
app.post('/solicitar-demo', async (req, res) => {
  const { nombre, empresa, email, telefono, mensaje } = req.body;
  
  if (!nombre || !empresa || !email) {
    return res.status(400).json({ 
      message: 'Nombre, empresa y email son campos obligatorios.' 
    });
  }

  try {
    const nuevaSolicitud = await SolicitudDemo.create({ 
      nombre, 
      empresa, 
      email, 
      telefono, 
      mensaje 
    });

    res.status(200).json({ 
      message: '¡Solicitud recibida exitosamente! Nos pondremos en contacto contigo pronto.', 
      solicitud: nuevaSolicitud 
    });

  } catch (error) {
    console.error('❌ Error al procesar solicitud de demo:', error);
    res.status(500).json({ 
      message: 'Error interno al procesar tu solicitud. Inténtalo más tarde.' 
    });
  }
});

// Consultar solicitudes de demo (solo administradores)
app.get('/solicitudes-demo', verificarAdministrador, async (req, res) => {
  try {
    const solicitudes = await SolicitudDemo.findAll({ 
      order: [['createdAt', 'DESC']] 
    });

    res.status(200).json({ 
      total: solicitudes.length, 
      solicitudes,
      mensaje: 'Solicitudes de demo obtenidas exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener solicitudes de demo:', error);
    res.status(500).json({ 
      message: 'Error al obtener las solicitudes de demo.' 
    });
  }
});

// Exportar solicitudes de demo a CSV (solo administradores)
app.get('/solicitudes-demo/export', verificarAdministrador, async (req, res) => {
  try {
    const solicitudes = await SolicitudDemo.findAll({ 
      order: [['createdAt', 'DESC']] 
    });

    const campos = ['id', 'nombre', 'empresa', 'email', 'telefono', 'mensaje', 'createdAt'];
    const encabezado = campos.join(',') + '\n';
    
    const filas = solicitudes.map(solicitud => 
      campos.map(campo => {
        const valor = solicitud[campo] || '';
        return `"${String(valor).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const archivoCSV = encabezado + filas;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="solicitudes_demo_hackless.csv"');
    res.send(archivoCSV);

  } catch (error) {
    console.error('❌ Error al exportar solicitudes:', error);
    res.status(500).json({ 
      message: 'Error al exportar las solicitudes de demo.' 
    });
  }
});

// === AUTENTICACIÓN DE ADMINISTRADORES ===

// Inicio de sesión para administradores con manejo de sesión
app.post('/admin-login', async (req, res) => {
  const { correo_electronico, password, twofa_token } = req.body;
  
  if (!correo_electronico || !password) {
    return res.status(400).json({ 
      message: 'Correo electrónico y contraseña son obligatorios.' 
    });
  }

  try {
    const administrador = await Usuario.findOne({ where: { correo_electronico } });
    
    if (!administrador || administrador.rol !== 'admin') {
      return res.status(401).json({ 
        message: 'Acceso no autorizado. Solo administradores pueden acceder.' 
      });
    }

    const contrasenaValida = await bcrypt.compare(password, administrador.contraseña);
    if (!contrasenaValida) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas.' 
      });
    }

    // Verificación de 2FA si está habilitado
    if (administrador.twofa_enabled) {
      if (!twofa_token) {
        return res.status(401).json({ 
          message: 'Se requiere código de autenticación de dos factores (2FA).' 
        });
      }

      const codigoValido = speakeasy.totp.verify({
        secret: administrador.twofa_secret,
        encoding: 'base32',
        token: twofa_token,
        window: 1
      });

      if (!codigoValido) {
        return res.status(401).json({ 
          message: 'Código 2FA inválido. Verifica e intenta nuevamente.' 
        });
      }
    }

    // Crear sesión de administrador
    req.session.user = { 
      id: administrador.id_usuario, 
      rol: administrador.rol, 
      nombre: administrador.nombre 
    };

    res.status(200).json({ 
      message: 'Inicio de sesión administrativo exitoso. Bienvenido a Hackless.' 
    });

  } catch (error) {
    console.error('❌ Error en login de administrador:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor.' 
    });
  }
});

// Cerrar sesión de administrador
app.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('❌ Error al cerrar sesión:', error);
      return res.status(500).json({ 
        message: 'Error al cerrar la sesión.' 
      });
    }
    
    res.status(200).json({ 
      message: 'Sesión cerrada exitosamente.' 
    });
  });
});

// === RECUPERACIÓN DE CONTRASEÑA ===

// --- Recuperación de contraseña (solicitud) ---
app.post('/admin/forgot-password', async (req, res) => {
  const { correo_electronico } = req.body;
  if (!correo_electronico) return res.status(400).json({ message: 'Correo requerido.' });
  try {
    const usuario = await Usuario.findOne({ where: { correo_electronico, rol: 'admin' } });
    if (!usuario) return res.status(404).json({ message: 'No existe admin con ese correo.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 30; // 30 minutos
    usuario.reset_token = token;
    usuario.reset_token_expires = expires;
    await usuario.save();
    // --- Enviar email (simulado en consola si no hay SMTP) ---
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@hackless.com',
        to: usuario.correo_electronico,
        subject: 'Recuperación de contraseña',
        text: `Para restablecer tu contraseña, visita: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${token}`
      });
    } else {
      console.log('Enlace de recuperación:', `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${token}`);
    }
    res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al solicitar recuperación.' });
  }
});

// Restablecer contraseña con token
app.post('/admin/reset-password', async (req, res) => {
  const { token, password, confirm_password } = req.body;
  
  if (!token || !password || !confirm_password) {
    return res.status(400).json({ 
      message: 'Token, contraseña y confirmación son obligatorios.' 
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ 
      message: 'Las contraseñas no coinciden.' 
    });
  }

  const esContrasenaSegura = password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && 
    /[0-9]/.test(password) && 
    /[^A-Za-z0-9]/.test(password);

  if (!esContrasenaSegura) {
    return res.status(400).json({ 
      message: 'La contraseña debe tener mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos.' 
    });
  }

  try {
    const administrador = await Usuario.findOne({ 
      where: { reset_token: token, rol: 'admin' } 
    });

    if (!administrador || !administrador.reset_token_expires || administrador.reset_token_expires < Date.now()) {
      return res.status(400).json({ 
        message: 'Token inválido o expirado.' 
      });
    }

    administrador.contraseña = await bcrypt.hash(password, 12);
    administrador.reset_token = null;
    administrador.reset_token_expires = null;
    await administrador.save();

    res.status(200).json({ 
      message: 'Contraseña restablecida correctamente.' 
    });

  } catch (error) {
    console.error('❌ Error al restablecer contraseña:', error);
    res.status(500).json({ 
      message: 'Error interno al restablecer la contraseña.' 
    });
  }
});

// === AUTENTICACIÓN DE DOS FACTORES (2FA) ===

// Configurar 2FA para administradores
app.post('/admin/2fa/setup', verificarAdministrador, async (req, res) => {
  try {
    const administrador = await Usuario.findByPk(req.session.user.id);
    
    if (!administrador || administrador.rol !== 'admin') {
      return res.status(401).json({ 
        message: 'Acceso no autorizado.' 
      });
    }

    if (administrador.twofa_enabled) {
      return res.status(400).json({ 
        message: 'La autenticación de dos factores ya está activada.' 
      });
    }

    // Generar secreto TOTP
    const secreto2FA = speakeasy.generateSecret({
      name: `Hackless Admin (${administrador.correo_electronico})`,
      length: 20
    });

    administrador.twofa_secret = secreto2FA.base32;
    await administrador.save();

    // Generar código QR para Google Authenticator
    const urlOTPAuth = secreto2FA.otpauth_url;
    
    QRCode.toDataURL(urlOTPAuth, (error, codigoQR) => {
      if (error) {
        console.error('❌ Error generando código QR:', error);
        return res.status(500).json({ 
          message: 'Error al generar código QR para 2FA.' 
        });
      }
      
      res.json({ 
        qr: codigoQR, 
        secret: secreto2FA.base32,
        mensaje: 'Escanea el código QR con tu aplicación de autenticación'
      });
    });

  } catch (error) {
    console.error('❌ Error al configurar 2FA:', error);
    res.status(500).json({ 
      message: 'Error interno al configurar autenticación de dos factores.' 
    });
  }
});

// Verificar y activar 2FA
app.post('/admin/2fa/verify', verificarAdministrador, async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      message: 'El código de verificación es obligatorio.' 
    });
  }

  try {
    const administrador = await Usuario.findByPk(req.session.user.id);
    
    if (!administrador || administrador.rol !== 'admin' || !administrador.twofa_secret) {
      return res.status(401).json({ 
        message: 'Acceso no autorizado o configuración 2FA incompleta.' 
      });
    }

    const codigoValido = speakeasy.totp.verify({
      secret: administrador.twofa_secret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!codigoValido) {
      return res.status(400).json({ 
        message: 'Código de verificación inválido. Inténtalo nuevamente.' 
      });
    }

    administrador.twofa_enabled = true;
    await administrador.save();

    res.json({ 
      message: 'Autenticación de dos factores activada correctamente.',
      twofa_enabled: true
    });

  } catch (error) {
    console.error('❌ Error al verificar 2FA:', error);
    res.status(500).json({ 
      message: 'Error interno al verificar la autenticación de dos factores.' 
    });
  }
});

// Desactivar 2FA
app.post('/admin/2fa/disable', verificarAdministrador, async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      message: 'El código de verificación es obligatorio para desactivar 2FA.' 
    });
  }

  try {
    const administrador = await Usuario.findByPk(req.session.user.id);
    
    if (!administrador || administrador.rol !== 'admin' || !administrador.twofa_secret) {
      return res.status(401).json({ 
        message: 'Acceso no autorizado o 2FA no configurado.' 
      });
    }

    const codigoValido = speakeasy.totp.verify({
      secret: administrador.twofa_secret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (!codigoValido) {
      return res.status(400).json({ 
        message: 'Código de verificación inválido.' 
      });
    }

    administrador.twofa_enabled = false;
    administrador.twofa_secret = null;
    await administrador.save();

    res.json({ 
      message: 'Autenticación de dos factores desactivada correctamente.',
      twofa_enabled: false
    });

  } catch (error) {
    console.error('❌ Error al desactivar 2FA:', error);
    res.status(500).json({ 
      message: 'Error interno al desactivar la autenticación de dos factores.' 
    });
  }
});

// Obtener estado de 2FA
app.get('/admin/2fa/status', verificarAdministrador, async (req, res) => {
  try {
    const administrador = await Usuario.findByPk(req.session.user.id);
    
    if (!administrador || administrador.rol !== 'admin') {
      return res.status(401).json({ 
        message: 'Acceso no autorizado.' 
      });
    }

    res.json({ 
      enabled: !!administrador.twofa_enabled,
      usuario: administrador.nombre,
      mensaje: 'Estado de 2FA obtenido correctamente'
    });

  } catch (error) {
    console.error('❌ Error al consultar estado 2FA:', error);
    res.status(500).json({ 
      message: 'Error interno al consultar el estado de 2FA.' 
    });
  }
});

// === INICIALIZACIÓN DEL SERVIDOR ===
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar estado 2FA.' });
  }
});

// Obtener lista de usuarios para nómina
app.get('/users', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol', 'createdAt'],
      order: [['nombre', 'ASC']]
    });

    res.status(200).json({ 
      total: usuarios.length, 
      users: usuarios,
      mensaje: 'Lista de usuarios obtenida exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener la lista de usuarios.' 
    });
  }
});

// === GESTIÓN DE DOCUMENTOS ===

// --- Iniciar servidor ---
if (require.main === module) {
  // Solo inicia el servidor si este archivo es ejecutado directamente
  async function startServer() {
    try {
      await connectDB();
      // No usar alter: true para evitar problemas con índices
      await sequelize.sync({ force: false });
      console.log('📦 Base de datos sincronizada.');
      app.listen(process.env.PORT || 3000, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${process.env.PORT || 3000}`);
      });
    } catch (err) {
      console.error('❌ Error al iniciar servidor:', err);
      process.exit(1);
    }
  }
  startServer();
}

module.exports = app;

// RUTA: ACTUALIZAR UN DOCUMENTO (PUT /documents/:id)
// Recibe datos en req.body y actualiza un documento existente por ID.
app.put('/documents/:id', async (req, res) => {
    // ...
});

// Eliminar documento por ID
app.delete('/documents/:id', async (req, res) => {
  const idDocumento = req.params.id;

  if (isNaN(idDocumento)) {
    return res.status(400).json({ 
      message: 'ID de documento inválido.' 
    });
  }

  try {
    const documento = await Documentacion.findByPk(idDocumento);
    
    if (!documento) {
      return res.status(404).json({ 
        message: 'Documento no encontrado en el sistema.' 
      });
    }

    await documento.destroy();
    
    res.status(200).json({ 
      message: 'Documento eliminado exitosamente del sistema Hackless.' 
    });

  } catch (error) {
    console.error('❌ Error al eliminar documento:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el documento.' 
    });
  }
});

// === GESTIÓN DE SOLICITUDES DE DEMO ===