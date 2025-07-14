/* Sistema Hackless - Servidor backend principal para gestión de documentos,
   usuarios, autenticación 2FA y administración de solicitudes de demo.
   Incluye endpoints REST, validaciones robustas, seguridad y logging humanizado. */

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
const XLSX = require('xlsx');

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

// === ENDPOINTS PARA DESCARGA DE PLANTILLAS DE EMPLEADOS ===
app.get('/api/demo/generar-excel-empleados', (req, res) => {
  const filePath = path.join(__dirname, 'empleados_demo.xlsx');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'empleados_demo.xlsx');
  } else {
    res.status(404).send('Archivo de plantilla demo no encontrado');
  }
});

app.get('/api/demo/plantilla-empleados-vacia', (req, res) => {
  const filePath = path.join(__dirname, 'empleados_plantilla_vacia.xlsx');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'empleados_plantilla_vacia.xlsx');
  } else {
    res.status(404).send('Archivo de plantilla vacía no encontrado');
  }
});

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Configuración de Multer para archivos en memoria (Excel)
const memoryStorage = multer.memoryStorage();

const upload = multer({ storage });
const uploadMemory = multer({ storage: memoryStorage });

// Crear directorio de uploads si no existe
const directorioUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(directorioUploads)) {
  fs.mkdirSync(directorioUploads, { recursive: true });
}

// Middleware de autenticación para administradores
function verificarAdministrador(req, res, next) {
  if (req.session?.user?.rol === 'administrador') {
    return next();
  }
  res.status(401).json({ 
    message: 'Acceso no autorizado. Se requieren privilegios de administrador.' 
  });
}

// === RUTAS PARA PLANTILLAS EXCEL ESTRUCTURADAS ===
// Servir plantillas Excel
app.get('/empleados_plantilla_estructurada.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'empleados_plantilla_estructurada.xlsx');
  res.download(filePath, 'empleados_plantilla_estructurada.xlsx');
});

app.get('/empleados_ejemplo_actualizado.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'empleados_ejemplo_actualizado.xlsx');
  res.download(filePath, 'empleados_ejemplo_actualizado.xlsx');
});

// Generar plantilla estructurada dinámicamente
app.post('/api/generar-plantilla-estructurada', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('node generar_plantillas_estructuradas.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error generando plantilla:', error);
        return res.status(500).json({ message: 'Error al generar plantilla' });
      }
      
      const filePath = path.join(__dirname, 'empleados_plantilla_estructurada.xlsx');
      res.download(filePath, 'empleados_plantilla_estructurada.xlsx');
    });
  } catch (error) {
    console.error('Error al generar plantilla:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Generar ejemplo actualizado dinámicamente
app.post('/api/generar-ejemplo-actualizado', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('node generar_plantillas_estructuradas.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error generando ejemplo:', error);
        return res.status(500).json({ message: 'Error al generar ejemplo' });
      }
      
      const filePath = path.join(__dirname, 'empleados_ejemplo_actualizado.xlsx');
      res.download(filePath, 'empleados_ejemplo_actualizado.xlsx');
    });
  } catch (error) {
    console.error('Error al generar ejemplo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Validar estructura de archivo Excel
app.post('/api/validar-excel', uploadMemory.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      valido: false,
      errores: ['No se ha proporcionado ningún archivo']
    });
  }

  try {
    // Usar la clase ValidadorExcel
    const ValidadorExcel = require('./validar_excel');
    const validador = new ValidadorExcel();
    
    // Validar el archivo desde el buffer
    const resultado = await validador.validarArchivo(req.file.buffer);
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al validar archivo Excel:', error);
    res.status(500).json({ 
      valido: false,
      errores: ['Error interno al validar el archivo']
    });
  }
});

// === ENDPOINTS DE PRUEBA Y CONECTIVIDAD ===

// Endpoint raíz para healthcheck y página de bienvenida
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hackless - Sistema de Gestión Documental</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; margin-bottom: 20px; }
            .status { color: #27ae60; font-size: 24px; margin: 20px 0; }
            .links { margin-top: 30px; }
            .links a { display: inline-block; margin: 10px; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
            .links a:hover { background: #2980b9; }
            .info { color: #7f8c8d; margin-top: 20px; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛡️ Hackless</h1>
            <h2>Sistema de Gestión Documental y Ciberseguridad</h2>
            <div class="status">✅ Servidor funcionando correctamente</div>
            <p>Prototipo desarrollado como Trabajo Final de Grado</p>
            <div class="links">
                <a href="/login.html">🔐 Acceso al Sistema</a>
                <a href="/index.html">🏠 Página Principal</a>
                <a href="/registro.html">📝 Registro</a>
            </div>
            <div class="info">
                <p><strong>Desarrollado por:</strong> Verónica García - VINF01264</p>
                <p><strong>Universidad:</strong> Siglo 21</p>
                <p><strong>Año:</strong> 2025</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

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
  const { nombre, correo_electronico, password, confirm_password, rol, puesto, area, telefono } = req.body;

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
    const datosUsuario = { 
      nombre, 
      correo_electronico, 
      contraseña: contrasenaEncriptada, 
      rol 
    };

    // Agregar campos opcionales si están presentes
    if (puesto && puesto.trim()) datosUsuario.puesto = puesto.trim();
    if (area && area.trim()) datosUsuario.area = area.trim();
    if (telefono && telefono.trim()) datosUsuario.telefono = telefono.trim();

    const nuevoUsuario = await Usuario.create(datosUsuario);

    // Respuesta sin datos sensibles
    const respuestaUsuario = nuevoUsuario.toJSON();
    delete respuestaUsuario.contraseña;

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente en el sistema Hackless.', 
      usuario: respuestaUsuario 
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

// Obtener lista de usuarios para nómina
app.get('/users', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol'],
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

// Cargar usuarios desde archivo Excel
app.post('/users/upload-excel', uploadMemory.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      message: 'No se ha proporcionado ningún archivo Excel.' 
    });
  }

  try {
    // Leer el archivo Excel desde el buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const datos = XLSX.utils.sheet_to_json(worksheet);
    
    if (!datos || datos.length === 0) {
      return res.status(400).json({ 
        message: 'El archivo Excel está vacío o no contiene datos válidos.' 
      });
    }

    let usuariosCreados = 0;
    let usuariosExistentes = 0;
    let errores = [];

    // Procesar cada fila del Excel
    for (const [index, fila] of datos.entries()) {
      const filaNumero = index + 2; // +2 porque Excel inicia en 1 y tiene encabezado
      
      try {
        // Extraer datos de la fila (adaptable según las columnas del Excel)
        const nombre = fila['Nombre'] || fila['nombre'] || fila['Name'];
        const correo_electronico = fila['Email'] || fila['Correo'] || fila['correo_electronico'] || fila['Correo Electrónico'];
        const rol = fila['Rol'] || fila['rol'] || fila['Role'] || 'empleado';
        const puesto = fila['Puesto'] || fila['puesto'] || fila['Position'] || '';
        const area = fila['Area'] || fila['Área'] || fila['area'] || fila['Department'] || '';
        const telefono = fila['Telefono'] || fila['Teléfono'] || fila['telefono'] || fila['Phone'] || '';
        
        // Validar campos obligatorios
        if (!nombre || !correo_electronico) {
          errores.push(`Fila ${filaNumero}: Faltan campos obligatorios (Nombre y/o Email)`);
          continue;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo_electronico)) {
          errores.push(`Fila ${filaNumero}: Email inválido (${correo_electronico})`);
          continue;
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ 
          where: { correo_electronico } 
        });
        
        if (usuarioExistente) {
          usuariosExistentes++;
          continue;
        }

        // Generar contraseña temporal
        const contrasenaTemp = `Hackless${new Date().getFullYear()}!`;
        const contrasenaEncriptada = await bcrypt.hash(contrasenaTemp, 12);

        // Preparar datos del usuario
        const datosUsuario = {
          nombre: nombre.trim(),
          correo_electronico: correo_electronico.toLowerCase().trim(),
          contraseña: contrasenaEncriptada,
          rol: rol.toLowerCase().trim()
        };

        // Agregar campos opcionales si están presentes
        if (puesto && puesto.trim()) datosUsuario.puesto = puesto.trim();
        if (area && area.trim()) datosUsuario.area = area.trim();
        if (telefono && telefono.trim()) datosUsuario.telefono = telefono.trim();

        // Crear nuevo usuario
        await Usuario.create(datosUsuario);

        usuariosCreados++;

      } catch (errorFila) {
        errores.push(`Fila ${filaNumero}: Error al procesar - ${errorFila.message}`);
      }
    }

    // Preparar respuesta con resumen
    const respuesta = {
      message: `Proceso de carga completado`,
      resumen: {
        totalFilas: datos.length,
        usuariosCreados,
        usuariosExistentes,
        errores: errores.length
      },
      contrasenaTemporalInfo: usuariosCreados > 0 ? `Los nuevos usuarios tienen la contraseña: Hackless${new Date().getFullYear()}!` : null
    };

    if (errores.length > 0) {
      respuesta.detalleErrores = errores;
    }

    res.status(200).json(respuesta);

  } catch (error) {
    console.error('❌ Error al procesar archivo Excel:', error);
    res.status(500).json({ 
      message: 'Error interno al procesar el archivo Excel.',
      detalle: error.message
    });
  }
});

// === GESTIÓN DE DOCUMENTOS ===

// Subir documento de usuario
app.post('/api/documents', upload.single('archivoPdf'), async (req, res) => {
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
app.get('/api/documents', async (req, res) => {
  try {
    const documentos = await Documentacion.findAll({
      include: [{
        model: Usuario,
        as: 'usuarioInfo',
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol']
      }],
      order: [['id_documento', 'DESC']]
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
app.get('/api/documents/:id', async (req, res) => {
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
      order: [['id', 'DESC']] 
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
      order: [['id', 'DESC']] 
    });

    const campos = ['id', 'nombre', 'empresa', 'email', 'telefono', 'mensaje'];
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
    
    if (!administrador || administrador.rol !== 'administrador') {
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

// Solicitar recuperación de contraseña
app.post('/admin/forgot-password', async (req, res) => {
  const { correo_electronico } = req.body;
  
  if (!correo_electronico) {
    return res.status(400).json({ 
      message: 'El correo electrónico es obligatorio.' 
    });
  }

  try {
    const administrador = await Usuario.findOne({ 
      where: { correo_electronico, rol: 'administrador' } 
    });

    if (!administrador) {
      return res.status(404).json({ 
        message: 'No existe un administrador registrado con ese correo electrónico.' 
      });
    }

    const tokenRecuperacion = crypto.randomBytes(32).toString('hex');
    const tiempoExpiracion = Date.now() + (30 * 60 * 1000);

    administrador.reset_token = tokenRecuperacion;
    administrador.reset_token_expires = tiempoExpiracion;
    await administrador.save();

    if (process.env.SMTP_HOST) {
      const transportador = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const urlRecuperacion = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${tokenRecuperacion}`;

      await transportador.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@hackless.com',
        to: administrador.correo_electronico,
        subject: 'Recuperación de contraseña - Hackless',
        text: `Para restablecer tu contraseña de administrador, visita: ${urlRecuperacion}`
      });
    } else {
      console.log('🔗 Enlace de recuperación:', 
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${tokenRecuperacion}`);
    }

    res.status(200).json({ 
      message: 'Si el correo existe, se ha enviado un enlace de recuperación.' 
    });

  } catch (error) {
    console.error('❌ Error al solicitar recuperación:', error);
    res.status(500).json({ 
      message: 'Error interno al procesar la solicitud.' 
    });
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
      where: { reset_token: token, rol: 'administrador' } 
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
    
    if (!administrador || administrador.rol !== 'administrador') {
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
    
    if (!administrador || administrador.rol !== 'administrador' || !administrador.twofa_secret) {
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
    
    if (!administrador || administrador.rol !== 'administrador' || !administrador.twofa_secret) {
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
    
    if (!administrador || administrador.rol !== 'administrador') {
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

// Iniciar servidor solo si este archivo es ejecutado directamente
if (require.main === module) {
  async function iniciarServidor() {
    try {
      console.log('🚀 Iniciando servidor Hackless...');
      console.log(`🔒 Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
      console.log(`📡 Puerto: ${process.env.PORT || 3000}`);
      
      // Intentar conectar a la base de datos
      console.log('🔌 Conectando a la base de datos...');
      await connectDB();
      
      // Sincronizar modelos
      console.log('📦 Sincronizando modelos de base de datos...');
      await sequelize.sync({ force: false });
      console.log('✅ Base de datos sincronizada correctamente.');
      
      // Iniciar servidor
      const puerto = process.env.PORT || 3000;
      const servidor = app.listen(puerto, '0.0.0.0', () => {
        console.log(`🎉 Servidor Hackless ejecutándose exitosamente!`);
        console.log(`🌐 URL: http://localhost:${puerto}`);
        console.log(`  Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
        console.log(`🛡️ Sistema listo para recibir conexiones`);
      });

      // Manejo graceful shutdown
      process.on('SIGTERM', () => {
        console.log('⏹️ Cerrando servidor...');
        servidor.close(() => {
          console.log('✅ Servidor cerrado correctamente');
          process.exit(0);
        });
      });

    } catch (error) {
      console.error('❌ Error crítico al iniciar servidor Hackless:', error);
      console.error('🔍 Detalles del error:', error.message);
      console.error('📍 Stack trace:', error.stack);
      process.exit(1);
    }
  }
  
  iniciarServidor();
}

