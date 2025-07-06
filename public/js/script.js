// script.js

// Navegación simple entre páginas HTML
function navigateTo(url) {
    window.location.href = url;
}

// Ejemplo: Añadir evento a un botón con ID específico
const goToDocumentsBtn = document.getElementById('goToDocuments');
if (goToDocumentsBtn) {
    goToDocumentsBtn.addEventListener('click', () => {
        navigateTo('documents.html');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Hacer tarjetas clickables usando la clase 'card-link'
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // event.preventDefault(); // Descomenta si quieres controlar la navegación solo por JS
            // navigateTo(link.getAttribute('href')); // Descomenta si usas event.preventDefault()
        });
    });

    const documentUploadForm = document.getElementById('documentUploadForm');
    const uploadMessage = document.getElementById('uploadMessage');
    const documentsListDiv = document.getElementById('documentsList');
    const refreshDocumentsButton = document.getElementById('refreshDocuments');

    const API_BASE_URL = 'http://localhost:3000'; 

    // Set initial dates when the DOM is ready
    setTodayDate(); // Call here to ensure elements exist

    // --- Función para cargar un nuevo documento (con archivo) ---
    if (documentUploadForm) {
        documentUploadForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const formData = new FormData(documentUploadForm);

            try {
                uploadMessage.textContent = 'Subiendo documento...';
                uploadMessage.className = 'message';

                const response = await fetch(`${API_BASE_URL}/documents/upload`, {
                    method: 'POST',
                    body: formData 
                });

                const result = await response.json();

                if (response.ok) { 
                    uploadMessage.textContent = result.message;
                    uploadMessage.className = 'message success';
                    documentUploadForm.reset(); 
                    setTodayDate(); // Vuelve a poner las fechas después de resetear el formulario
                    fetchDocuments(); 
                } else {
                    uploadMessage.textContent = `Error al subir documento: ${result.message || 'Algo salió mal.'}`;
                    uploadMessage.className = 'message error';
                    console.error('Error de respuesta del servidor:', result);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                uploadMessage.textContent = 'Error de conexión con el servidor. Asegúrate de que el backend esté funcionando.';
                uploadMessage.className = 'message error';
            }
        });
    }

    // --- Función para obtener y mostrar documentos ---
    async function fetchDocuments() {
        documentsListDiv.innerHTML = '<p>Cargando documentos...</p>'; 
        try {
            const response = await fetch(`${API_BASE_URL}/documents`); 
            const result = await response.json();

            if (response.ok) { 
                if (result.documentos && result.documentos.length > 0) {
                    // Copilot: Generar una tabla HTML para mostrar los documentos.
                    // La tabla debe tener la clase 'documents-table' y 'striped-table'.
                    // Encabezados de la tabla (<thead>): ID Doc, ID User, Tipo, Emisión, Vencimiento, Archivo, Acciones.
                    // Cada fila (<tr>) del cuerpo (<tbody>) debe mostrar la información del documento:
                    // doc.id_documento, doc.id_usuario (con el nombre del usuario si existe: doc.usuarioInfo.nombre),
                    // doc.tipo_documento, fechas formateadas (formattedEmision, formattedVencimiento),
                    // doc.archivo_digital, y un enlace "Ver" que abra el archivo subido en una nueva pestaña.
                    let tableHTML = `
                        <table class="documents-table striped-table">
                            <thead>
                                <tr>
                                    <th>ID Doc</th>
                                    <th>ID Usuario</th>
                                    <th>Tipo</th>
                                    <th>Emisión</th>
                                    <th>Vencimiento</th>
                                    <th>Archivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    result.documentos.forEach(doc => {
                        const formattedEmision = doc.fecha_emision ? new Date(doc.fecha_emision).toLocaleDateString('es-AR') : 'N/A';
                        const formattedVencimiento = new Date(doc.fecha_vencimiento).toLocaleDateString('es-AR');
                        const userName = doc.usuarioInfo ? doc.usuarioInfo.nombre : 'N/A';

                        tableHTML += `
                            <tr>
                                <td>${doc.id_documento}</td>
                                <td>${doc.id_usuario} (${userName})</td>
                                <td>${doc.tipo_documento}</td>
                                <td>${formattedEmision}</td>
                                <td>${formattedVencimiento}</td>
                                <td>${doc.archivo_digital}</td>
                                <td><a href="/uploads/${doc.archivo_digital}" target="_blank">Ver</a></td>
                            </tr>
                        `;
                    });

                    tableHTML += `
                            </tbody>
                        </table>
                    `;
                    documentsListDiv.innerHTML = tableHTML;
                } else {
                    documentsListDiv.innerHTML = '<p>No se encontraron documentos.</p>';
                }
            } else { 
                documentsListDiv.innerHTML = `<p class="message error">Error al cargar documentos: ${result.message || 'No se encontraron documentos.'}</p>`;
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            documentsListDiv.innerHTML = '<p class="message error">Error de conexión al obtener documentos.</p>';
        }
    }

    // Evento para el botón de refrescar
    if (refreshDocumentsButton) {
        refreshDocumentsButton.addEventListener('click', fetchDocuments);
    }

    // Referencias a elementos del DOM para el nombre del archivo
    const archivoPdfInput = document.getElementById('archivoPdf'); // Referencia al input type="file"
    const fileNameSpan = document.getElementById('fileName');     // Referencia al span para mostrar el nombre

    // Escucha el cambio en el input de tipo 'file' para mostrar el nombre del archivo
    if (archivoPdfInput) {
        archivoPdfInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
            if (file) {
                fileNameSpan.textContent = ` (${file.name})`; // Muestra el nombre del archivo
            } else {
                fileNameSpan.textContent = ''; // Limpia si no se selecciona archivo
            }
        });
    }

    // --- Modal Solicitar Demo ---
    function openDemoModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    function closeDemoModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('demoModal');
        if (modal && event.target === modal) {
            closeDemoModal();
        }
    });
    // Evento para el botón Solicitar Demo
    const demoBtns = document.querySelectorAll('.btn-solicitar-demo');
    demoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openDemoModal();
        });
    });
    // Evento para cerrar modal con botón X
    const closeDemoBtn = document.getElementById('closeDemoModal');
    if (closeDemoBtn) {
        closeDemoBtn.addEventListener('click', closeDemoModal);
    }
    // Evento para enviar el formulario de demo
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
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
                    closeDemoModal();
                    demoForm.reset();
                } else {
                    alert('Hubo un error al enviar la solicitud. Intenta nuevamente.');
                }
            } catch (error) {
                alert('Error de conexión. Intenta más tarde.');
            }
        });
    }

    // Initial call to fetch documents and set dates
    fetchDocuments(); // Mantenemos la carga de documentos
});