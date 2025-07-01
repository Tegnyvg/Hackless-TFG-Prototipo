// script.js
document.addEventListener('DOMContentLoaded', () => {
    const documentUploadForm = document.getElementById('documentUploadForm');
    const uploadMessage = document.getElementById('uploadMessage');
    const documentsListDiv = document.getElementById('documentsList');
    const refreshDocumentsButton = document.getElementById('refreshDocuments');

    const API_BASE_URL = 'http://localhost:3000'; // URL base de tu backend

    // --- Función para cargar un nuevo documento ---
    if (documentUploadForm) {
        documentUploadForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

            const formData = new FormData(documentUploadForm);
            const documentData = {};
            formData.forEach((value, key) => {
                documentData[key] = value;
            });

            // Asegúrate de que id_usuario sea un número
            documentData.id_usuario = parseInt(documentData.id_usuario, 10);

            try {
                const response = await fetch(`${API_BASE_URL}/documents/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(documentData)
                });

                const result = await response.json();

                if (response.ok) { // Si la respuesta es 2xx (ej. 201 Created)
                    uploadMessage.textContent = result.message;
                    uploadMessage.className = 'message success';
                    documentUploadForm.reset(); // Limpia el formulario
                    fetchDocuments(); // Recarga la lista de documentos
                } else {
                    uploadMessage.textContent = `Error: ${result.message || 'Algo salió mal.'}`;
                    uploadMessage.className = 'message error';
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                uploadMessage.textContent = 'Error de conexión con el servidor.';
                uploadMessage.className = 'message error';
            }
        });
    }

    // --- Función para obtener y mostrar documentos ---
    async function fetchDocuments() {
        documentsListDiv.innerHTML = '<p>Cargando documentos...</p>'; // Muestra un mensaje de carga
        try {
            const response = await fetch(`${API_BASE_URL}/documents`); // Hace una solicitud GET
            const result = await response.json();

            if (response.ok) { // Si la respuesta es 2xx (ej. 200 OK)
                if (result.documentos && result.documentos.length > 0) {
                    documentsListDiv.innerHTML = ''; // Limpia el mensaje de carga
                    result.documentos.forEach(doc => {
                        const docItem = document.createElement('div');
                        docItem.className = 'document-item';
                        docItem.innerHTML = `
                            <p><strong>ID Documento:</strong> ${doc.id_documento}</p>
                            <p><strong>ID Usuario:</strong> ${doc.id_usuario} (${doc.Usuario ? doc.Usuario.nombre : 'N/A'})</p>
                            <p><strong>Tipo:</strong> ${doc.tipo_documento}</p>
                            <p><strong>Emisión:</strong> ${doc.fecha_emision || 'N/A'}</p>
                            <p><strong>Vencimiento:</strong> ${doc.fecha_vencimiento}</p>
                            <p><strong>Archivo:</strong> ${doc.archivo_digital}</p>
                        `;
                        documentsListDiv.appendChild(docItem);
                    });
                } else {
                    documentsListDiv.innerHTML = '<p>No se encontraron documentos.</p>';
                }
            } else { // Si la respuesta no es OK (ej. 404 Not Found)
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

    // Cargar documentos al iniciar la página
    fetchDocuments();
});