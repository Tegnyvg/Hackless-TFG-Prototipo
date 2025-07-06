/* Copilot: Sistema de login para Hackless - Manejo de autenticación frontend con
   validaciones, 2FA para administradores, feedback visual y redirección inteligente. */

// hackless-backend/public/js/login.js
// Este script maneja la lógica del formulario de inicio de sesión en el frontend.

/**
 * Clase para manejar el sistema de login
 */
class LoginManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.loginMessage = document.getElementById('loginMessage');
        this.twofaRequired = false;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        this.init();
    }

    /**
     * Inicializa el sistema de login
     */
    init() {
        if (!this.loginForm) {
            return;
        }

        this.loginForm.addEventListener('submit', (event) => this.handleLogin(event));
    }

    /**
     * Obtiene y valida los elementos del formulario
     * @returns {Object|null} Datos del formulario o null si hay error
     */
    getFormData() {
        const emailInput = document.getElementById('correo_electronico');
        const passwordInput = document.getElementById('password');
        const twofaInput = document.getElementById('twofa_token');

        if (!emailInput || !passwordInput) {
            this.showMessage('Error interno: Faltan elementos del formulario.', 'error');
            return null;
        }

        return {
            correo_electronico: emailInput.value.trim(),
            password: passwordInput.value,
            twofa_token: twofaInput ? twofaInput.value : undefined
        };
    }

    /**
     * Valida los datos del formulario
     * @param {Object} formData - Datos del formulario
     * @returns {boolean} True si es válido, false si no
     */
    validateForm(formData) {
        const { correo_electronico, password } = formData;

        if (!correo_electronico || !password) {
            this.showMessage('Por favor, ingresa tu correo electrónico y contraseña.', 'error');
            return false;
        }

        if (!this.emailRegex.test(correo_electronico)) {
            this.showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            return false;
        }

        if (password.length < 8) {
            this.showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Muestra un mensaje al usuario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success', 'error', 'info'
     */
    showMessage(message, type = 'info') {
        if (!this.loginMessage) return;

        this.loginMessage.textContent = message;
        
        switch (type) {
            case 'success':
                this.loginMessage.style.color = 'green';
                break;
            case 'error':
                this.loginMessage.style.color = 'red';
                break;
            default:
                this.loginMessage.style.color = 'black';
        }
    }

    /**
     * Realiza petición de login
     * @param {Object} credentials - Credenciales de login
     * @param {string} endpoint - Endpoint a usar (/login o /admin-login)
     * @returns {Object} Respuesta del servidor
     */
    async makeLoginRequest(credentials, endpoint = '/login') {
        const body = { 
            correo_electronico: credentials.correo_electronico, 
            password: credentials.password 
        };

        if (this.twofaRequired && credentials.twofa_token) {
            body.twofa_token = credentials.twofa_token;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return { response, data };
    }

    /**
     * Maneja el éxito del login
     * @param {Object} data - Datos de respuesta
     * @param {boolean} isAdmin - Si es login de admin
     */
    handleLoginSuccess(data, isAdmin = false) {
        this.showMessage(data.message, 'success');
        
        // Redirección según el tipo de usuario
        const redirectUrl = isAdmin ? '/solicitudes-demo.html' : '/escritorio.html';
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }

    /**
     * Maneja errores de login
     * @param {Object} data - Datos de respuesta de error
     */
    handleLoginError(data) {
        this.showMessage(data.message || 'Error en el inicio de sesión. Inténtalo de nuevo.', 'error');
        
        // Manejo de 2FA para admins
        if (data.message && data.message.includes('2FA')) {
            this.twofaRequired = true;
            const twofaContainer = document.getElementById('twofaContainer');
            if (twofaContainer) {
                twofaContainer.style.display = 'block';
            }
        }
    }

    /**
     * Intenta login regular primero, luego admin si falla
     * @param {Object} formData - Datos del formulario
     */
    async attemptLogin(formData) {
        try {
            // Primero intentar login regular
            let { response, data } = await this.makeLoginRequest(formData, '/login');
            
            if (response.ok) {
                this.handleLoginSuccess(data, false);
                return;
            }

            // Si falla el login regular, intentar login admin
            ({ response, data } = await this.makeLoginRequest(formData, '/admin-login'));
            
            if (response.ok) {
                this.handleLoginSuccess(data, true);
            } else {
                this.handleLoginError(data);
            }

        } catch (error) {
            this.showMessage('Error de conexión con el servidor. Verifica que esté activo.', 'error');
        }
    }

    /**
     * Maneja el evento de submit del formulario
     * @param {Event} event - Evento de submit
     */
    async handleLogin(event) {
        event.preventDefault();
        
        this.showMessage('Iniciando sesión...', 'info');
        
        const formData = this.getFormData();
        if (!formData || !this.validateForm(formData)) {
            return;
        }

        await this.attemptLogin(formData);
    }
}

// Inicializar el sistema de login cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});