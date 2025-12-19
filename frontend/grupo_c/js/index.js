// Cargar datos de instructores desde la API
let instructors = [];

// Mostrar loader mientras se cargan los datos
function showLoader() {
    instructorsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <p style="margin-top: 20px; color: #6c757d;">Cargando instructores...</p>
        </div>
    `;
}

async function loadInstructors() {
    showLoader();
    
    try {
        const response = await fetch('http://localhost:8080/api/instructores');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        instructors = await response.json();
        renderInstructors(instructors);
    } catch (error) {
        console.error('Error cargando instructores:', error);
        instructorsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                <p style="color: #e74c3c; font-weight: bold;">Error al cargar instructores</p>
                <p style="color: #6c757d; margin-top: 10px;">Por favor, verifica que el servidor esté ejecutándose en http://localhost:8080</p>
                <button onclick="loadInstructors()" style="margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
    }
}

// DOM Elements
const instructorsGrid = document.getElementById('instructorsGrid');
const btnNewInstructor = document.getElementById('btnNewInstructor');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');

// Renderizar instructores
function renderInstructors(instructorsToRender = instructors) {
    instructorsGrid.innerHTML = '';
    
    if (instructorsToRender.length === 0) {
        instructorsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6c757d; padding: 40px;">No se encontraron instructores</p>';
        return;
    }
    
    instructorsToRender.forEach(instructor => {
        const card = document.createElement('div');
        card.className = 'instructor-card';
        card.dataset.instructorId = instructor.id_instructor;
        card.innerHTML = `
            <img src="${instructor.foto_uri}" alt="${instructor.nombre} ${instructor.apellidos}" class="instructor-avatar">
            <div class="instructor-name">${instructor.nombres} ${instructor.apellidos}</div>
            <div class="instructor-specialty">${instructor.especialidad}</div>
            <span class="instructor-status status-${instructor.estado}">
                ${instructor.estado.charAt(0).toUpperCase() + instructor.estado.slice(1)}
            </span>
        `;
        
        instructorsGrid.appendChild(card);
    });
}

// Abrir página de registro de nuevo instructor
function openNewModal() {
    window.location.href = 'form-instructor.html';
}

// Filtrar y buscar instructores
function filterAndSearchInstructors() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    
    let filtered = instructors;
    
    // Filtrar por estado
    if (statusFilter !== 'todos') {
        filtered = filtered.filter(i => i.estado === statusFilter);
    }
    
    // Buscar por nombre o especialidad
    if (searchTerm) {
        filtered = filtered.filter(i => 
            i.nombres.toLowerCase().includes(searchTerm) ||
            i.apellidos.toLowerCase().includes(searchTerm) ||
            i.especialidad.toLowerCase().includes(searchTerm)
        );
    }
    
    renderInstructors(filtered);
}

// Event Listeners
btnNewInstructor.addEventListener('click', openNewModal);
searchInput.addEventListener('input', filterAndSearchInstructors);
filterStatus.addEventListener('change', filterAndSearchInstructors);

instructorsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.instructor-card');

    // TODO: Fijar esta por url o buscar alternativa para pasar el ID
    window.location.href = 'ver-perfil.html?instructorId=' + encodeURIComponent(card.dataset.instructorId);
});

// Renderizar instructores iniciales
loadInstructors();

