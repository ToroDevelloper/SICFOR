// Cargar datos de instructores desde `datos-perfil.json`
let instructors = [];

function loadInstructors() {
    fetch('./datos-perfil.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            instructors = data;
            renderInstructors(instructors);
        })
        .catch(error => {
            console.error('Error cargando instructores:', error);
            renderInstructors(instructors);
        });
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
        card.innerHTML = `
            <img src="${instructor.avatar}" alt="${instructor.name}" class="instructor-avatar">
            <div class="instructor-name">${instructor.name}</div>
            <div class="instructor-specialty">${instructor.specialty}</div>
            <span class="instructor-status status-${instructor.status}">
                ${instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
            </span>
        `;
        
        card.addEventListener('click', () => {
            alert('Funcionalidad en desarrollo');
        });
        instructorsGrid.appendChild(card);
    });
}

// Abrir página de registro de nuevo instructor
function openNewModal() {
    window.location.href = 'registro-instructor.html';
}

// Filtrar y buscar instructores
function filterAndSearchInstructors() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    
    let filtered = instructors;
    
    // Filtrar por estado
    if (statusFilter !== 'todos') {
        filtered = filtered.filter(i => i.status === statusFilter);
    }
    
    // Buscar por nombre o especialidad
    if (searchTerm) {
        filtered = filtered.filter(i => 
            i.name.toLowerCase().includes(searchTerm) ||
            i.specialty.toLowerCase().includes(searchTerm)
        );
    }
    
    renderInstructors(filtered);
}

// Event Listeners
btnNewInstructor.addEventListener('click', openNewModal);
searchInput.addEventListener('input', filterAndSearchInstructors);
filterStatus.addEventListener('change', filterAndSearchInstructors);

// Renderizar instructores iniciales
loadInstructors();

