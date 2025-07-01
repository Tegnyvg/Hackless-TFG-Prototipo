// hackless-backend/public/js/login.js
// Este script maneja la lógica del formulario de inicio de sesión en el frontend.

document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias a los elementos HTML del formulario y el mensaje
    const loginForm = document.getElementById('loginForm'); // Asegúrate que tu formulario HTML tiene el id="loginForm"
    const loginMessage = document.getElementById('loginMessage'); // Asegúrate que tu párrafo HTML tiene el id="loginMessage"

    // Verifica que el formulario de login exista en la página
    if (loginForm) {
        // Agrega un 'listener' para el evento 'submit' del formulario
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

            // Obtiene los valores ingresados por el usuario
            // AHORA SÍ: Los IDs de los inputs aquí coinciden con los de tu login.html actual
            const correo_electronico_input = document.getElementById('correo_electronico'); // Input para el correo electrónico
            const password_input = document.getElementById('password'); // Input para la contraseña

            // Verifica que ambos inputs necesarios (correo y contraseña) existan en el DOM
            if (!correo_electronico_input || !password_input) {
                console.error('Error: No se encontraron los elementos del formulario (correo_electronico o password).');
                loginMessage.textContent = 'Error interno: Faltan elementos del formulario.';
                loginMessage.style.color = 'red';
                return; // Detiene la ejecución de la función si no se encuentran los inputs
            }

            // Obtiene los valores reales de los inputs
            const correo_electronico = correo_electronico_input.value;
            const password = password_input.value;

            loginMessage.textContent = ''; // Limpia cualquier mensaje anterior
            loginMessage.style.color = 'black'; // Restablece el color del mensaje por defecto

            // Validación básica para asegurar que los campos no estén vacíos
            if (!correo_electronico || !password) {
                loginMessage.textContent = 'Por favor, ingresa tu correo electrónico y contraseña.';
                loginMessage.style.color = 'red';
                return; // Detiene la ejecución si los campos están vacíos
            }

            try {
                // Realiza una solicitud POST (fetch) a la ruta /login de tu backend
                const response = await fetch('/login', {
                    method: 'POST', // Define el método HTTP como POST
                    headers: {
                        'Content-Type': 'application/json' // Especifica que el cuerpo de la solicitud es JSON
                    },
                    body: JSON.stringify({ correo_electronico, password }) // Convierte el objeto JavaScript a una cadena JSON
                });

                const data = await response.json(); // Parsea la respuesta del servidor de JSON a un objeto JavaScript

                // Comprueba si la respuesta HTTP fue exitosa (códigos de estado en el rango 200-299)
                if (response.ok) {
                    loginMessage.textContent = data.message; // Muestra el mensaje de éxito recibido del servidor
                    loginMessage.style.color = 'green'; // Cambia el color del mensaje a verde
                    console.log('Usuario logueado exitosamente:', data.usuario); // Loguea los datos del usuario en la consola del navegador

                    // Redirige al usuario a la página de escritorio después de un inicio de sesión exitoso
                    // Asegúrate de que 'escritorio.html' esté en la carpeta 'public' de tu backend.
                    window.location.href = '/escritorio.html';
                } else {
                    // Si la respuesta no fue exitosa, muestra el mensaje de error del servidor o un mensaje genérico
                    loginMessage.textContent = data.message || 'Error en el inicio de sesión. Inténtalo de nuevo.';
                    loginMessage.style.color = 'red'; // Cambia el color del mensaje a rojo
                }
            } catch (error) {
                // Captura errores que ocurran durante la solicitud de red (ej. el servidor no está corriendo o hay un problema de conexión)
                console.error('Error de red o del servidor al intentar iniciar sesión:', error);
                loginMessage.textContent = 'Error de conexión con el servidor. Por favor, verifica que el servidor esté activo.';
                loginMessage.style.color = 'red';
            }
        });
    } else {
        // Mensaje de error si el formulario de login no se encuentra en el HTML
        console.error('El formulario de login (ID "loginForm") no fue encontrado en el DOM. Asegúrate de que tu HTML tiene <form id="loginForm">.');
    }
});