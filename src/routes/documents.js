const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

// Configuración de multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Obtener documentos
router.get('/', requireAuth, async (req, res) => {
  try {
    const documents = [
      {
        id: 1,
        nombre: 'Certificado HSE',
        tipo: 'pdf',
        fecha_vencimiento: '2024-12-15',
        empleado_id: 1
      },
      {
        id: 2,
        nombre: 'Carnet de Conducir',
        tipo: 'pdf',
        fecha_vencimiento: '2025-06-30',
        empleado_id: 1
      }
    ];
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener documentos',
      error: error.message 
    });
  }
});

// Obtener contador de documentos
router.get('/count', requireAuth, async (req, res) => {
  try {
    res.json({ total: 156 });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al contar documentos',
      error: error.message 
    });
  }
});

// Subir documento
router.post('/', requireAuth, upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se ha subido ningún archivo' 
      });
    }
    
    const { nombre, tipo, fecha_vencimiento, empleado_id } = req.body;
    
    // Implementar lógica de guardado en BD
    res.status(201).json({ 
      success: true, 
      message: 'Documento subido exitosamente',
      documento: {
        id: Date.now(),
        nombre: nombre || req.file.originalname,
        archivo: req.file.filename,
        tipo: tipo || path.extname(req.file.originalname).substring(1),
        fecha_vencimiento,
        empleado_id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al subir documento',
      error: error.message 
    });
  }
});

// Descargar documento
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Implementar lógica de descarga
    const filePath = path.join(__dirname, '../../uploads', 'documento-ejemplo.pdf');
    res.download(filePath, 'documento.pdf');
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al descargar documento',
      error: error.message 
    });
  }
});

// Eliminar documento
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Implementar lógica de eliminación
    res.json({ 
      success: true, 
      message: 'Documento eliminado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar documento',
      error: error.message 
    });
  }
});

module.exports = router;
