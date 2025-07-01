document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita el envío tradicional del formulario

            // Obtener valores de los campos del formulario
            const nombre = document.getElementById('nombre').value;
            const correo_electronico = document.getElementById('correo_electronico').value;
            const password = document.getElementById('password').value;
            const confirm_password = document.getElementById('confirm_password').value;
            const rol = document.getElementById('rol').value;

            registerMessage.textContent = ''; // Limpiar mensajes anteriores
            registerMessage.className = 'message'; // Restablece clases de mensaje

            // Validaciones básicas de frontend (pueden ser más robustas)
            if (!nombre || !correo_electronico || !password || !confirm_password || !rol) {
                registerMessage.textContent = 'Todos los campos son obligatorios.';
                registerMessage.classList.add('error');
                return;
            }
            if (password !== confirm_password) {
                registerMessage.textContent = 'Las contraseñas no coinciden.';
                registerMessage.classList.add('error');
                return;
            }
            // Las validaciones de complejidad de contraseña también las hace el backend
            // pero puedes añadir un feedback aquí si lo deseas.

            try {
                // Envía los datos a la ruta /register de tu backend
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, correo_electronico, password, confirm_password, rol })
                });

                const data = await response.json();

                if (response.ok) {
                    registerMessage.textContent = data.message;
                    registerMessage.classList.add('success');
                    registerForm.reset(); // Limpiar el formulario después del registro exitoso
                    console.log('Usuario registrado:', data.usuario);
                    // Opcional: redirigir al login o mostrar un mensaje para ir al login
                    // setTimeout(() => {
                    //     window.location.href = '/login.html';
                    // }, 2000);
                } else {
                    registerMessage.textContent = data.message || 'Error en el registro.';
                    registerMessage.classList.add('error');
                }
            } catch (error) {
                console.error('Error de red o del servidor al registrar usuario:', error);
                registerMessage.textContent = 'Error de conexión con el servidor. Inténtalo de nuevo.';
                registerMessage.classList.add('error');
            }
        });
    } else {
        console.error('El formulario de registro (ID registerForm) no fue encontrado.');
    }
});