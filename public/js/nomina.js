// public/js/nomina.js
// Script para cargar y mostrar la nómina de empleados con estatus de documentación

document.addEventListener('DOMContentLoaded', () => {
    const employeesListDiv = document.getElementById('employeesList');
    const loadingMessage = document.getElementById('loadingMessage');
    const API_BASE_URL = 'http://localhost:3000';

    const REQUIRED_DOC_TYPES = [
        'Certificado ART',
        'Examen Médico',
        'Constancia Capacitación',
        'Contrato de Servicio',
        'Póliza de Seguro'
    ];

    async function fetchEmployees() {
        if (loadingMessage) loadingMessage.textContent = 'Cargando nómina...';
        employeesListDiv.innerHTML = '';

        try {
            // Obtener usuarios
            const usersResponse = await fetch(`${API_BASE_URL}/users`);
            const usersResult = await usersResponse.json();

            // Obtener documentos
            const docsResponse = await fetch(`${API_BASE_URL}/documents`);
            const docsResult = await docsResponse.json();

            if (usersResponse.ok && docsResponse.ok) {
                if (loadingMessage) loadingMessage.style.display = 'none';
                
                if (usersResult.users && usersResult.users.length > 0) {
                    let tableHTML = `
                        <table class="employees-table striped-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    ${REQUIRED_DOC_TYPES.map(docType => `<th>${docType.replace(' ', '<br>')}</th>`).join('')}
                                    <th>Próximo<br>Vencimiento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    usersResult.users.forEach(employee => {
                        // Filtrar documentos del empleado
                        const employeeDocs = docsResult.documentos ? 
                            docsResult.documentos.filter(doc => doc.id_usuario === employee.id_usuario) : [];

                        // Verificar estado de cada tipo de documento
                        const docsStatus = {};
                        let closestVencimiento = null;
                        let closestDate = null;

                        REQUIRED_DOC_TYPES.forEach(docType => {
                            const docFound = employeeDocs.find(doc => 
                                doc.tipo_documento === docType && 
                                new Date(doc.fecha_vencimiento) > new Date()
                            );
                            
                            if (docFound) {
                                docsStatus[docType] = '✅';
                                const vencimiento = new Date(docFound.fecha_vencimiento);
                                if (!closestDate || vencimiento < closestDate) {
                                    closestDate = vencimiento;
                                    closestVencimiento = docFound.fecha_vencimiento;
                                }
                            } else {
                                docsStatus[docType] = '❌';
                            }
                        });

                        tableHTML += `
                            <tr>
                                <td>${employee.id_usuario}</td>
                                <td>${employee.nombre}</td>
                                <td>${employee.correo_electronico}</td>
                                <td><span class="role-badge role-${employee.rol}">${employee.rol}</span></td>
                                ${REQUIRED_DOC_TYPES.map(docType => 
                                    `<td><span class="check-icon">${docsStatus[docType]}</span></td>`
                                ).join('')}
                                <td>${closestVencimiento ? 
                                    new Date(closestVencimiento).toLocaleDateString('es-AR') : 
                                    'N/A'}</td>
                                <td>
                                    <a href="documents.html?id_usuario=${employee.id_usuario}" class="btn-action">Ver Docs</a>
                                </td>
                            </tr>
                        `;
                    });

                    tableHTML += `
                            </tbody>
                        </table>
                        <div class="summary">
                            <p><strong>Total de empleados:</strong> ${usersResult.users.length}</p>
                            <p><strong>Documentos totales:</strong> ${docsResult.total || 0}</p>
                        </div>
                    `;
                    employeesListDiv.innerHTML = tableHTML;

                } else {
                    if (loadingMessage) loadingMessage.textContent = 'No se encontraron empleados.';
                    employeesListDiv.innerHTML = '<p>No se encontraron empleados en la nómina.</p>';
                }
            } else {
                throw new Error('Error al obtener datos del servidor');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            if (loadingMessage) loadingMessage.textContent = 'Error de conexión.';
            employeesListDiv.innerHTML = '<p class="message error">Error de conexión al obtener la nómina. Verifica que el servidor esté ejecutándose.</p>';
        }
    }

    // Agregar estilos dinámicos para los roles
    const style = document.createElement('style');
    style.textContent = `
        .role-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .role-admin { background-color: #dc3545; color: white; }
        .role-operativo { background-color: #28a745; color: white; }
        .role-rrhh { background-color: #007bff; color: white; }
        .role-supervisor { background-color: #fd7e14; color: white; }
        .role-auditor { background-color: #6f42c1; color: white; }
        .role-seguridad_higiene { background-color: #20c997; color: white; }
        
        .btn-action {
            background-color: #007bff;
            color: white;
            padding: 6px 12px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.85rem;
        }
        .btn-action:hover {
            background-color: #0056b3;
            text-decoration: none;
        }
        
        .summary {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #007bff;
        }
    `;
    document.head.appendChild(style);

    // Cargar la nómina al iniciar la página
    fetchEmployees();
});
