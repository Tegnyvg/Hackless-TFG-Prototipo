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
        const statsContainer = document.getElementById('statsContainer');
        if (loadingMessage) loadingMessage.innerHTML = '<span class="loading-spinner"></span> Cargando nómina...';
        employeesListDiv.innerHTML = '';
        statsContainer.classList.add('hidden');

        try {
            // Obtener usuarios
            const usersResponse = await fetch(`${API_BASE_URL}/users`);
            const usersResult = await usersResponse.json();

            // Obtener documentos
            const docsResponse = await fetch(`${API_BASE_URL}/api/documents`);
            const docsResult = await docsResponse.json();

            if (usersResponse.ok && docsResponse.ok) {
                if (loadingMessage) loadingMessage.style.display = 'none';
                
                if (usersResult.users && usersResult.users.length > 0) {
                    // Calcular estadísticas
                    const stats = calculateStats(usersResult.users, docsResult.documentos || []);
                    showStats(stats);
                    
                    let tableHTML = `
                        <table class="employees-table striped-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado<br>Documentación</th>
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
                        let completedDocs = 0;

                        REQUIRED_DOC_TYPES.forEach(docType => {
                            const docFound = employeeDocs.find(doc => 
                                doc.tipo_documento === docType && 
                                new Date(doc.fecha_vencimiento) > new Date()
                            );
                            
                            if (docFound) {
                                docsStatus[docType] = '✅';
                                completedDocs++;
                                const vencimiento = new Date(docFound.fecha_vencimiento);
                                if (!closestDate || vencimiento < closestDate) {
                                    closestDate = vencimiento;
                                    closestVencimiento = docFound.fecha_vencimiento;
                                }
                            } else {
                                docsStatus[docType] = '❌';
                            }
                        });
                        
                        // Determinar estado general
                        let estadoGeneral = '';
                        let estadoClass = '';
                        if (completedDocs === REQUIRED_DOC_TYPES.length) {
                            estadoGeneral = 'COMPLETO';
                            estadoClass = 'status-completo';
                        } else if (completedDocs > 0) {
                            estadoGeneral = 'PARCIAL';
                            estadoClass = 'status-incompleto';
                        } else {
                            estadoGeneral = 'FALTANTE';
                            estadoClass = 'status-incompleto';
                        }
                        
                        // Verificar próximos vencimientos (dentro de 30 días)
                        if (closestDate && (closestDate - new Date()) < (30 * 24 * 60 * 60 * 1000)) {
                            estadoClass = 'status-proximo-vencimiento';
                        }

                        tableHTML += `
                            <tr>
                                <td><strong>${employee.id_usuario}</strong></td>
                                <td><strong>${employee.nombre}</strong></td>
                                <td>${employee.correo_electronico}</td>
                                <td><span class="role-badge role-${employee.rol}">${employee.rol}</span></td>
                                <td><span class="status-badge ${estadoClass}">${estadoGeneral}</span></td>
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

    // Agregar estilos dinámicos para los roles - MODO OSCURO
    const style = document.createElement('style');
    style.textContent = `
        .role-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .role-administrador { background-color: rgba(231, 76, 60, 0.8); color: #ecf0f1; }
        .role-operativo { background-color: rgba(39, 174, 96, 0.8); color: #ecf0f1; }
        .role-rrhh { background-color: rgba(52, 152, 219, 0.8); color: #ecf0f1; }
        .role-supervisor { background-color: rgba(243, 156, 18, 0.8); color: #ecf0f1; }
        .role-auditor { background-color: rgba(155, 89, 182, 0.8); color: #ecf0f1; }
        .role-seguridad_higiene { background-color: rgba(26, 188, 156, 0.8); color: #ecf0f1; }
        .role-empleado { background-color: rgba(149, 165, 166, 0.8); color: #ecf0f1; }
        
        .btn-action {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 6px 12px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.85rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        .btn-action:hover {
            background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
            text-decoration: none;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }
        
        .summary {
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(44, 62, 80, 0.6);
            border-radius: 6px;
            border-left: 4px solid #3498db;
            color: #ecf0f1;
        }
    `;
    document.head.appendChild(style);

    // Cargar la nómina al iniciar la página
    fetchEmployees();
    
    // Función para calcular estadísticas
    function calculateStats(users, documents) {
        const totalUsers = users.length;
        const totalDocs = documents.length;
        
        let usersWithCompleteDocumentation = 0;
        let proximosVencimientos = 0;
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        users.forEach(user => {
            const userDocs = documents.filter(doc => doc.id_usuario === user.id_usuario);
            let completedRequiredDocs = 0;
            
            REQUIRED_DOC_TYPES.forEach(docType => {
                const docFound = userDocs.find(doc => 
                    doc.tipo_documento === docType && 
                    new Date(doc.fecha_vencimiento) > today
                );
                if (docFound) {
                    completedRequiredDocs++;
                    
                    // Verificar vencimientos próximos
                    const vencimiento = new Date(docFound.fecha_vencimiento);
                    if (vencimiento <= thirtyDaysFromNow) {
                        proximosVencimientos++;
                    }
                }
            });
            
            if (completedRequiredDocs === REQUIRED_DOC_TYPES.length) {
                usersWithCompleteDocumentation++;
            }
        });
        
        return {
            totalUsers,
            totalDocs,
            usersWithCompleteDocumentation,
            proximosVencimientos,
            completionPercentage: Math.round((usersWithCompleteDocumentation / totalUsers) * 100)
        };
    }
    
    // Función para mostrar estadísticas
    function showStats(stats) {
        const statsContainer = document.getElementById('statsContainer');
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.totalUsers}</div>
                <div class="stat-label">Total Empleados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.usersWithCompleteDocumentation}</div>
                <div class="stat-label">Documentación Completa</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.completionPercentage}%</div>
                <div class="stat-label">Porcentaje Cumplimiento</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.proximosVencimientos}</div>
                <div class="stat-label">Vencimientos Próximos</div>
            </div>
        `;
        statsContainer.classList.remove('hidden');
    }
});
