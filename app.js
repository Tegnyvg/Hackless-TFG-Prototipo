require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Models & DB
const { connectDB, sequelize } = require('./config/database');
const Usuario = require('./models/Usuario');
const Documentacion = require('./models/Documentacion');
const SolicitudDemo = require('./models/SolicitudDemo');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'hackless_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// --- Multer config ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- Verificar y crear carpeta uploads si no existe ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// --- Middleware simple de autenticación por sesión para admin ---
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.rol === 'admin') {
    return next();
  }
  res.status(401).json({ message: 'No autorizado. Debe iniciar sesión como admin.' });
}

// --- Ruta Test ---
app.post('/test', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({ recibido: req.body });
});

// --- Registro de Usuario ---
app.post('/register', async (req, res) => {
  const { nombre, correo_electronico, password, confirm_password, rol } = req.body;

  if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolo.' });
  }

  try {
    const existe = await Usuario.findOne({ where: { correo_electronico } });
    if (existe) return res.status(409).json({ message: 'El correo ya está registrado.' });

    const hash = await bcrypt.hash(password, 10);
    const nuevo = await Usuario.create({ nombre, correo_electronico, contraseña: hash, rol });

    const user = nuevo.toJSON();
    delete user.contraseña;

    res.status(201).json({ message: 'Usuario registrado exitosamente.', usuario: user });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ message: 'Error interno al registrar usuario.' });
  }
});

// --- Login de Usuario ---
app.post('/login', async (req, res) => {
  const { correo_electronico, password } = req.body;

  if (!correo_electronico || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas.' });

    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta.' });

    const data = usuario.toJSON();
    delete data.contraseña;

    res.status(200).json({ message: 'Inicio de sesión exitoso.', usuario: data });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno al iniciar sesión.' });
  }
});

// --- Subir Documento ---
app.post('/documents/upload', upload.single('archivoPdf'), async (req, res) => {
  const { id_usuario, tipo_documento, fecha_emision, fecha_vencimiento } = req.body;
  // El archivo se sube y se guarda en uploads/, Multer lo pone en req.file
  const archivo_digital = req.file ? req.file.filename : null; // Solo el nombre del archivo

  if (!id_usuario || !tipo_documento || !fecha_vencimiento || !archivo_digital) {
    return res.status(400).json({ message: 'Faltan datos o archivo.' });
  }

  try {
    const usuario = await Usuario.findByPk(parseInt(id_usuario));
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const doc = await Documentacion.create({
      id_usuario,
      tipo_documento,
      fecha_emision,
      fecha_vencimiento,
      archivo_digital // Solo el nombre, no la ruta completa
    });

    res.status(201).json({ message: 'Documento cargado exitosamente.', documento: doc });
  } catch (error) {
    console.error('Error al cargar documento:', error);
    res.status(500).json({ message: 'Error interno al cargar documento.' });
  }
});

// --- Listar Documentos ---
app.get('/documents', async (req, res) => {
  try {
    const documentos = await Documentacion.findAll({
      include: [{
        model: Usuario,
        as: 'usuarioInfo',
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol']
      }]
    });

    res.status(200).json({ total: documentos.length, documentos });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener documentos.' });
  }
});

// --- Obtener documento por ID ---
app.get('/documents/:id', async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) return res.status(400).json({ message: 'ID inválido.' });

  try {
    const doc = await Documentacion.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuarioInfo',
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol']
      }]
    });

    if (!doc) return res.status(404).json({ message: 'Documento no encontrado.' });

    res.status(200).json({ documento: doc });
  } catch (error) {
    console.error('Error al buscar documento por ID:', error);
    res.status(500).json({ message: 'Error al buscar documento.' });
  }
});

// --- Solicitar Demo (guardar en BD) ---
app.post('/solicitar-demo', async (req, res) => {
  const { nombre, empresa, email, telefono, mensaje } = req.body;
  if (!nombre || !empresa || !email) {
    return res.status(400).json({ message: 'Nombre, empresa y email son obligatorios.' });
  }
  try {
    const nuevaSolicitud = await SolicitudDemo.create({ nombre, empresa, email, telefono, mensaje });
    res.status(200).json({ message: 'Solicitud recibida. ¡Gracias!', solicitud: nuevaSolicitud });
  } catch (error) {
    console.error('Error al procesar solicitud de demo:', error);
    res.status(500).json({ message: 'Error interno al procesar la solicitud.' });
  }
});

// --- Consultar solicitudes de demo (desde BD) ---
app.get('/solicitudes-demo', requireAdmin, async (req, res) => {
  try {
    const solicitudes = await SolicitudDemo.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ total: solicitudes.length, solicitudes });
  } catch (error) {
    console.error('Error al leer solicitudes de demo:', error);
    res.status(500).json({ message: 'Error al leer solicitudes.' });
  }
});

// --- Exportar solicitudes de demo a Excel ---
app.get('/solicitudes-demo/export', requireAdmin, async (req, res) => {
  try {
    const solicitudes = await SolicitudDemo.findAll({ order: [['createdAt', 'DESC']] });
    const fields = ['id', 'nombre', 'empresa', 'email', 'telefono', 'mensaje', 'createdAt'];
    const header = fields.join(',') + '\n';
    const rows = solicitudes.map(s => fields.map(f => '"' + (s[f] ? String(s[f]).replace(/"/g, '""') : '') + '"').join(',')).join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="solicitudes_demo.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error al exportar solicitudes:', error);
    res.status(500).json({ message: 'Error al exportar.' });
  }
});

// --- Endpoint de login de admin que guarda sesión ---
app.post('/admin-login', async (req, res) => {
  const { correo_electronico, password, twofa_token } = req.body;
  if (!correo_electronico || !password) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
  }
  try {
    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(401).json({ message: 'No autorizado.' });
    }
    const match = await bcrypt.compare(password, usuario.contraseña);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta.' });
    if (usuario.twofa_enabled) {
      if (!twofa_token) return res.status(401).json({ message: 'Se requiere código 2FA.' });
      const verified = speakeasy.totp.verify({
        secret: usuario.twofa_secret,
        encoding: 'base32',
        token: twofa_token,
        window: 1
      });
      if (!verified) return res.status(401).json({ message: 'Código 2FA inválido.' });
    }
    req.session.user = { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre };
    res.status(200).json({ message: 'Login exitoso.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno.' });
  }
});

// --- Endpoint para cerrar sesión ---
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Sesión cerrada.' });
  });
});

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

// --- Recuperación de contraseña (reset) ---
app.post('/admin/reset-password', async (req, res) => {
  const { token, password, confirm_password } = req.body;
  if (!token || !password || !confirm_password) return res.status(400).json({ message: 'Datos incompletos.' });
  if (password !== confirm_password) return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolo.' });
  }
  try {
    const usuario = await Usuario.findOne({ where: { reset_token: token, rol: 'admin' } });
    if (!usuario || !usuario.reset_token_expires || usuario.reset_token_expires < Date.now()) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    usuario.contraseña = await bcrypt.hash(password, 10);
    usuario.reset_token = null;
    usuario.reset_token_expires = null;
    await usuario.save();
    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer contraseña.' });
  }
});

// --- 2FA: Generar secreto y QR para activar 2FA (solo admin autenticado) ---
app.post('/admin/2fa/setup', requireAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.session.user.id);
    if (!usuario || usuario.rol !== 'admin') return res.status(401).json({ message: 'No autorizado.' });
    if (usuario.twofa_enabled) return res.status(400).json({ message: '2FA ya está activado.' });
    // Generar secreto TOTP
    const secret = speakeasy.generateSecret({
      name: `Hackless (${usuario.correo_electronico})`,
      length: 20
    });
    usuario.twofa_secret = secret.base32;
    await usuario.save();
    // Generar QR para Google Authenticator
    const otpauth = secret.otpauth_url;
    QRCode.toDataURL(otpauth, (err, qr) => {
      if (err) return res.status(500).json({ message: 'Error generando QR.' });
      res.json({ qr, secret: secret.base32 });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar secreto 2FA.' });
  }
});

// --- 2FA: Verificar código y activar 2FA ---
app.post('/admin/2fa/verify', requireAdmin, async (req, res) => {
  const { token } = req.body;
  try {
    const usuario = await Usuario.findByPk(req.session.user.id);
    if (!usuario || usuario.rol !== 'admin' || !usuario.twofa_secret) return res.status(401).json({ message: 'No autorizado.' });
    const verified = speakeasy.totp.verify({
      secret: usuario.twofa_secret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (!verified) return res.status(400).json({ message: 'Código inválido.' });
    usuario.twofa_enabled = true;
    await usuario.save();
    res.json({ message: '2FA activado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar 2FA.' });
  }
});

// --- 2FA: Desactivar 2FA (requiere código válido) ---
app.post('/admin/2fa/disable', requireAdmin, async (req, res) => {
  const { token } = req.body;
  try {
    const usuario = await Usuario.findByPk(req.session.user.id);
    if (!usuario || usuario.rol !== 'admin' || !usuario.twofa_secret) return res.status(401).json({ message: 'No autorizado.' });
    const verified = speakeasy.totp.verify({
      secret: usuario.twofa_secret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (!verified) return res.status(400).json({ message: 'Código inválido.' });
    usuario.twofa_enabled = false;
    usuario.twofa_secret = null;
    await usuario.save();
    res.json({ message: '2FA desactivado.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar 2FA.' });
  }
});

// --- Estado de 2FA para frontend admin ---
app.get('/admin/2fa/status', requireAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.session.user.id);
    if (!usuario || usuario.rol !== 'admin') return res.status(401).json({ message: 'No autorizado.' });
    res.json({ enabled: !!usuario.twofa_enabled });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar estado 2FA.' });
  }
});

// --- Iniciar servidor ---
if (require.main === module) {
  // Solo inicia el servidor si este archivo es ejecutado directamente
  async function startServer() {
    try {
      await connectDB();
      await sequelize.sync({ alter: true });
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

// RUTA: ELIMINAR UN DOCUMENTO (DELETE /documents/:id)
// Elimina un documento por su ID.
app.delete('/documents/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido.' });

    try {
        const doc = await Documentacion.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado.' });

        await doc.destroy();
        res.status(200).json({ message: 'Documento eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar documento:', error);
        res.status(500).json({ message: 'Error al eliminar documento.' });
    }
});