/* Copilot: Sistema de gestión de documentos para Hackless - Manejo de subida,
   visualización, navegación, modal de demo y administración de documentos frontend. */

// script.js - Sistema de gestión de documentos refactorizado

/**
 * Clase para manejar la navegación general
 */
class NavigationManager {
    static navigateTo(url) {
        window.location.href = url;
    }

    static initializeCardLinks() {
        const cardLinks = document.querySelectorAll('.card-link');
        cardLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                // Navegación por defecto del href
            });
        });
    }

    static initializeSpecialButtons() {
        const goToDocumentsBtn = document.getElementById('goToDocuments');
        if (goToDocumentsBtn) {
            goToDocumentsBtn.addEventListener('click', () => {
                NavigationManager.navigateTo('documents.html');
            });
        }
    }
}

/**
 * Clase para manejar el sistema de documentos
 */
class DocumentManager {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000';
        this.documentUploadForm = document.getElementById('documentUploadForm');
        this.uploadMessage = document.getElementById('uploadMessage');
        this.documentsListDiv = document.getElementById('documentsList');
        this.refreshDocumentsButton = document.getElementById('refreshDocuments');
        
        this.init();
    }

    /**
     * Inicializa el sistema de documentos
     */
    init() {
        this.setTodayDate();
        this.initializeUploadForm();
        this.initializeRefreshButton();
        this.initializeFileInput();
        
        // Cargar documentos si estamos en la página de documentos
        if (this.documentsListDiv) {
            this.fetchDocuments();
        }
    }

    /**
     * Establece la fecha de hoy en los campos de fecha
     */
    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        const fechaEmisionInput = document.getElementById('fecha_emision');
        const fechaVencimientoInput = document.getElementById('fecha_vencimiento');
        
        if (fechaEmisionInput && !fechaEmisionInput.value) {
            fechaEmisionInput.value = today;
        }
        
        if (fechaVencimientoInput && !fechaVencimientoInput.value) {
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            fechaVencimientoInput.value = nextYear.toISOString().split('T')[0];
        }
    }

    /**
     * Muestra un mensaje al usuario
     */
    showMessage(message, type = 'info') {
        if (!this.uploadMessage) return;
        
        this.uploadMessage.textContent = message;
        this.uploadMessage.className = `message ${type}`;
    }

    /**
     * Inicializa el formulario de subida de documentos
     */
    initializeUploadForm() {
        if (!this.documentUploadForm) return;

        this.documentUploadForm.addEventListener('submit', async (event) => {
            await this.handleDocumentUpload(event);
        });
    }

    /**
     * Inicializa el input de archivo para mostrar el nombre
     */
    initializeFileInput() {
        const archivoPdfInput = document.getElementById('archivoPdf');
        const fileNameSpan = document.getElementById('fileName');
        
        if (archivoPdfInput && fileNameSpan) {
            archivoPdfInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    fileNameSpan.textContent = ` (${file.name})`;
                } else {
                    fileNameSpan.textContent = '';
                }
            });
        }
    }

    /**
     * Maneja la subida de documentos
     */
    async handleDocumentUpload(event) {
        event.preventDefault();
        
        const formData = new FormData(this.documentUploadForm);
        
        try {
            this.showMessage('Subiendo documento...', 'info');

            const response = await fetch(`${this.API_BASE_URL}/documents/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage(result.message, 'success');
                this.documentUploadForm.reset();
                this.setTodayDate();
                this.fetchDocuments();
            } else {
                this.showMessage(`Error: ${result.message || 'Algo salió mal.'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión. Verifica que el servidor esté activo.', 'error');
        }
    }

    /**
     * Inicializa el botón de actualizar documentos
     */
    initializeRefreshButton() {
        if (!this.refreshDocumentsButton) return;

        this.refreshDocumentsButton.addEventListener('click', () => {
            this.fetchDocuments();
        });
    }

    /**
     * Obtiene y muestra la lista de documentos
     */
    async fetchDocuments() {
        if (!this.documentsListDiv) return;

        this.documentsListDiv.innerHTML = '<p>Cargando documentos...</p>';
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/documents`);
            const result = await response.json();

            if (response.ok) {
                this.displayDocuments(result.documentos || []);
            } else {
                this.documentsListDiv.innerHTML = `<p class="message error">Error: ${result.message}</p>`;
            }
        } catch (error) {
            this.documentsListDiv.innerHTML = '<p class="message error">Error de conexión al obtener documentos.</p>';
        }
    }

    /**
     * Muestra la lista de documentos en el DOM
     */
    displayDocuments(documentos) {
        if (!documentos.length) {
            this.documentsListDiv.innerHTML = '<p>No hay documentos cargados.</p>';
            return;
        }

        let html = `
            <table class="documents-table striped-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Tipo</th>
                        <th>Emisión</th>
                        <th>Vencimiento</th>
                        <th>Archivo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        documentos.forEach(doc => {
            const usuario = doc.usuarioInfo || {};
            const fechaVencimiento = new Date(doc.fecha_vencimiento);
            const hoy = new Date();
            const diasParaVencer = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
            
            let estadoClass = '';
            if (diasParaVencer < 0) {
                estadoClass = 'vencido';
            } else if (diasParaVencer <= 30) {
                estadoClass = 'proximo-vencer';
            }

            const formattedEmision = doc.fecha_emision ? new Date(doc.fecha_emision).toLocaleDateString('es-AR') : 'N/A';
            const formattedVencimiento = fechaVencimiento.toLocaleDateString('es-AR');

            html += `
                <tr class="${estadoClass}">
                    <td>${doc.id_documento}</td>
                    <td>${doc.id_usuario} (${usuario.nombre || 'N/A'})</td>
                    <td>${doc.tipo_documento}</td>
                    <td>${formattedEmision}</td>
                    <td>${formattedVencimiento}</td>
                    <td>
                        <a href="/uploads/${doc.archivo_digital}" target="_blank" class="file-link">
                            📄 ${doc.archivo_digital}
                        </a>
                    </td>
                    <td>
                        <button onclick="documentManager.editDocument(${doc.id_documento})" class="btn-edit">Editar</button>
                        <button onclick="documentManager.deleteDocument(${doc.id_documento})" class="btn-delete">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="documents-summary">
                <p><strong>Total:</strong> ${documentos.length} documentos</p>
            </div>
        `;

        this.documentsListDiv.innerHTML = html;
    }

    /**
     * Edita un documento (placeholder para futura implementación)
     */
    editDocument(id) {
        // TODO: Implementar edición de documentos
        alert(`Función de edición para documento ${id} - Por implementar`);
    }

    /**
     * Elimina un documento
     */
    async deleteDocument(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/documents/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                alert('Documento eliminado exitosamente');
                this.fetchDocuments(); // Recargar la lista
            } else {
                alert(`Error al eliminar: ${result.message}`);
            }
        } catch (error) {
            alert('Error de conexión al eliminar el documento');
        }
    }
}

/**
 * Clase para manejar el modal de demo y otros modales
 */
class ModalManager {
    constructor() {
        this.initializeDemoModal();
    }

    /**
     * Inicializa el modal de solicitar demo
     */
    initializeDemoModal() {
        // Evento para el botón Solicitar Demo
        const demoBtns = document.querySelectorAll('.btn-solicitar-demo');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDemoModal();
            });
        });

        // Evento para cerrar modal con botón X
        const closeDemoBtn = document.getElementById('closeDemoModal');
        if (closeDemoBtn) {
            closeDemoBtn.addEventListener('click', () => this.closeDemoModal());
        }

        // Cerrar modal al hacer click fuera del contenido
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('demoModal');
            if (modal && event.target === modal) {
                this.closeDemoModal();
            }
        });

        // Evento para enviar el formulario de demo
        const demoForm = document.getElementById('demoForm');
        if (demoForm) {
            demoForm.addEventListener('submit', (e) => this.handleDemoFormSubmit(e));
        }
    }

    /**
     * Abre el modal de demo
     */
    openDemoModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * Cierra el modal de demo
     */
    closeDemoModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Maneja el envío del formulario de demo
     */
    async handleDemoFormSubmit(e) {
        e.preventDefault();
        
        const demoForm = document.getElementById('demoForm');
        const formData = new FormData(demoForm);
        
        try {
            const response = await fetch('http://localhost:3000/solicitar-demo', {
                method: 'POST',
                body: JSON.stringify({
                    nombre: formData.get('nombre'),
                    empresa: formData.get('empresa'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    mensaje: formData.get('mensaje')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('¡Gracias por solicitar una demo! Nos pondremos en contacto.');
                this.closeDemoModal();
                demoForm.reset();
            } else {
                alert('Hubo un error al enviar la solicitud. Intenta nuevamente.');
            }
        } catch (error) {
            alert('Error de conexión. Intenta más tarde.');
        }
    }
}

// Variables globales para acceso desde HTML onclick
let documentManager;
let modalManager;

/**
 * Función legacy para compatibilidad
 */
function setTodayDate() {
    if (documentManager) {
        documentManager.setTodayDate();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegación
    NavigationManager.initializeCardLinks();
    NavigationManager.initializeSpecialButtons();
    
    // Inicializar sistema de documentos
    documentManager = new DocumentManager();
    
    // Inicializar modal manager
    modalManager = new ModalManager();
});