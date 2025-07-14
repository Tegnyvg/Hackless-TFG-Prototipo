// Controlador de usuarios
const userController = {
  // Obtener todos los usuarios
  getUsers: async (req, res) => {
    try {
      const users = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          dni: '12345678',
          telefono: '+54 9 11 1234-5678',
          cargo: 'Operador',
          fecha_ingreso: '2024-01-15'
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria@example.com',
          dni: '87654321',
          telefono: '+54 9 11 8765-4321',
          cargo: 'Supervisora',
          fecha_ingreso: '2023-08-20'
        },
        {
          id: 3,
          nombre: 'Carlos',
          apellido: 'López',
          email: 'carlos@example.com',
          dni: '11223344',
          telefono: '+54 9 11 2233-4455',
          cargo: 'Técnico',
          fecha_ingreso: '2024-03-10'
        }
      ];
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener usuarios',
        error: error.message 
      });
    }
  },

  // Carga masiva desde Excel
  uploadExcel: async (req, res) => {
    try {
      // Simular procesamiento de archivo Excel
      const processedUsers = [
        { dni: '12345678', nombre: 'Juan', apellido: 'Pérez', status: 'created' },
        { dni: '87654321', nombre: 'María', apellido: 'González', status: 'updated' },
        { dni: '11223344', nombre: 'Carlos', apellido: 'López', status: 'created' }
      ];
      
      res.json({ 
        success: true, 
        message: 'Archivo procesado exitosamente',
        processed: processedUsers.length,
        created: processedUsers.filter(u => u.status === 'created').length,
        updated: processedUsers.filter(u => u.status === 'updated').length,
        details: processedUsers
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al procesar archivo Excel',
        error: error.message 
      });
    }
  },

  // Crear nuevo usuario
  createUser: async (req, res) => {
    try {
      const { nombre, apellido, email, dni, telefono, cargo } = req.body;
      
      // Validaciones básicas
      if (!nombre || !apellido || !email || !dni) {
        return res.status(400).json({ 
          success: false, 
          message: 'Campos requeridos: nombre, apellido, email, dni' 
        });
      }
      
      const newUser = {
        id: Date.now(),
        nombre,
        apellido,
        email,
        dni,
        telefono: telefono || null,
        cargo: cargo || 'Empleado',
        fecha_ingreso: new Date().toISOString().split('T')[0]
      };
      
      res.status(201).json({ 
        success: true, 
        message: 'Usuario creado exitosamente',
        user: newUser
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al crear usuario',
        error: error.message 
      });
    }
  },

  // Obtener usuario por ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = {
        id: parseInt(id),
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        dni: '12345678',
        telefono: '+54 9 11 1234-5678',
        cargo: 'Operador',
        fecha_ingreso: '2024-01-15'
      };
      
      res.json({ 
        success: true, 
        user 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener usuario',
        error: error.message 
      });
    }
  },

  // Actualizar usuario
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, email, telefono, cargo } = req.body;
      
      res.json({ 
        success: true, 
        message: 'Usuario actualizado exitosamente',
        userId: parseInt(id)
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar usuario',
        error: error.message 
      });
    }
  },

  // Eliminar usuario
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      res.json({ 
        success: true, 
        message: 'Usuario eliminado exitosamente' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar usuario',
        error: error.message 
      });
    }
  }
};

module.exports = userController;
