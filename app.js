// hackless-backend/app.js
// Archivo principal del backend de Hackless.
// Configura el servidor Express, la conexión a la base de datos,
// define los modelos y sus relaciones, y expone las rutas API.

// -----------------------------------------------------------------------------
// 1. Carga de módulos y configuración inicial
// -----------------------------------------------------------------------------

// Carga las variables de entorno desde el archivo .env al inicio de la aplicación.
require('dotenv').config();

const express = require('express'); // Importa el framework Express.js
const app = express(); // Crea una instancia de la aplicación Express

const bcrypt = require('bcryptjs'); // Importa la librería para cifrado y comparación de contraseñas

// Define el puerto en el que el servidor escuchará.
// Toma el valor de la variable de entorno PORT o usa 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Importa la configuración de la base de datos y la instancia de Sequelize.
// 'sequelize' es la instancia de conexión configurada en database.js.
// 'connectDB' es la función que se encarga de probar y establecer la conexión a la BD.
const { connectDB, sequelize } = require('./config/database');

// Importa todos los modelos de la base de datos.
// Estos modelos definen la estructura de las tablas y cómo Sequelize interactúa con ellas.
const Usuario = require('./models/Usuario');
const Documentacion = require('./models/Documentacion');
const Auditoria = require('./models/Auditoria');
const Hallazgo = require('./models/Hallazgo');
const Capacitacion = require('./models/Capacitacion');
const ParticipacionCapacitacion = require('./models/ParticipacionCapacitacion'); // Modelo para la tabla de unión

// -----------------------------------------------------------------------------
// 2. Definición de relaciones entre modelos de Sequelize (Asociaciones)
// -----------------------------------------------------------------------------
// Es fundamental definir estas relaciones para que Sequelize entienda cómo las tablas
// están conectadas lógicamente. Esto permite usar métodos como `include` para
// obtener datos relacionados fácilmente.

// Relación Usuario - Documentacion: Un Usuario puede tener muchos Documentos.
Usuario.hasMany(Documentacion, { foreignKey: 'id_usuario', as: 'documentos' });
// Relación Documentacion - Usuario: Un Documento pertenece a un Usuario.
Documentacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Relación Auditoria - Hallazgo: Una Auditoria puede tener muchos Hallazgos.
Auditoria.hasMany(Hallazgo, { foreignKey: 'id_auditoria', as: 'hallazgos' });
// Relación Hallazgo - Auditoria: Un Hallazgo pertenece a una Auditoria.
Hallazgo.belongsTo(Auditoria, { foreignKey: 'id_auditoria', as: 'auditoria' });

// Relación Usuario - Capacitacion (Muchos a Muchos):
// Un Usuario puede participar en muchas Capacitaciones, y una Capacitación puede tener muchos Usuarios.
// Esto se gestiona a través de la tabla intermedia ParticipacionCapacitacion.
Usuario.belongsToMany(Capacitacion, {
  through: ParticipacionCapacitacion,
  foreignKey: 'id_usuario', // Clave foránea en la tabla intermedia que apunta a Usuario
  otherKey: 'id_capacitacion', // Clave foránea en la tabla intermedia que apunta a Capacitacion
  as: 'capacitacionesInscritas' // Alias para cuando consultamos las capacitaciones de un usuario
});
Capacitacion.belongsToMany(Usuario, {
  through: ParticipacionCapacitacion,
  foreignKey: 'id_capacitacion', // Clave foránea en la tabla intermedia que apunta a Capacitacion
  otherKey: 'id_usuario', // Clave foránea en la tabla intermedia que apunta a Usuario
  as: 'participantes' // Alias para cuando consultamos los participantes de una capacitación
});

// Relaciones para la tabla intermedia ParticipacionCapacitacion misma:
// Una fila en ParticipacionCapacitacion pertenece a un Usuario.
ParticipacionCapacitacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuarioParticipante' });
// Una fila en ParticipacionCapacitacion pertenece a una Capacitacion.
ParticipacionCapacitacion.belongsTo(Capacitacion, { foreignKey: 'id_capacitacion', as: 'capacitacionRealizada' });

// --- Fin de definición de relaciones ---

// -----------------------------------------------------------------------------
// 3. Middlewares de Express
// -----------------------------------------------------------------------------

// Sirve archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta 'public'.
// Esta línea es fundamental y debe ir al principio de los middlewares,
// ANTES de cualquier otra ruta o middleware. Permite que el navegador acceda
// directamente a tus archivos del frontend como 'login.html', 'css/style.css', 'js/login.js'.
app.use(express.static('public'));

// IMPORTANTE: Middlewares para parsear el cuerpo de las solicitudes HTTP (JSON y URL-encoded)
// DEBEN IR ANTES de CUALQUIER middleware o ruta que intente acceder a req.body.
app.use(express.json()); // Para solicitudes con cuerpo en formato JSON (Content-Type: application/json)
app.use(express.urlencoded({ extended: true })); // Para solicitudes con cuerpo en formato URL-encoded (Content-Type: application/x-www-form-urlencoded).

// Middleware de depuración (opcional, útil para ver el cuerpo de la solicitud)
// Ahora este middleware se ejecuta DESPUÉS de que express.json() y express.urlencoded()
// hayan parseado el cuerpo de la solicitud, por lo que req.body ya tendrá contenido.
app.use((req, res, next) => {
  // console.log('--- DEBUG INFO DESPUÉS DE PARSEAR BODY (Middleware) ---');
  // console.log('Método:', req.method, 'URL:', req.url);
  // console.log('Headers recibidos (Middleware):', req.headers);
  // console.log('Cuerpo PARSEADO (req.body):', req.body); // req.body ahora debería tener contenido
  // console.log('----------------------------------------------------');
  next(); // Pasa el control al siguiente middleware o ruta
});


// -----------------------------------------------------------------------------
// 4. Rutas API (Endpoints del Backend)
// -----------------------------------------------------------------------------

// Ruta de prueba inicial: Responde a una solicitud GET a la raíz del servidor.
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend de Hackless! Autenticación, documentos y más listos.');
});

// RUTA: REGISTRAR UN NUEVO USUARIO (POST /register)
// Permite crear una nueva cuenta de usuario en el sistema con validaciones.
app.post('/register', async (req, res) => {
  // console.log('Contenido de req.body recibido en /register (después de body-parser):', req.body); // Debugging

  // Extrae los datos del cuerpo de la solicitud (desestructuración de objetos)
  const { nombre, correo_electronico, password, confirm_password, rol } = req.body;

  // 4.1. Validaciones de entrada de datos
  if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }
  // Validación de complejidad de la contraseña (mín. 8 caracteres, mayúscula, minúscula, número, carácter especial)
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.' });
  }

  try {
    // 4.2. Verifica si el correo electrónico ya está registrado en la base de datos
    const usuarioExistente = await Usuario.findOne({ where: { correo_electronico: correo_electronico } });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 4.3. Cifra la contraseña antes de almacenarla por seguridad
    const hashedPassword = await bcrypt.hash(password, 10); // '10' es el costo del salt (número de rondas de hash), un valor recomendado.

    // 4.4. Crea el nuevo usuario en la base de datos utilizando el modelo de Sequelize
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo_electronico,
      contraseña: hashedPassword, // Almacena la contraseña cifrada
      rol
    });

    // 4.5. Prepara la respuesta para el cliente: elimina la contraseña del objeto antes de enviarla por seguridad.
    const userResponse = nuevoUsuario.toJSON(); // Convierte el objeto Sequelize a un objeto JavaScript plano
    delete userResponse.contraseña; // Elimina la propiedad de la contraseña

    // 4.6. Envía una respuesta exitosa al cliente
    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      usuario: userResponse // Envía los datos del nuevo usuario (sin contraseña)
    });

  } catch (error) {
    // 4.7. Manejo de errores
    console.error('Error al registrar usuario:', error);
    // Manejo específico para errores de restricción única (ej. correo duplicado detectado por la BD)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
  }
});

// RUTA: INICIO DE SESIÓN (LOGIN) (POST /login)
// Autentica a un usuario y, si es exitoso, permite el acceso al sistema.
app.post('/login', async (req, res) => {
  // console.log('--- DEBUG INFO FOR /login (AFTER BODY-PARSER) ---');
  // console.log('Headers en /login:', req.headers);
  // console.log('Contenido de req.body recibido en /login (después de body-parser):', req.body);
  // console.log('----------------------------------------------------');

  const { correo_electronico, password } = req.body;

  // 4.1. Validaciones básicas de entrada
  if (!correo_electronico || !password) {
    return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios.' });
  }

  try {
    // 4.2. Busca al usuario en la base de datos por su correo electrónico
    const usuario = await Usuario.findOne({ where: { correo_electronico: correo_electronico } });

    // 4.3. Si el usuario no se encuentra, las credenciales son inválidas
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 4.4. Compara la contraseña proporcionada por el usuario con la contraseña cifrada almacenada
    const passwordValida = await bcrypt.compare(password, usuario.contraseña);

    // 4.5. Si las contraseñas no coinciden, las credenciales son inválidas
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 4.6. Prepara la respuesta: elimina la contraseña del objeto antes de enviarla.
    const userResponse = usuario.toJSON();
    delete userResponse.contraseña;

    // 4.7. Envía una respuesta de éxito con los datos del usuario (sin contraseña)
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      usuario: userResponse // Envía los datos del usuario logueado
    });

  } catch (error) {
    // 4.8. Manejo de errores
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
});

// RUTA: CARGAR DOCUMENTACIÓN (POST /documents/upload)
// Permite subir un nuevo documento asociado a un usuario existente.
app.post('/documents/upload', async (req, res) => {
  // console.log('Contenido de req.body recibido en /documents/upload (después de body-parser):', req.body); // Debugging

  const { id_usuario, tipo_documento, fecha_emision, fecha_vencimiento, archivo_digital } = req.body;

  // Validaciones de campos obligatorios para el documento
  if (!id_usuario || !tipo_documento || !fecha_vencimiento || !archivo_digital) {
    return res.status(400).json({ message: 'Faltan campos obligatorios para el documento: id_usuario, tipo_documento, fecha_vencimiento, archivo_digital.' });
  }

  // Asegura que id_usuario sea un número entero válido
  const parsedId = parseInt(id_usuario, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: 'El ID de usuario debe ser un número válido.' });
  }

  try {
    // Verifica que el usuario al que se va a asociar el documento realmente exista en la base de datos
    const usuarioExistente = await Usuario.findByPk(parsedId);
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuario no encontrado para asociar el documento.' });
    }

    // Crea el nuevo documento en la base de datos
    const nuevoDocumento = await Documentacion.create({
      id_usuario: parsedId,
      tipo_documento,
      fecha_emision, // Este campo puede ser null si no se proporciona, según el modelo
      fecha_vencimiento,
      archivo_digital // En un sistema real, esto almacenaría la URL o el nombre del archivo subido físicamente.
    });

    res.status(201).json({
      message: 'Documento cargado exitosamente.',
      documento: nuevoDocumento // Devuelve el objeto del documento creado
    });

  } catch (error) {
    console.error('Error al cargar documento:', error);
    res.status(500).json({ message: 'Error interno del servidor al cargar el documento.' });
  }
});

// RUTA: OBTENER LISTADO DE DOCUMENTOS (GET /documents)
// Permite obtener todos los documentos registrados, incluyendo información del usuario asociado.
app.get('/documents', async (req, res) => {
  try {
    // Busca todos los documentos y, gracias a las asociaciones, incluye la información del usuario relacionado.
    const documentos = await Documentacion.findAll({
      include: [{
        model: Usuario, // Incluye el modelo Usuario
        as: 'usuario', // Utiliza el alias definido en la asociación (Documentacion.belongsTo(Usuario, { as: 'usuario' }))
        attributes: ['id_usuario', 'nombre', 'correo_electronico', 'rol'] // Selecciona solo los atributos necesarios del usuario
      }]
    });

    if (documentos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron documentos.' });
    }

    res.status(200).json({
      message: 'Documentos recuperados exitosamente.',
      total: documentos.length,
      documentos: documentos // Devuelve la lista de documentos con la info del usuario
    });

  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener documentos.' });
  }
});

// -----------------------------------------------------------------------------
// 5. Lógica para iniciar el servidor y conectar a la base de datos
// -----------------------------------------------------------------------------

// Función asíncrona principal para iniciar la aplicación.
async function startServer() {
  // Primero, intenta establecer la conexión a la base de datos.
  await connectDB(); // Llama a la función de database.js para conectar.
  try {
    // Sincroniza los modelos de Sequelize con la base de datos.
    // 'alter: true' intentará realizar los cambios en la BD para que coincida con los modelos (añadir columnas, crear tablas).
    // Es útil en desarrollo, pero requiere precaución en entornos de producción.
    await sequelize.sync({ alter: true });
    console.log('Todas las tablas de la base de datos sincronizadas (creadas/actualizadas).');
  } catch (error) {
    console.error('Error al sincronizar las tablas de la base de datos:', error);
    // Si la sincronización falla, el proceso de la aplicación se termina.
    process.exit(1);
  }

  // Inicia el servidor Express para escuchar las peticiones HTTP en el puerto definido.
  app.listen(PORT, () => {
    console.log(`Servidor de Hackless ejecutándose en http://localhost:${PORT}`);
  });
}

// Llama a la función para iniciar el servidor cuando el script se ejecuta.
startServer();

// -----------------------------------------------------------------------------
// 6. Manejo de errores globales (para promesas no manejadas y excepciones no capturadas)
// -----------------------------------------------------------------------------
// Estos "listeners" ayudan a capturar y registrar errores que no fueron manejados
// explícitamente en bloques try-catch, evitando que la aplicación se caiga silenciosamente.

// Captura y registra promesas que fueron rechazadas pero no tuvieron un manejador de catch.
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // En una aplicación de producción, podrías querer registrar esto en un sistema de logs
  // o notificar a los administradores.
});

// Captura y registra excepciones síncronas que no fueron capturadas (errores inesperados).
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Es crítico para la estabilidad de la aplicación manejar estas excepciones.
  // A menudo, se recomienda terminar el proceso y usar un gestor de procesos (como PM2) para reiniciarlo.
  process.exit(1);
});