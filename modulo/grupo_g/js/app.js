// ========================================
// SICFOR - Módulo de Asistencia (Grupo G)
// Sistema autónomo con datos mockeados
// ========================================

console.log('🚀 SICFOR - Módulo de Asistencia iniciado');

// ========================================
// DATOS MOCKEADOS
// ========================================

// Estudiantes del sistema
const MOCK_STUDENTS = [
    { id: 1, nombre: 'Ana Rodríguez', foto: '👩' },
    { id: 2, nombre: 'Carlos López', foto: '👨' },
    { id: 3, nombre: 'María González', foto: '👩' },
    { id: 4, nombre: 'Pedro Martínez', foto: '👨' },
    { id: 5, nombre: 'Laura Sánchez', foto: '👩' },
    { id: 6, nombre: 'Diego Torres', foto: '👨' },
    { id: 7, nombre: 'Sofia Ramírez', foto: '👩' },
    { id: 8, nombre: 'Miguel Ángel Castro', foto: '👨' },
    { id: 9, nombre: 'Valentina Flores', foto: '👩' },
    { id: 10, nombre: 'Andrés Morales', foto: '👨' }
];

// Sesiones iniciales
const INITIAL_SESSIONS = [
    {
        id: 1,
        curso: 'Fundamentos de Programación',
        fecha: '2025-12-16',
        horaInicio: '08:00',
        horaFin: '10:00',
        docente: 'Juan Pérez'
    },
    {
        id: 2,
        curso: 'Fundamentos de Programación',
        fecha: '2025-12-15',
        horaInicio: '08:00',
        horaFin: '10:00',
        docente: 'Juan Pérez'
    },
    {
        id: 3,
        curso: 'Base de Datos',
        fecha: '2025-12-13',
        horaInicio: '10:00',
        horaFin: '12:00',
        docente: 'María García'
    },
    {
        id: 4,
        curso: 'Diseño de Sistemas',
        fecha: '2025-12-12',
        horaInicio: '14:00',
        horaFin: '16:00',
        docente: 'Roberto Silva'
    }
];

// ========================================
// ESTADO DE LA APLICACIÓN
// ========================================

let currentSession = null;
let students = [...MOCK_STUDENTS];
let sessions = [];
let attendanceRecords = {}; // { sessionId: [{ studentId, presente, justificacion }] }
let isEditMode = false;
let editSessionId = null;
let nextSessionId = 5;

// ========================================
// PERSISTENCIA CON LOCALSTORAGE
// ========================================

function loadFromStorage() {
    try {
        const savedSessions = localStorage.getItem('sicfor_sessions');
        const savedAttendance = localStorage.getItem('sicfor_attendance');
        const savedNextId = localStorage.getItem('sicfor_next_id');
        
        if (savedSessions) {
            sessions = JSON.parse(savedSessions);
        } else {
            sessions = [...INITIAL_SESSIONS];
            saveToStorage();
        }
        
        if (savedAttendance) {
            attendanceRecords = JSON.parse(savedAttendance);
        } else {
            // Inicializar asistencia para sesiones existentes
            sessions.forEach(session => {
                if (!attendanceRecords[session.id]) {
                    attendanceRecords[session.id] = students.map(student => ({
                        studentId: student.id,
                        presente: false,
                        justificacion: null
                    }));
                }
            });
        }
        
        if (savedNextId) {
            nextSessionId = parseInt(savedNextId);
        }
        
        console.log('✅ Datos cargados desde localStorage');
    } catch (error) {
        console.error('Error cargando datos:', error);
        sessions = [...INITIAL_SESSIONS];
    }
}

function saveToStorage() {
    try {
        localStorage.setItem('sicfor_sessions', JSON.stringify(sessions));
        localStorage.setItem('sicfor_attendance', JSON.stringify(attendanceRecords));
        localStorage.setItem('sicfor_next_id', nextSessionId.toString());
        console.log('💾 Datos guardados en localStorage');
    } catch (error) {
        console.error('Error guardando datos:', error);
    }
}

// ========================================
// UTILIDADES
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatTime(time) {
    return time;
}

// ========================================
// RENDERIZADO DE SESIÓN ACTUAL
// ========================================

function renderCurrentSession(session) {
    if (!session) {
        document.getElementById('sessionCurso').textContent = '-';
        document.getElementById('sessionFecha').textContent = '-';
        document.getElementById('sessionHora').textContent = '-';
        document.getElementById('sessionDocente').textContent = '-';
        currentSession = null;
        renderAttendanceTable();
        updateSummary();
        updateDashboard();
        return;
    }
    
    currentSession = session;
    document.getElementById('sessionCurso').textContent = session.curso;
    document.getElementById('sessionFecha').textContent = formatDate(session.fecha);
    document.getElementById('sessionHora').textContent = `${session.horaInicio} - ${session.horaFin}`;
    document.getElementById('sessionDocente').textContent = session.docente;
    
    // Limpiar campo de búsqueda al cambiar de sesión
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Cargar asistencia de esta sesión
    loadAttendanceForSession(session.id);
    
    // Actualizar dashboard
    updateDashboard();
}

// ========================================
// TABLA DE ASISTENCIA
// ========================================

function loadAttendanceForSession(sessionId) {
    if (!attendanceRecords[sessionId]) {
        // Inicializar asistencia vacía
        attendanceRecords[sessionId] = students.map(student => ({
            studentId: student.id,
            presente: false,
            justificacion: null
        }));
        // Guardar los nuevos registros
        saveToStorage();
    }
    
    // Renderizar tabla (que internamente llama a updateSummary)
    renderAttendanceTable();
}

function renderAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = '';
    
    if (!currentSession) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 40px; color: #94a3b8;">
                    No hay sesión seleccionada
                </td>
            </tr>
        `;
        return;
    }
    
    const sessionAttendance = attendanceRecords[currentSession.id] || [];
    
    students.forEach(student => {
        const record = sessionAttendance.find(r => r.studentId === student.id) || {
            studentId: student.id,
            presente: false,
            justificacion: null
        };
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="student-name">${student.nombre}</span>
            </td>
            <td>
                <input type="checkbox" 
                       class="custom-checkbox attendance-checkbox" 
                       data-student-id="${student.id}"
                       ${record.presente ? 'checked' : ''}>
            </td>
            <td>
                <select class="custom-select justification-select" 
                        data-student-id="${student.id}"
                        ${record.presente ? 'disabled' : ''}>
                    <option value="">Seleccionar</option>
                    <option value="Tarde" ${record.justificacion === 'Tarde' ? 'selected' : ''}>Tarde</option>
                    <option value="Justificado" ${record.justificacion === 'Justificado' ? 'selected' : ''}>Justificado</option>
                    <option value="Falta" ${record.justificacion === 'Falta' ? 'selected' : ''}>Falta</option>
                </select>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Agregar event listeners
    attachAttendanceListeners();
    updateSummary();
}

function attachAttendanceListeners() {
    // Checkboxes de presente
    document.querySelectorAll('.attendance-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleAttendanceChange);
    });
    
    // Selectores de justificación
    document.querySelectorAll('.justification-select').forEach(select => {
        select.addEventListener('change', handleJustificationChange);
    });
}

function handleAttendanceChange(event) {
    const studentId = parseInt(event.target.dataset.studentId);
    const presente = event.target.checked;
    
    // Actualizar en memoria
    const sessionAttendance = attendanceRecords[currentSession.id];
    const record = sessionAttendance.find(r => r.studentId === studentId);
    
    if (record) {
        record.presente = presente;
        if (presente) {
            record.justificacion = null; // Limpiar justificación si está presente
        }
    }
    
    // Deshabilitar/habilitar selector de justificación
    const select = document.querySelector(`.justification-select[data-student-id="${studentId}"]`);
    if (select) {
        select.disabled = presente;
        if (presente) {
            select.value = '';
        }
    }
    
    updateSummary();
    updateDashboard();
}

function handleJustificationChange(event) {
    const studentId = parseInt(event.target.dataset.studentId);
    const justificacion = event.target.value || null;
    
    // Actualizar en memoria
    const sessionAttendance = attendanceRecords[currentSession.id];
    const record = sessionAttendance.find(r => r.studentId === studentId);
    
    if (record) {
        record.justificacion = justificacion;
    }
    
    updateSummary();
    updateDashboard();
}

// ========================================
// RESUMEN DE ASISTENCIA
// ========================================

function updateSummary() {
    if (!currentSession) {
        document.getElementById('presentesCount').textContent = '0';
        document.getElementById('tardeCount').textContent = '0';
        document.getElementById('faltasCount').textContent = '0';
        return;
    }
    
    const sessionAttendance = attendanceRecords[currentSession.id] || [];
    
    let presentes = 0;
    let tarde = 0;
    let faltas = 0;
    
    sessionAttendance.forEach(record => {
        if (record.presente) {
            presentes++;
        } else {
            // Solo contar si tiene una justificación explícita
            if (record.justificacion === 'Tarde') {
                tarde++;
            } else if (record.justificacion === 'Falta') {
                faltas++;
            } else if (record.justificacion === 'Justificado') {
                // Los justificados no se cuentan en ninguna categoría
                // (podrías agregar un contador separado si lo necesitas)
            }
            // Si no tiene justificación (!record.justificacion), no se cuenta en ninguna parte
        }
    });
    
    document.getElementById('presentesCount').textContent = presentes;
    document.getElementById('tardeCount').textContent = tarde;
    document.getElementById('faltasCount').textContent = faltas;
}

// ========================================
// GUARDAR ASISTENCIA
// ========================================

function handleSaveAttendance() {
    if (!currentSession) {
        alert('⚠️ No hay sesión seleccionada');
        return;
    }
    
    saveToStorage();
    updateDashboard();
    alert('✅ Asistencia guardada exitosamente');
}

// ========================================
// MODAL DE SESIÓN
// ========================================

const modal = document.getElementById('sessionModal');
const modalTitle = document.getElementById('modalTitle');
const sessionForm = document.getElementById('sessionForm');

function openAddSessionModal() {
    isEditMode = false;
    editSessionId = null;
    modalTitle.textContent = 'Agregar Sesión';
    
    // Limpiar formulario
    document.getElementById('cursoInput').value = '';
    document.getElementById('fechaInput').value = new Date().toISOString().split('T')[0];
    document.getElementById('horaInicioInput').value = '';
    document.getElementById('horaFinInput').value = '';
    document.getElementById('docenteInput').value = '';
    
    modal.classList.add('active');
}

function openEditSessionModal() {
    if (!currentSession) {
        alert('⚠️ No hay sesión seleccionada');
        return;
    }
    
    isEditMode = true;
    editSessionId = currentSession.id;
    modalTitle.textContent = 'Editar Sesión';
    
    // Prellenar formulario
    document.getElementById('cursoInput').value = currentSession.curso;
    document.getElementById('fechaInput').value = currentSession.fecha;
    document.getElementById('horaInicioInput').value = currentSession.horaInicio;
    document.getElementById('horaFinInput').value = currentSession.horaFin;
    document.getElementById('docenteInput').value = currentSession.docente;
    
    modal.classList.add('active');
}

function closeSessionModal() {
    modal.classList.remove('active');
}

function handleSaveSession() {
    const curso = document.getElementById('cursoInput').value.trim();
    const fecha = document.getElementById('fechaInput').value;
    const horaInicio = document.getElementById('horaInicioInput').value;
    const horaFin = document.getElementById('horaFinInput').value;
    const docente = document.getElementById('docenteInput').value.trim();
    
    if (!curso || !fecha || !horaInicio || !horaFin || !docente) {
        alert('⚠️ Por favor complete todos los campos');
        return;
    }
    
    if (isEditMode && editSessionId) {
        // Editar sesión existente
        const session = sessions.find(s => s.id === editSessionId);
        if (session) {
            session.curso = curso;
            session.fecha = fecha;
            session.horaInicio = horaInicio;
            session.horaFin = horaFin;
            session.docente = docente;
            
            // Si es la sesión actual, actualizar vista
            if (currentSession && currentSession.id === editSessionId) {
                renderCurrentSession(session);
            }
            
            alert('✅ Sesión actualizada');
        }
    } else {
        // Crear nueva sesión
        const newSession = {
            id: nextSessionId++,
            curso,
            fecha,
            horaInicio,
            horaFin,
            docente
        };
        
        sessions.unshift(newSession); // Agregar al inicio
        
        // Inicializar asistencia vacía
        attendanceRecords[newSession.id] = students.map(student => ({
            studentId: student.id,
            presente: false,
            justificacion: null
        }));
        
        // Establecer como sesión actual
        renderCurrentSession(newSession);
        
        alert('✅ Sesión creada');
    }
    
    saveToStorage();
    updateHeaderInfo(); // Actualizar contador de sesiones
    renderSessionHistory();
    closeSessionModal();
}

// ========================================
// ELIMINAR SESIÓN
// ========================================

function handleDeleteSession() {
    if (!currentSession) {
        alert('⚠️ No hay sesión seleccionada');
        return;
    }
    
    if (!confirm('¿Está seguro de eliminar esta sesión?')) {
        return;
    }
    
    // Eliminar sesión
    const index = sessions.findIndex(s => s.id === currentSession.id);
    if (index !== -1) {
        sessions.splice(index, 1);
    }
    
    // Eliminar asistencia
    delete attendanceRecords[currentSession.id];
    
    // Establecer nueva sesión actual (la más reciente)
    if (sessions.length > 0) {
        renderCurrentSession(sessions[0]);
    } else {
        currentSession = null;
        renderCurrentSession(null);
        renderAttendanceTable();
    }
    
    saveToStorage();
    updateHeaderInfo(); // Actualizar contador de sesiones
    renderSessionHistory();
    alert('✅ Sesión eliminada');
}

// ========================================
// HISTORIAL DE SESIONES
// ========================================

function renderSessionHistory() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    
    if (sessions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
                    No hay sesiones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    sessions.forEach(session => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(session.fecha)}</td>
            <td>${session.curso}</td>
            <td>${session.docente}</td>
            <td>
                <button class="btn btn-sm btn-view" data-session-id="${session.id}">
                    Ver
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Event listeners para botones "Ver"
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sessionId = parseInt(e.target.dataset.sessionId);
            const session = sessions.find(s => s.id === sessionId);
            if (session) {
                renderCurrentSession(session);
                showCurrentSession();
            }
        });
    });
}

function showCurrentSession() {
    document.getElementById('currentSessionSection').style.display = 'block';
    document.getElementById('historySection').style.display = 'none';
}

function showHistory() {
    document.getElementById('currentSessionSection').style.display = 'none';
    document.getElementById('historySection').style.display = 'block';
}

// ========================================
// EVENT LISTENERS
// ========================================

document.getElementById('saveAttendanceBtn').addEventListener('click', handleSaveAttendance);
document.getElementById('addSessionBtn').addEventListener('click', openAddSessionModal);
document.getElementById('editSessionBtn').addEventListener('click', openEditSessionModal);
document.getElementById('deleteSessionBtn').addEventListener('click', handleDeleteSession);
document.getElementById('viewHistoryBtn').addEventListener('click', showHistory);
document.getElementById('backToCurrentBtn').addEventListener('click', showCurrentSession);

// Modal
document.getElementById('closeModal').addEventListener('click', closeSessionModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeSessionModal);
document.getElementById('saveSessionBtn').addEventListener('click', handleSaveSession);

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeSessionModal();
    }
});

// ========================================
// RELOJ EN TIEMPO REAL
// ========================================

function updateClock() {
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// ========================================
// MODO OSCURO
// ========================================

function loadTheme() {
    const savedTheme = localStorage.getItem('sicfor_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('sicfor_theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        const isDark = document.body.classList.contains('dark-mode');
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Event listener para toggle de tema
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ========================================
// BUSCADOR DE ESTUDIANTES
// ========================================

function setupStudentSearch() {
    const searchInput = document.getElementById('searchStudent');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.attendance-table tbody tr');
        
        rows.forEach(row => {
            const studentName = row.querySelector('.student-name');
            if (studentName) {
                const name = studentName.textContent.toLowerCase();
                if (name.includes(searchTerm)) {
                    row.style.display = '';
                    row.style.animation = 'fadeIn 0.3s ease';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
}

// ========================================
// DASHBOARD DE ESTADÍSTICAS
// ========================================

function updateDashboard() {
    // Total de estudiantes
    const dashTotalStudents = document.getElementById('dashTotalStudents');
    if (dashTotalStudents) {
        dashTotalStudents.textContent = students.length;
    }
    
    // Promedio de asistencia
    const dashAvgAttendance = document.getElementById('dashAvgAttendance');
    if (dashAvgAttendance && sessions.length > 0) {
        let totalAttendance = 0;
        let totalRecords = 0;
        
        Object.values(attendanceRecords).forEach(sessionRecords => {
            sessionRecords.forEach(record => {
                if (record.presente) totalAttendance++;
                totalRecords++;
            });
        });
        
        const avgPercentage = totalRecords > 0 
            ? Math.round((totalAttendance / totalRecords) * 100) 
            : 0;
        dashAvgAttendance.textContent = `${avgPercentage}%`;
    } else if (dashAvgAttendance) {
        dashAvgAttendance.textContent = '0%';
    }
    
    // Sesión actual
    const dashCurrentSession = document.getElementById('dashCurrentSession');
    if (dashCurrentSession) {
        if (currentSession) {
            dashCurrentSession.textContent = currentSession.curso;
        } else {
            dashCurrentSession.textContent = 'Sin sesión';
        }
    }
    
    // Última actualización
    const dashLastUpdate = document.getElementById('dashLastUpdate');
    if (dashLastUpdate) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        dashLastUpdate.textContent = timeString;
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

function updateHeaderInfo() {
    // Actualizar fecha actual
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const today = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        currentDateEl.textContent = today.toLocaleDateString('es-ES', options);
    }
    
    // Actualizar total de sesiones
    const totalSessionsEl = document.getElementById('totalSessions');
    if (totalSessionsEl) {
        totalSessionsEl.textContent = sessions.length;
    }
}

function init() {
    console.log('📚 Inicializando módulo de asistencia...');
    
    // Cargar tema guardado
    loadTheme();
    
    // Cargar datos
    loadFromStorage();
    
    // Actualizar información del header
    updateHeaderInfo();
    
    // Iniciar reloj en tiempo real
    updateClock();
    setInterval(updateClock, 1000);
    
    // Establecer sesión más reciente como actual
    if (sessions.length > 0) {
        renderCurrentSession(sessions[0]);
    } else {
        renderAttendanceTable();
    }
    
    // Renderizar historial
    renderSessionHistory();
    
    // Configurar buscador
    setupStudentSearch();
    
    // Actualizar dashboard
    updateDashboard();
    
    console.log('✅ Módulo listo');
    console.log(`📊 ${sessions.length} sesiones cargadas`);
    console.log(`👥 ${students.length} estudiantes`);
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

