// Configuración global
const API_BASE_URL = 'http://localhost:3000/api';
let chartDistribucion = null;
let chartEvolucion = null;

// Función para mostrar/ocultar loading
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Función para mostrar errores
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');
    
    errorText.textContent = message;
    errorContainer.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(hideError, 5000);
}

function hideError() {
    document.getElementById('error-container').style.display = 'none';
}

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    setupNavigation();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar formulario
    setupForm();
    
    // Configurar eventos
    setupEventListeners();
});

function setupNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar la sección correspondiente
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.add('active');
            
            // Actualizar título de página
            updatePageTitle(this.textContent.trim());
            
            // Cargar datos específicos de la sección
            loadSectionData(this.getAttribute('data-section'));
        });
    });
}

function updatePageTitle(title) {
    document.getElementById('page-title').textContent = 
        'Evaluaciones y Calificaciones - ' + title;
}

// Cargar datos iniciales
async function loadInitialData() {
    try {
        showLoading();
        
        // Cargar evaluaciones
        await loadEvaluaciones();
        
        // Cargar estadísticas
        await loadEstadisticas();
        
        // Cargar estudiantes para el select
        await loadEstudiantesSelect();
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Error al cargar datos iniciales: ' + error.message);
    }
}

// Cargar evaluaciones
async function loadEvaluaciones() {
    try {
        const response = await fetch(`${API_BASE_URL}/evaluaciones`);
        
        if (!response.ok) {
            throw new Error('Error al cargar evaluaciones');
        }
        
        const evaluaciones = await response.json();
        
        // Actualizar tabla
        const tbody = document.getElementById('evaluaciones-table-body');
        tbody.innerHTML = '';
        
        evaluaciones.forEach(evaluacion => {
            const row = document.createElement('tr');
            
            // Determinar estado y clase CSS
            let estadoClass = '';
            let estadoText = evaluacion.estado_evaluacion || evaluacion.estado;
            
            if (estadoText === 'Finalizado') estadoClass = 'status-finalizado';
            else if (estadoText === 'Activo') estadoClass = 'status-activo';
            else if (estadoText === 'Pendiente') estadoClass = 'status-pendiente';
            
            row.innerHTML = `
                <td>${evaluacion.id_evaluacion || 'N/A'}</td>
                <td><strong>${evaluacion.nombre}</strong></td>
                <td>${evaluacion.tipo}</td>
                <td>${formatDate(evaluacion.fecha)}</td>
                <td>${evaluacion.entregas_completadas || 0}/${evaluacion.entregas_total || 0}</td>
                <td><span class="${estadoClass}">${estadoText}</span></td>
                <td>
                    <button class="btn-action" onclick="verDetallesEvaluacion(${evaluacion.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="editarEvaluacion(${evaluacion.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-danger" onclick="eliminarEvaluacion(${evaluacion.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Actualizar select de evaluaciones en registrar notas
        updateEvaluacionesSelect(evaluaciones);
        
    } catch (error) {
        showError('Error al cargar evaluaciones: ' + error.message);
    }
}

// Cargar estadísticas
async function loadEstadisticas() {
    try {
        const response = await fetch(`${API_BASE_URL}/estadisticas`);
        
        if (!response.ok) {
            throw new Error('Error al cargar estadísticas');
        }
        
        const estadisticas = await response.json();
        
        // Actualizar dashboard
        document.getElementById('total-estudiantes').textContent = estadisticas.totalEstudiantes || '25';
        document.getElementById('promedio-general').textContent = estadisticas.promedioGeneral || '3.8';
        document.getElementById('en-riesgo').textContent = estadisticas.enRiesgo || '3';
        document.getElementById('aprobacion').textContent = estadisticas.aprobacion || '85%';
        
        // Actualizar estadísticas detalladas
        document.getElementById('mejor-nota').textContent = estadisticas.mejorNota || '5.0';
        document.getElementById('peor-nota').textContent = estadisticas.peorNota || '0.0';
        document.getElementById('desviacion').textContent = estadisticas.desviacion || '0.8';
        document.getElementById('activos').textContent = estadisticas.activos || '22';
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        // Usar valores por defecto si hay error
        showError('No se pudieron cargar todas las estadísticas. Mostrando datos de ejemplo.');
    }
}

// Cargar estudiantes para select
async function loadEstudiantesSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes`);
        
        if (!response.ok) {
            throw new Error('Error al cargar estudiantes');
        }
        
        const estudiantes = await response.json();
        
        // Actualizar select de estudiantes en retroalimentación
        const selectEstudiante = document.getElementById('select-estudiante-retro');
        selectEstudiante.innerHTML = '<option value="">Seleccione estudiante</option>';
        
        estudiantes.forEach(estudiante => {
            const option = document.createElement('option');
            option.value = estudiante.id;
            option.textContent = `${estudiante.nombres} ${estudiante.apellidos}`;
            selectEstudiante.appendChild(option);
        });
        
    } catch (error) {
        showError('Error al cargar estudiantes: ' + error.message);
    }
}

// Actualizar select de evaluaciones
function updateEvaluacionesSelect(evaluaciones) {
    const selectEvaluacion = document.getElementById('select-evaluacion');
    const selectEvaluacionRetro = document.getElementById('select-evaluacion-retro');
    
    // Limpiar selects
    selectEvaluacion.innerHTML = '<option value="">Seleccione evaluación</option>';
    selectEvaluacionRetro.innerHTML = '<option value="">Seleccione evaluación</option>';
    
    // Agregar opciones
    evaluaciones.forEach(evaluacion => {
        const option1 = document.createElement('option');
        option1.value = evaluacion.id;
        option1.textContent = evaluacion.nombre;
        selectEvaluacion.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = evaluacion.id;
        option2.textContent = evaluacion.nombre;
        selectEvaluacionRetro.appendChild(option2);
    });
}

// Cargar datos específicos por sección
function loadSectionData(section) {
    switch(section) {
        case 'registrar-notas':
            if (document.getElementById('select-evaluacion').options.length <= 1) {
                loadEvaluaciones();
            }
            break;
        case 'retroalimentacion':
            if (document.getElementById('select-estudiante-retro').options.length <= 1) {
                loadEstudiantesSelect();
            }
            break;
        case 'reportes':
            generarGraficos();
            break;
    }
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Configurar formulario
function setupForm() {
    const form = document.getElementById('form-crear-evaluacion');
    const fileInput = document.getElementById('rubrica');
    const fileName = document.getElementById('file-name');
    
    // Manejar cambio de archivo
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Ningún archivo seleccionado';
        }
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        await crearEvaluacion();
    });
}

// Crear evaluación
async function crearEvaluacion() {
    try {
        showLoading();
        
        const formData = new FormData();
        formData.append('nombre', document.getElementById('nombre-evaluacion').value);
        formData.append('tipo', document.getElementById('tipo-evaluacion').value);
        formData.append('fecha', document.getElementById('fecha-evaluacion').value);
        formData.append('porcentaje', document.getElementById('porcentaje').value);
        formData.append('instrucciones', document.getElementById('instrucciones').value);
        formData.append('habilitar_entrega_digital', 
            document.getElementById('habilitar-entrega').checked ? 1 : 0);
        
        const fileInput = document.getElementById('rubrica');
        if (fileInput.files[0]) {
            formData.append('rubrica', fileInput.files[0]);
        }
        
        const response = await fetch(`${API_BASE_URL}/evaluaciones`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear evaluación');
        }
        
        const result = await response.json();
        
        hideLoading();
        alert('Evaluación creada exitosamente');
        resetForm();
        loadEvaluaciones(); // Recargar lista
        
        // Regresar a la sección de inicio
        document.querySelector('[data-section="inicio"]').click();
        
    } catch (error) {
        hideLoading();
        showError('Error al crear evaluación: ' + error.message);
    }
}

// Resetear formulario
function resetForm() {
    document.getElementById('form-crear-evaluacion').reset();
    document.getElementById('file-name').textContent = 'Ningún archivo seleccionado';
}

// Cargar calificaciones
async function loadCalificaciones() {
    const evaluacionId = document.getElementById('select-evaluacion').value;
    
    if (!evaluacionId) {
        document.getElementById('calificaciones-table-body').innerHTML = '';
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/calificaciones/${evaluacionId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar calificaciones');
        }
        
        const calificaciones = await response.json();
        
        // Actualizar tabla
        const tbody = document.getElementById('calificaciones-table-body');
        tbody.innerHTML = '';
        
        calificaciones.forEach((calificacion, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${calificacion.estudiante_nombre}</td>
                <td>
                    <input type="number" min="0" max="5" step="0.1" 
                           value="${calificacion.nota || 0}" 
                           class="nota-input" 
                           data-id="${calificacion.id}"
                           onchange="actualizarNota(${calificacion.id}, this.value)">
                </td>
                <td>
                    <input type="text" 
                           value="${calificacion.observacion || ''}" 
                           class="observacion-input"
                           data-id="${calificacion.id}"
                           onchange="actualizarObservacion(${calificacion.id}, this.value)"
                           placeholder="Observación corta">
                </td>
                <td>
                    <select class="estado-select" 
                            data-id="${calificacion.id}"
                            onchange="actualizarEstado(${calificacion.id}, this.value)">
                        <option value="Pendiente" ${calificacion.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Calificado" ${calificacion.estado === 'Calificado' ? 'selected' : ''}>Calificado</option>
                        <option value="Incompleto" ${calificacion.estado === 'Incompleto' ? 'selected' : ''}>Incompleto</option>
                    </select>
                </td>
                <td>
                    <button class="btn-action" onclick="guardarCalificacion(${calificacion.id})" title="Guardar">
                        <i class="fas fa-save"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showError('Error al cargar calificaciones: ' + error.message);
    }
}

// Guardar todas las calificaciones
async function guardarTodasCalificaciones() {
    try {
        showLoading();
        
        const inputs = document.querySelectorAll('.nota-input, .observacion-input, .estado-select');
        const updates = [];
        
        // Agrupar cambios por calificación
        const cambios = {};
        
        inputs.forEach(input => {
            const id = input.getAttribute('data-id');
            if (!cambios[id]) cambios[id] = {};
            
            if (input.classList.contains('nota-input')) {
                cambios[id].nota = parseFloat(input.value) || 0;
            } else if (input.classList.contains('observacion-input')) {
                cambios[id].observacion = input.value;
            } else if (input.classList.contains('estado-select')) {
                cambios[id].estado = input.value;
            }
        });
        
        // Enviar cada actualización
        for (const id in cambios) {
            if (cambios[id]) {
                const response = await fetch(`${API_BASE_URL}/calificaciones/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cambios[id])
                });
                
                if (!response.ok) {
                    throw new Error(`Error al actualizar calificación ${id}`);
                }
                
                updates.push(id);
            }
        }
        
        hideLoading();
        alert(`${updates.length} calificaciones actualizadas exitosamente`);
        
    } catch (error) {
        hideLoading();
        showError('Error al guardar calificaciones: ' + error.message);
    }
}

// Funciones individuales para actualizar
async function actualizarNota(id, nota) {
    await actualizarCalificacion(id, { nota: parseFloat(nota) || 0 });
}

async function actualizarObservacion(id, observacion) {
    await actualizarCalificacion(id, { observacion });
}

async function actualizarEstado(id, estado) {
    await actualizarCalificacion(id, { estado });
}

async function actualizarCalificacion(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/calificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar calificación');
        }
        
    } catch (error) {
        showError('Error al actualizar: ' + error.message);
    }
}

// Guardar calificación individual
async function guardarCalificacion(id) {
    try {
        const row = document.querySelector(`[data-id="${id}"]`).closest('tr');
        const nota = row.querySelector('.nota-input').value;
        const observacion = row.querySelector('.observacion-input').value;
        const estado = row.querySelector('.estado-select').value;
        
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/calificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nota: parseFloat(nota) || 0,
                observacion,
                estado
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar calificación');
        }
        
        hideLoading();
        alert('Calificación guardada exitosamente');
        
    } catch (error) {
        hideLoading();
        showError('Error al guardar calificación: ' + error.message);
    }
}

// Guardar retroalimentación
async function guardarRetroalimentacion() {
    try {
        const estudianteId = document.getElementById('select-estudiante-retro').value;
        const evaluacionId = document.getElementById('select-evaluacion-retro').value;
        const comentario = document.getElementById('comentario-retro').value;
        
        if (!estudianteId || !evaluacionId || !comentario.trim()) {
            showError('Por favor complete todos los campos');
            return;
        }
        
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/retroalimentacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estudiante_id: estudianteId,
                evaluacion_id: evaluacionId,
                comentario: comentario
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar retroalimentación');
        }
        
        // Agregar al historial
        const historialItem = document.createElement('div');
        historialItem.className = 'historial-item';
        historialItem.innerHTML = `
            <div class="historial-date">${new Date().toLocaleString('es-ES', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
            <div class="historial-comment">${comentario}</div>
        `;
        
        document.getElementById('historial-list').prepend(historialItem);
        
        // Limpiar textarea
        document.getElementById('comentario-retro').value = '';
        
        hideLoading();
        alert('Retroalimentación guardada exitosamente');
        
    } catch (error) {
        hideLoading();
        showError('Error al guardar retroalimentación: ' + error.message);
    }
}

// Generar gráficos
function generarGraficos() {
    // Destruir gráficos existentes
    if (chartDistribucion) chartDistribucion.destroy();
    if (chartEvolucion) chartEvolucion.destroy();
    
    // Datos de ejemplo para distribución
    const ctxDistribucion = document.getElementById('grafico-distribucion').getContext('2d');
    chartDistribucion = new Chart(ctxDistribucion, {
        type: 'bar',
        data: {
            labels: ['0.0-1.0', '1.1-2.0', '2.1-3.0', '3.1-4.0', '4.1-5.0'],
            datasets: [{
                label: 'Cantidad de Estudiantes',
                data: [1, 2, 5, 10, 7],
                backgroundColor: [
                    '#e74c3c',
                    '#f39c12',
                    '#f1c40f',
                    '#3498db',
                    '#2ecc71'
                ],
                borderColor: [
                    '#c0392b',
                    '#e67e22',
                    '#f39c12',
                    '#2980b9',
                    '#27ae60'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Datos de ejemplo para evolución
    const ctxEvolucion = document.getElementById('grafico-evolucion').getContext('2d');
    chartEvolucion = new Chart(ctxEvolucion, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Promedio del Grupo',
                data: [3.5, 3.65, 3.8, 3.9],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 3.0,
                    max: 4.0,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Generar reporte
function generarReporte() {
    try {
        showLoading();
        
        // En una implementación real, aquí se haría una llamada al backend
        // para generar y descargar un reporte en PDF o Excel
        
        // Simulación de generación de reporte
        setTimeout(() => {
            hideLoading();
            alert('Reporte generado exitosamente. En una implementación real, se descargaría un archivo.');
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showError('Error al generar reporte: ' + error.message);
    }
}

// Configurar event listeners adicionales
function setupEventListeners() {
    // Búsqueda de evaluaciones
    const searchInput = document.getElementById('search-evaluacion');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#evaluaciones-table-body tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Actualizar info de estudiante en retroalimentación
    document.getElementById('select-estudiante-retro').addEventListener('change', function() {
        const estudianteId = this.value;
        if (estudianteId) {
            // En una implementación real, se cargarían los datos del estudiante
            document.getElementById('student-name').textContent = 
                this.options[this.selectedIndex].text;
        }
    });
    
    // Cargar historial de retroalimentación
    document.getElementById('select-evaluacion-retro').addEventListener('change', function() {
        const evaluacionId = this.value;
        if (evaluacionId) {
            cargarHistorialRetroalimentacion(evaluacionId);
        }
    });
}

// Cargar historial de retroalimentación
async function cargarHistorialRetroalimentacion(evaluacionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/retroalimentacion/${evaluacionId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar historial');
        }
        
        const historial = await response.json();
        
        const historialList = document.getElementById('historial-list');
        historialList.innerHTML = '';
        
        historial.forEach(item => {
            const historialItem = document.createElement('div');
            historialItem.className = 'historial-item';
            historialItem.innerHTML = `
                <div class="historial-date">${formatDate(item.fecha_comentario)}</div>
                <div class="historial-comment">${item.comentario}</div>
            `;
            historialList.appendChild(historialItem);
        });
        
    } catch (error) {
        console.error('Error al cargar historial:', error);
    }
}

// Funciones para acciones de evaluaciones
function verDetallesEvaluacion(id) {
    alert(`Ver detalles de evaluación ${id}`);
    // En una implementación real, se mostraría un modal con los detalles
}

function editarEvaluacion(id) {
    alert(`Editar evaluación ${id}`);
    // En una implementación real, se cargaría el formulario con los datos
}

async function eliminarEvaluacion(id) {
    if (!confirm('¿Está seguro de eliminar esta evaluación?')) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/evaluaciones/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar evaluación');
        }
        
        hideLoading();
        alert('Evaluación eliminada exitosamente');
        loadEvaluaciones(); // Recargar lista
        
    } catch (error) {
        hideLoading();
        showError('Error al eliminar evaluación: ' + error.message);
    }
}

// Estilos adicionales para estados
const style = document.createElement('style');
style.textContent = `
    .status-finalizado {
        color: #27ae60;
        font-weight: bold;
        background-color: rgba(39, 174, 96, 0.1);
        padding: 5px 10px;
        border-radius: 4px;
    }
    
    .status-activo {
        color: #3498db;
        font-weight: bold;
        background-color: rgba(52, 152, 219, 0.1);
        padding: 5px 10px;
        border-radius: 4px;
    }
    
    .status-pendiente {
        color: #f39c12;
        font-weight: bold;
        background-color: rgba(243, 156, 18, 0.1);
        padding: 5px 10px;
        border-radius: 4px;
    }
    
    .btn-action {
        background: none;
        border: none;
        color: #3498db;
        cursor: pointer;
        font-size: 1rem;
        margin: 0 5px;
        padding: 5px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .btn-action:hover {
        background-color: rgba(52, 152, 219, 0.1);
    }
    
    .btn-action.btn-danger {
        color: #e74c3c;
    }
    
    .btn-action.btn-danger:hover {
        background-color: rgba(231, 76, 60, 0.1);
    }
    
    .nota-input, .observacion-input, .estado-select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    
    .nota-input:focus, .observacion-input:focus, .estado-select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
`;
document.head.appendChild(style);