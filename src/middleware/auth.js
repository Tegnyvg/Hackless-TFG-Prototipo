const authenticateAdmin = (req, res, next) => {
  if (req.session?.user?.rol === 'administrador') {
    return next();
  }
  
  res.status(401).json({ 
    success: false,
    message: 'Acceso no autorizado. Se requieren privilegios de administrador.' 
  });
};

const authenticateUser = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  
  res.status(401).json({ 
    success: false,
    message: 'Sesión requerida. Por favor inicie sesión.' 
  });
};

// Middleware de autenticación general
const requireAuth = (req, res, next) => {
  if (req.session?.userId) {
    return next();
  }
  
  res.status(401).json({ 
    success: false,
    message: 'Acceso no autorizado. Por favor inicie sesión.' 
  });
};

// Middleware de autenticación de admin
const requireAdmin = (req, res, next) => {
  if (req.session?.userId && req.session?.userRole === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    success: false,
    message: 'Acceso denegado. Se requieren privilegios de administrador.' 
  });
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: 'Datos de entrada inválidos',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const key = `${ip}:${window}`;
    
    const currentRequests = requests.get(key) || 0;
    
    if (currentRequests >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Intente nuevamente más tarde.'
      });
    }
    
    requests.set(key, currentRequests + 1);
    
    // Limpiar entradas antiguas
    setTimeout(() => {
      requests.delete(key);
    }, windowMs);
    
    next();
  };
};

module.exports = {
  authenticateAdmin,
  authenticateUser,
  requireAuth,
  requireAdmin,
  validateRequest,
  rateLimiter
};
