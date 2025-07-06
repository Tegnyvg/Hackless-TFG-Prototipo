// hackless-backend/public/js/registro.js
// Este script maneja la lógica del formulario de registro en el frontend.

/**
 * Clase para manejar el sistema de registro
 */
class RegistrationManager {
    constructor() {
        this.registerForm = document.getElementById('registerForm');
        this.registerMessage = document.getElementById('registerMessage');
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.API_BASE_URL = 'http://localhost:3000';
        
        this.init();
    }

    /**
     * Inicializa el sistema de registro
     */
    init() {
        if (!this.registerForm) {
            console.error('El formulario de registro (ID "registerForm") no fue encontrado en el DOM.');
            return;
        }

        this.registerForm.addEventListener('submit', (event) => this.handleRegistration(event));
    }

    /**
     * Obtiene y valida los elementos del formulario
     * @returns {Object|null} Datos del formulario o null si hay error
     */
    getFormData() {
        const nombre = document.getElementById('nombre');
        const correo_electronico = document.getElementById('correo_electronico');
        const password = document.getElementById('password');
        const confirm_password = document.getElementById('confirm_password');
        const rol = document.getElementById('rol');

        if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
            this.showMessage('Error interno: Faltan elementos del formulario.', 'error');
            return null;
        }

        return {
            nombre: nombre.value.trim(),
            correo_electronico: correo_electronico.value.trim(),
            password: password.value,
            confirm_password: confirm_password.value,
            rol: rol.value
        };
    }

    /**
     * Valida los datos del formulario
     * @param {Object} formData - Datos del formulario
     * @returns {boolean} True si es válido, false si no
     */
    validateForm(formData) {
        const { nombre, correo_electronico, password, confirm_password, rol } = formData;

        // Validar campos obligatorios
        if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
            this.showMessage('Todos los campos son obligatorios.', 'error');
            return false;
        }

        // Validar formato de email
        if (!this.emailRegex.test(correo_electronico)) {
            this.showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            return false;
        }

        // Validar longitud de contraseña
        if (password.length < 8) {
            this.showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
            return false;
        }

        // Validar que las contraseñas coincidan
        if (password !== confirm_password) {
            this.showMessage('Las contraseñas no coinciden.', 'error');
            return false;
        }

        // Validar complejidad de contraseña
        if (!this.validatePasswordStrength(password)) {
            this.showMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Valida la fortaleza de la contraseña
     * @param {string} password - Contraseña a validar
     * @returns {boolean} True si es fuerte, false si no
     */
    validatePasswordStrength(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers;
    }

    /**
     * Muestra un mensaje al usuario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success', 'error', 'info'
     */
    showMessage(message, type = 'info') {
        if (!this.registerMessage) return;

        this.registerMessage.textContent = message;
        this.registerMessage.className = 'message'; // Restablecer clases
        
        switch (type) {
            case 'success':
                this.registerMessage.classList.add('success');
                break;
            case 'error':
                this.registerMessage.classList.add('error');
                break;
            default:
                // Para 'info' no agregamos clase adicional
                break;
        }
    }

    /**
     * Realiza la petición de registro
     * @param {Object} registrationData - Datos de registro
     * @returns {Object} Respuesta del servidor
     */
    async makeRegistrationRequest(registrationData) {
        const response = await fetch(`${this.API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });

        const data = await response.json();
        return { response, data };
    }

    /**
     * Maneja el éxito del registro
     * @param {Object} data - Datos de respuesta
     */
    handleRegistrationSuccess(data) {
        this.showMessage(data.message, 'success');
        this.registerForm.reset();
        console.log('Usuario registrado exitosamente:', data.usuario);
        
        // Opcional: redirigir al login después de un tiempo
        // setTimeout(() => {
        //     window.location.href = '/login.html';
        // }, 2000);
    }

    /**
     * Maneja errores de registro
     * @param {Object} data - Datos de respuesta de error
     */
    handleRegistrationError(data) {
        this.showMessage(data.message || 'Error en el registro. Inténtalo de nuevo.', 'error');
    }

    /**
     * Intenta realizar el registro
     * @param {Object} formData - Datos del formulario
     */
    async attemptRegistration(formData) {
        try {
            const { response, data } = await this.makeRegistrationRequest(formData);
            
            if (response.ok) {
                this.handleRegistrationSuccess(data);
            } else {
                this.handleRegistrationError(data);
            }

        } catch (error) {
            console.error('Error de red o del servidor al registrar usuario:', error);
            this.showMessage('Error de conexión con el servidor. Verifica que esté activo.', 'error');
        }
    }

    /**
     * Maneja el evento de submit del formulario
     * @param {Event} event - Evento de submit
     */
    async handleRegistration(event) {
        event.preventDefault();
        
        this.showMessage('Registrando usuario...', 'info');
        
        const formData = this.getFormData();
        if (!formData || !this.validateForm(formData)) {
            return;
        }

        await this.attemptRegistration(formData);
    }
}

// Inicializar el sistema de registro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationManager();
});