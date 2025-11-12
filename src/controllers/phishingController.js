// src/controllers/phishingController.js
// Controlador para simulaciones de phishing según lineamientos TFG

const SimulacionPhishing = require('../../models/SimulacionPhishing');
const RespuestaPhishing = require('../../models/RespuestaPhishing');
const Usuario = require('../../models/Usuario');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const phishingController = {
  
  // Crear nueva campaña de phishing
  crearCampana: async (req, res) => {
    try {
      const { 
        nombre_campana,
        descripcion,
        tipo_ataque,
        template_usado,
        objetivo_simulacion,
        fecha_inicio,
        destinatarios 
      } = req.body;

      // Generar URL única para la campaña
      const urlToken = crypto.randomBytes(16).toString('hex');
      const url_phishing = `${process.env.APP_URL || 'http://localhost:3000'}/phishing/${urlToken}`;

      const nuevaCampana = await SimulacionPhishing.create({
        nombre_campana,
        descripcion,
        tipo_ataque,
        template_usado,
        objetivo_simulacion,
        fecha_inicio: new Date(fecha_inicio),
        total_destinatarios: destinatarios ? destinatarios.length : 0,
        url_phishing,
        creado_por: req.user.id,
        configuracion_email: {
          remitente: 'noreply@empresa-ficticia.com',
          asunto: this.getTemplateAsunto(template_usado),
          urlToken
        }
      });

      // Si hay destinatarios, crear registros de tracking
      if (destinatarios && destinatarios.length > 0) {
        const respuestas = destinatarios.map(id_empleado => ({
          id_simulacion: nuevaCampana.id_simulacion,
          id_empleado
        }));
        
        await RespuestaPhishing.bulkCreate(respuestas);
      }

      res.status(201).json({
        success: true,
        message: 'Campaña de phishing creada exitosamente',
        campana: {
          id: nuevaCampana.id_simulacion,
          nombre: nuevaCampana.nombre_campana,
          url_phishing: nuevaCampana.url_phishing,
          total_destinatarios: nuevaCampana.total_destinatarios
        }
      });

    } catch (error) {
      console.error('Error creando campaña de phishing:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear campaña de phishing',
        error: error.message
      });
    }
  },

  // Listar campañas
  listarCampanas: async (req, res) => {
    try {
      const campanas = await SimulacionPhishing.findAll({
        include: [{
          model: Usuario,
          as: 'creador',
          attributes: ['id_usuario', 'nombre', 'correo_electronico']
        }],
        order: [['fecha_creacion', 'DESC']],
        where: { activo: true }
      });

      res.json({
        success: true,
        campanas
      });

    } catch (error) {
      console.error('Error listando campañas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener campañas'
      });
    }
  },

  // Iniciar campaña (enviar emails)
  iniciarCampana: async (req, res) => {
    try {
      const { id } = req.params;

      const campana = await SimulacionPhishing.findByPk(id);
      if (!campana) {
        return res.status(404).json({
          success: false,
          message: 'Campaña no encontrada'
        });
      }

      // Obtener destinatarios
      const respuestas = await RespuestaPhishing.findAll({
        where: { id_simulacion: id },
        include: [{
          model: Usuario,
          as: 'empleado',
          attributes: ['correo_electronico', 'nombre']
        }]
      });

      // Simular envío de emails (en producción se conectaría con nodemailer)
      let emailsEnviados = 0;
      const resultados = [];

      for (const respuesta of respuestas) {
        try {
          // Simular envío exitoso
          await RespuestaPhishing.update({
            email_enviado: true,
            fecha_envio: new Date()
          }, {
            where: { id_respuesta: respuesta.id_respuesta }
          });

          emailsEnviados++;
          resultados.push({
            empleado: respuesta.empleado.nombre,
            email: respuesta.empleado.correo_electronico,
            enviado: true
          });

        } catch (emailError) {
          resultados.push({
            empleado: respuesta.empleado.nombre,
            email: respuesta.empleado.correo_electronico,
            enviado: false,
            error: emailError.message
          });
        }
      }

      // Actualizar estadísticas de la campaña
      await SimulacionPhishing.update({
        estado: 'activa',
        emails_enviados: emailsEnviados,
        fecha_inicio: new Date()
      }, {
        where: { id_simulacion: id }
      });

      res.json({
        success: true,
        message: 'Campaña iniciada exitosamente',
        estadisticas: {
          total_destinatarios: respuestas.length,
          emails_enviados: emailsEnviados,
          errores: respuestas.length - emailsEnviados
        },
        resultados
      });

    } catch (error) {
      console.error('Error iniciando campaña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar campaña'
      });
    }
  },

  // Endpoint para capturar clicks en enlaces de phishing
  capturarClick: async (req, res) => {
    try {
      const { token } = req.params;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      // Buscar campaña por token
      const campana = await SimulacionPhishing.findOne({
        where: {
          'configuracion_email.urlToken': token,
          estado: 'activa'
        }
      });

      if (!campana) {
        return res.status(404).send('Enlace no válido o expirado');
      }

      // TODO: Implementar lógica para identificar qué empleado hizo click
      // Por simplicidad, mostraremos página de phishing genérica

      res.send(this.generarPaginaPhishing(campana.template_usado, token));

    } catch (error) {
      console.error('Error capturando click:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Registrar intento de credenciales
  registrarCredenciales: async (req, res) => {
    try {
      const { token, username, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;

      // Buscar campaña
      const campana = await SimulacionPhishing.findOne({
        where: {
          'configuracion_email.urlToken': token,
          estado: 'activa'
        }
      });

      if (campana) {
        // Actualizar estadísticas
        await SimulacionPhishing.increment('datos_ingresados', {
          where: { id_simulacion: campana.id_simulacion }
        });

        // Calcular nueva tasa de éxito
        const stats = await this.calcularEstadisticas(campana.id_simulacion);
        await SimulacionPhishing.update({
          tasa_exito: stats.tasa_vulnerabilidad
        }, {
          where: { id_simulacion: campana.id_simulacion }
        });
      }

      // Mostrar página de educación sobre phishing
      res.json({
        success: false,
        mensaje_educativo: '¡ALERTA! Acabas de ser víctima de una simulación de phishing.',
        recomendaciones: [
          'Nunca ingreses credenciales en enlaces de emails',
          'Verifica siempre la URL antes de introducir datos',
          'Reporta emails sospechosos al equipo de seguridad',
          'Mantente alerta ante solicitudes urgentes por email'
        ],
        redirect: '/capacitacion-phishing.html'
      });

    } catch (error) {
      console.error('Error registrando credenciales:', error);
      res.status(500).json({ error: 'Error interno' });
    }
  },

  // Obtener estadísticas de campaña
  obtenerEstadisticas: async (req, res) => {
    try {
      const { id } = req.params;

      const campana = await SimulacionPhishing.findByPk(id);
      if (!campana) {
        return res.status(404).json({
          success: false,
          message: 'Campaña no encontrada'
        });
      }

      const estadisticas = await this.calcularEstadisticas(id);

      res.json({
        success: true,
        campana: {
          nombre: campana.nombre_campana,
          estado: campana.estado,
          fecha_inicio: campana.fecha_inicio
        },
        estadisticas
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas'
      });
    }
  },

  // Métodos auxiliares
  getTemplateAsunto: function(template) {
    const asuntos = {
      'banco_falso': '🔒 Verificación urgente de tu cuenta bancaria',
      'rrhh_documento': 'Documento importante de Recursos Humanos',
      'ti_actualizacion': 'Actualización crítica de seguridad - Acción requerida',
      'premio_falso': '🎉 ¡Felicitaciones! Has ganado un premio',
      'facturacion': 'Factura pendiente de pago - Atención inmediata'
    };
    return asuntos[template] || 'Información importante';
  },

  generarPaginaPhishing: function(template, token) {
    // Página HTML simple que simula un login falso
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Verificación de Seguridad</title>
        <style>
            body { font-family: Arial; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .logo { text-align: center; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
            .btn { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
            .alert { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🔒 Verificación de Seguridad</div>
            
            <div class="alert">
                Por motivos de seguridad, necesitamos verificar tu identidad.
            </div>
            
            <form id="phishingForm">
                <div class="form-group">
                    <label>Usuario/Email:</label>
                    <input type="text" name="username" required>
                </div>
                
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" name="password" required>
                </div>
                
                <button type="submit" class="btn">Verificar Identidad</button>
            </form>
        </div>
        
        <script>
            document.getElementById('phishingForm').onsubmit = function(e) {
                e.preventDefault();
                fetch('/api/phishing/credenciales', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: '${token}',
                        username: this.username.value,
                        password: this.password.value
                    })
                }).then(r => r.json()).then(data => {
                    if(data.redirect) window.location.href = data.redirect;
                    else alert(data.mensaje_educativo);
                });
            };
        </script>
    </body>
    </html>`;
  },

  calcularEstadisticas: async function(idSimulacion) {
    const respuestas = await RespuestaPhishing.findAll({
      where: { id_simulacion: idSimulacion }
    });

    const total = respuestas.length;
    const enviados = respuestas.filter(r => r.email_enviado).length;
    const abiertos = respuestas.filter(r => r.email_abierto).length;
    const clicks = respuestas.filter(r => r.link_clickeado).length;
    const credenciales = respuestas.filter(r => r.credenciales_ingresadas).length;
    const reportados = respuestas.filter(r => r.phishing_reportado).length;

    return {
      total_destinatarios: total,
      emails_enviados: enviados,
      emails_abiertos: abiertos,
      clicks_recibidos: clicks,
      credenciales_ingresadas: credenciales,
      phishing_reportado: reportados,
      tasa_apertura: total > 0 ? ((abiertos / enviados) * 100).toFixed(2) : 0,
      tasa_click: total > 0 ? ((clicks / enviados) * 100).toFixed(2) : 0,
      tasa_vulnerabilidad: total > 0 ? ((credenciales / enviados) * 100).toFixed(2) : 0,
      tasa_reporte: total > 0 ? ((reportados / enviados) * 100).toFixed(2) : 0
    };
  }
};

module.exports = phishingController;