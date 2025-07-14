class DashboardManager {
  constructor() {
    this.currentUser = null;
    this.initializeEventListeners();
    this.loadUserData();
    this.loadDashboardData();
  }

  initializeEventListeners() {
    // Navegación del sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        if (section) {
          this.showSection(section);
          this.updateActiveNavItem(item);
        } else if (item.classList.contains('logout-btn')) {
          this.handleLogout();
        }
      });
    });

    // Botones de acciones
    document.getElementById('nuevaCapacitacion')?.addEventListener('click', () => {
      this.showCapacitacionForm();
    });

    document.getElementById('generarReporte')?.addEventListener('click', () => {
      this.generateReport();
    });

    // Actualizar datos cada 30 segundos
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Cargar datos específicos de la sección
      this.loadSectionData(sectionId);
    }
  }

  updateActiveNavItem(activeItem) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');
  }

  async loadUserData() {
    try {
      const response = await fetch('/api/auth/profile');
      if (response.ok) {
        const userData = await response.json();
        this.currentUser = userData;
        
        document.getElementById('currentUser').textContent = 
          `${userData.nombre} ${userData.apellido}`;
        
        if (userData.ultimo_acceso) {
          const lastLogin = new Date(userData.ultimo_acceso);
          document.getElementById('lastLogin').textContent = 
            lastLogin.toLocaleString('es-AR');
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  async loadDashboardData() {
    try {
      const [empleados, documentos, capacitaciones, hallazgos] = await Promise.all([
        fetch('/api/empleados/count').then(r => r.json()),
        fetch('/api/documentos/count').then(r => r.json()),
        fetch('/api/capacitaciones/count').then(r => r.json()),
        fetch('/api/hallazgos/count').then(r => r.json())
      ]);

      document.getElementById('totalEmpleados').textContent = empleados.total || 0;
      document.getElementById('totalDocumentos').textContent = documentos.total || 0;
      document.getElementById('totalCapacitaciones').textContent = capacitaciones.total || 0;
      document.getElementById('totalHallazgos').textContent = hallazgos.pendientes || 0;

      // Cargar actividad reciente
      this.loadRecentActivity();

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    }
  }

  async loadRecentActivity() {
    try {
      const response = await fetch('/api/actividad/reciente');
      if (response.ok) {
        const activities = await response.json();
        this.renderRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error al cargar actividad reciente:', error);
    }
  }

  renderRecentActivity(activities) {
    const activityList = document.getElementById('activityList');
    
    if (activities.length === 0) {
      activityList.innerHTML = '<p class="no-activity">No hay actividad reciente</p>';
      return;
    }

    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas ${this.getActivityIcon(activity.tipo)}"></i>
        </div>
        <div class="activity-content">
          <p>${activity.descripcion}</p>
          <small>${this.formatTimeAgo(activity.fecha)}</small>
        </div>
      </div>
    `).join('');
  }

  getActivityIcon(tipo) {
    const icons = {
      'documento': 'fa-file-alt',
      'empleado': 'fa-user-plus',
      'capacitacion': 'fa-graduation-cap',
      'hallazgo': 'fa-exclamation-triangle',
      'login': 'fa-sign-in-alt'
    };
    return icons[tipo] || 'fa-info-circle';
  }

  formatTimeAgo(fecha) {
    const now = new Date();
    const activityDate = new Date(fecha);
    const diffMs = now - activityDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    }
  }

  async loadSectionData(sectionId) {
    switch (sectionId) {
      case 'empleados':
        this.loadEmpleadosData();
        break;
      case 'documentos':
        this.loadDocumentosData();
        break;
      case 'capacitaciones':
        this.loadCapacitacionesData();
        break;
      case 'hallazgos':
        this.loadHallazgosData();
        break;
      case 'nomina':
        this.loadNominaData();
        break;
      case 'reportes':
        this.loadReportesData();
        break;
    }
  }

  async loadEmpleadosData() {
    try {
      const response = await fetch('/api/empleados');
      if (response.ok) {
        const empleados = await response.json();
        this.renderEmpleadosTable(empleados);
      }
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  }

  renderEmpleadosTable(empleados) {
    const tbody = document.getElementById('empleadosTable');
    
    if (empleados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No hay empleados registrados</td></tr>';
      return;
    }

    tbody.innerHTML = empleados.map(empleado => `
      <tr>
        <td>${empleado.dni}</td>
        <td>${empleado.nombre}</td>
        <td>${empleado.apellido}</td>
        <td>${empleado.email}</td>
        <td>${empleado.telefono || 'No disponible'}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="dashboard.editEmpleado(${empleado.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="dashboard.deleteEmpleado(${empleado.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  async loadDocumentosData() {
    try {
      const response = await fetch('/api/documentos');
      if (response.ok) {
        const documentos = await response.json();
        this.renderDocumentosGrid(documentos);
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  }

  renderDocumentosGrid(documentos) {
    const grid = document.querySelector('.documents-grid');
    
    if (documentos.length === 0) {
      grid.innerHTML = '<p class="no-documents">No hay documentos disponibles</p>';
      return;
    }

    grid.innerHTML = documentos.map(doc => `
      <div class="document-card">
        <div class="document-icon">
          <i class="fas ${this.getDocumentIcon(doc.tipo)}"></i>
        </div>
        <div class="document-info">
          <h4>${doc.nombre}</h4>
          <p>Tipo: ${doc.tipo}</p>
          <p>Vence: ${doc.fecha_vencimiento ? 
            new Date(doc.fecha_vencimiento).toLocaleDateString('es-AR') : 
            'Sin vencimiento'}</p>
          <span class="status-badge ${this.getDocumentStatus(doc.fecha_vencimiento)}">
            ${this.getDocumentStatusText(doc.fecha_vencimiento)}
          </span>
        </div>
      </div>
    `).join('');
  }

  getDocumentIcon(tipo) {
    const icons = {
      'pdf': 'fa-file-pdf',
      'doc': 'fa-file-word',
      'docx': 'fa-file-word',
      'xls': 'fa-file-excel',
      'xlsx': 'fa-file-excel',
      'jpg': 'fa-file-image',
      'jpeg': 'fa-file-image',
      'png': 'fa-file-image'
    };
    return icons[tipo.toLowerCase()] || 'fa-file-alt';
  }

  getDocumentStatus(fechaVencimiento) {
    if (!fechaVencimiento) return 'status-active';
    
    const now = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffDays = Math.ceil((vencimiento - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'status-expired';
    if (diffDays <= 30) return 'status-warning';
    return 'status-active';
  }

  getDocumentStatusText(fechaVencimiento) {
    if (!fechaVencimiento) return 'Vigente';
    
    const now = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffDays = Math.ceil((vencimiento - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays <= 30) return 'Por vencer';
    return 'Vigente';
  }

  showCapacitacionForm() {
    // Implementar modal o redirección para nueva capacitación
    alert('Función de nueva capacitación en desarrollo');
  }

  generateReport() {
    // Implementar generación de reportes
    alert('Función de generación de reportes en desarrollo');
  }

  editEmpleado(id) {
    // Implementar edición de empleado
    alert(`Editar empleado ID: ${id}`);
  }

  deleteEmpleado(id) {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      // Implementar eliminación
      alert(`Eliminar empleado ID: ${id}`);
    }
  }

  handleLogout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
      window.location.href = '/logout';
    }
  }
}

// Inicializar el dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new DashboardManager();
});

// Manejo de responsive menu
document.addEventListener('DOMContentLoaded', () => {
  const createMobileMenuToggle = () => {
    if (window.innerWidth <= 768) {
      let menuToggle = document.querySelector('.mobile-menu-toggle');
      if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.header').appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
          document.querySelector('.sidebar').classList.toggle('open');
        });
      }
    }
  };

  createMobileMenuToggle();
  window.addEventListener('resize', createMobileMenuToggle);
});
