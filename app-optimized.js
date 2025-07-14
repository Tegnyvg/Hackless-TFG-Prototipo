require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de configuración
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'hackless_secret_key_2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Crear directorio de uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Rutas principales
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const documentRoutes = require('./src/routes/documents');
const demoRoutes = require('./src/routes/demo');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/demo', demoRoutes);

// Endpoints heredados para compatibilidad
app.post('/register', require('./src/controllers/authController').register);
app.post('/login', require('./src/controllers/authController').login);
app.post('/logout', require('./src/controllers/authController').logout);
app.get('/users', require('./src/controllers/userController').getUsers);
app.post('/users/upload-excel', require('./src/controllers/userController').uploadExcel);

// Página principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hackless - Sistema de Gestión</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh; 
                display: flex; 
                align-items: center; 
                justify-content: center;
            }
            .container { 
                background: white; 
                padding: 40px; 
                border-radius: 20px; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
                text-align: center; 
                max-width: 500px;
                margin: 20px;
            }
            h1 { color: #2c3e50; margin-bottom: 10px; font-size: 2.5em; }
            h2 { color: #34495e; margin-bottom: 20px; font-weight: 400; }
            .status { 
                background: #d4edda; 
                color: #155724; 
                padding: 15px; 
                border-radius: 10px; 
                margin: 20px 0; 
                font-weight: 600;
            }
            .links { margin-top: 30px; }
            .links a { 
                display: inline-block; 
                margin: 8px; 
                padding: 15px 25px; 
                background: #3498db; 
                color: white; 
                text-decoration: none; 
                border-radius: 10px; 
                font-weight: 500;
                transition: all 0.3s ease;
            }
            .links a:hover { 
                background: #2980b9; 
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
            }
            .footer { 
                margin-top: 30px; 
                color: #7f8c8d; 
                font-size: 14px; 
                border-top: 1px solid #ecf0f1; 
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛡️ Hackless</h1>
            <h2>Sistema de Gestión Documental</h2>
            <div class="status">✅ Servidor operativo</div>
            <p>Plataforma de gestión integral para empresas</p>
            <div class="links">
                <a href="/index.html">🏠 Inicio</a>
                <a href="/login.html">🔐 Acceder</a>
                <a href="/registro.html">📝 Registro</a>
            </div>
            <div class="footer">
                <strong>Desarrollado por:</strong> Verónica García<br>
                <small>Trabajo Final de Grado - VINF01264</small>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Inicialización del servidor
async function startServer() {
  try {
    await connectDB();
    console.log('✅ Base de datos conectada');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Hackless iniciado en puerto ${PORT}`);
      console.log(`🌐 Acceso local: http://localhost:${PORT}`);
      console.log(`📝 Panel admin: http://localhost:${PORT}/login.html`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;