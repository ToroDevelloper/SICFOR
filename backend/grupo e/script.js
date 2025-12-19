// ===== DATA MANAGEMENT =====
let resources = [];
const STORAGE_KEY = 'grupo_e_resources';

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadResources();
    initializeEventListeners();
    renderDashboard();
    updateStats();
});

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(item.dataset.section);
        });
    });

    // Forms
    document.getElementById('resourceForm').addEventListener('submit', saveResource);
    document.getElementById('crudForm').addEventListener('submit', saveCrudResource);

    // Search and filter
    document.getElementById('search-input').addEventListener('input', filterCrudTable);
    document.getElementById('type-filter').addEventListener('change', filterCrudTable);

    // Modal click outside
    document.getElementById('resourceModal').addEventListener('click', (e) => {
        if (e.target.id === 'resourceModal') closeResourceModal();
    });

    document.getElementById('crudModal').addEventListener('click', (e) => {
        if (e.target.id === 'crudModal') closeCrudModal();
    });
}

// ===== NAVIGATION =====
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });

    // Render section content
    if (sectionId === 'dashboard') {
        renderDashboard();
    } else if (sectionId === 'pdf') {
        renderResources('pdf');
    } else if (sectionId === 'guias') {
        renderResources('guias');
    } else if (sectionId === 'videos') {
        renderResources('videos');
    } else if (sectionId === 'enlaces') {
        renderResources('enlaces');
    } else if (sectionId === 'crud') {
        renderCrudTable();
    } else if (sectionId === 'config') {
        renderConfiguration();
    }
}

// ===== DASHBOARD =====
function renderDashboard() {
    updateStats();
    renderRecentResources();
}

function updateStats() {
    const stats = {
        pdf: resources.filter(r => r.type === 'pdf').length,
        guias: resources.filter(r => r.type === 'guias').length,
        videos: resources.filter(r => r.type === 'videos').length,
        enlaces: resources.filter(r => r.type === 'enlaces').length,
    };

    document.getElementById('count-pdf').textContent = stats.pdf;
    document.getElementById('count-guias').textContent = stats.guias;
    document.getElementById('count-videos').textContent = stats.videos;
    document.getElementById('count-enlaces').textContent = stats.enlaces;
}

function renderRecentResources() {
    const container = document.getElementById('recent-recursos');
    const recent = [...resources].reverse().slice(0, 5);

    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay recursos agregados aún</p>';
        return;
    }

    container.innerHTML = recent.map(resource => `
        <div class="resource-item">
            <div class="resource-item-info">
                <div class="resource-item-title">${resource.titulo}</div>
                <div class="resource-item-meta">
                    <span class="resource-type-badge">${getTypeName(resource.type)}</span>
                    <span>${new Date(resource.fecha).toLocaleDateString('es-ES')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== RESOURCES RENDERING =====
function renderResources(type) {
    const container = document.getElementById(`${type}-list`);
    const filtered = resources.filter(r => r.type === type);

    if (filtered.length === 0) {
        container.innerHTML = `<p class="empty-state">No hay ${getTypeName(type).toLowerCase()}</p>`;
        return;
    }

    container.innerHTML = filtered.map(resource => `
        <div class="resource-card">
            <h3>${resource.titulo}</h3>
            ${resource.descripcion ? `<p>${resource.descripcion}</p>` : ''}
            <div class="resource-meta">
                ${resource.autor ? `<span>👤 ${resource.autor}</span>` : ''}
                <span>📅 ${new Date(resource.fecha).toLocaleDateString('es-ES')}</span>
            </div>
            ${resource.etiquetas ? `
                <div class="resource-meta">
                    ${resource.etiquetas.split(',').map(tag => `<span>#${tag.trim()}</span>`).join('')}
                </div>
            ` : ''}
            <div class="resource-actions">
                <a href="${resource.url}" target="_blank" class="btn btn-primary btn-icon">Abrir</a>
                <button class="btn btn-danger btn-icon" onclick="deleteResource('${resource.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// ===== CRUD TABLE =====
function renderCrudTable(filtered = null) {
    const tbody = document.getElementById('crud-tbody');
    const data = filtered || resources;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">No hay recursos. Agrega uno nuevo.</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(resource => `
        <tr>
            <td><span class="type-badge">${getTypeName(resource.type)}</span></td>
            <td>${resource.titulo}</td>
            <td>${resource.descripcion || '-'}</td>
            <td>${new Date(resource.fecha).toLocaleDateString('es-ES')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editCrudResource('${resource.id}')">✏️ Editar</button>
                    <button class="btn-delete" onclick="deleteResource('${resource.id}')">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCrudTable() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;

    const filtered = resources.filter(resource => {
        const matchSearch = resource.titulo.toLowerCase().includes(search) ||
                          resource.descripcion.toLowerCase().includes(search);
        const matchType = !typeFilter || resource.type === typeFilter;
        return matchSearch && matchType;
    });

    renderCrudTable(filtered);
}

// ===== MODALS - RESOURCE =====
function openAddResourceModal(type) {
    clearResourceForm();
    document.getElementById('modal-title').textContent = `Agregar ${getTypeName(type)}`;
    const modal = document.getElementById('resourceModal');
    modal.classList.add('active');

    // Store type for form submission
    modal.dataset.type = type;
}

function closeResourceModal() {
    document.getElementById('resourceModal').classList.remove('active');
    clearResourceForm();
}

function clearResourceForm() {
    document.getElementById('resourceForm').reset();
}

function saveResource(e) {
    e.preventDefault();

    const modal = document.getElementById('resourceModal');
    const type = modal.dataset.type;

    const resource = {
        id: Date.now().toString(),
        type: type,
        titulo: document.getElementById('resource-titulo').value,
        descripcion: document.getElementById('resource-descripcion').value,
        url: document.getElementById('resource-url').value,
        autor: document.getElementById('resource-autor').value,
        etiquetas: document.getElementById('resource-etiquetas').value,
        fecha: new Date().toISOString(),
    };

    resources.push(resource);
    saveResources();
    closeResourceModal();

    // Re-render the section
    navigateToSection(type);
    showNotification(`${getTypeName(type)} agregado exitosamente`);
}

// ===== MODALS - CRUD =====
let editingResourceId = null;

function openCrudModal() {
    editingResourceId = null;
    document.getElementById('crud-modal-title').textContent = 'Nuevo Recurso';
    document.getElementById('crudForm').reset();
    document.getElementById('crudModal').classList.add('active');
}

function closeCrudModal() {
    document.getElementById('crudModal').classList.remove('active');
}

function editCrudResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;

    editingResourceId = id;
    document.getElementById('crud-modal-title').textContent = 'Editar Recurso';
    document.getElementById('crud-tipo').value = resource.type;
    document.getElementById('crud-titulo').value = resource.titulo;
    document.getElementById('crud-descripcion').value = resource.descripcion;
    document.getElementById('crud-url').value = resource.url;
    document.getElementById('crud-autor').value = resource.autor;

    document.getElementById('crudModal').classList.add('active');
}

function saveCrudResource(e) {
    e.preventDefault();

    const resourceData = {
        type: document.getElementById('crud-tipo').value,
        titulo: document.getElementById('crud-titulo').value,
        descripcion: document.getElementById('crud-descripcion').value,
        url: document.getElementById('crud-url').value,
        autor: document.getElementById('crud-autor').value,
    };

    if (editingResourceId) {
        // Update existing
        const index = resources.findIndex(r => r.id === editingResourceId);
        if (index !== -1) {
            resources[index] = {
                ...resources[index],
                ...resourceData,
            };
            showNotification('Recurso actualizado exitosamente');
        }
    } else {
        // Add new
        const resource = {
            id: Date.now().toString(),
            ...resourceData,
            fecha: new Date().toISOString(),
        };
        resources.push(resource);
        showNotification('Recurso agregado exitosamente');
    }

    saveResources();
    closeCrudModal();
    renderCrudTable();
    updateStats();
}

// ===== DELETE RESOURCE =====
function deleteResource(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
        return;
    }

    resources = resources.filter(r => r.id !== id);
    saveResources();
    showNotification('Recurso eliminado');

    // Re-render current section
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        navigateToSection(activeSection.id);
    }
}

// ===== CONFIGURATION =====
function renderConfiguration() {
    const statsInfo = document.getElementById('stats-info');
    const total = resources.length;
    const byType = {
        pdf: resources.filter(r => r.type === 'pdf').length,
        guias: resources.filter(r => r.type === 'guias').length,
        videos: resources.filter(r => r.type === 'videos').length,
        enlaces: resources.filter(r => r.type === 'enlaces').length,
    };

    statsInfo.innerHTML = `
        <p><strong>Total de Recursos:</strong> ${total}</p>
        <p><strong>PDFs:</strong> ${byType.pdf}</p>
        <p><strong>Guías:</strong> ${byType.guias}</p>
        <p><strong>Videos:</strong> ${byType.videos}</p>
        <p><strong>Enlaces:</strong> ${byType.enlaces}</p>
        <p style="font-size: 12px; color: #666; margin-top: 16px;">
            Última actualización: ${new Date().toLocaleDateString('es-ES')}
        </p>
    `;
}

function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        resources: resources,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grupo-e-recursos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Datos exportados exitosamente');
}

function importData() {
    const fileInput = document.getElementById('importFile');
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.resources && Array.isArray(data.resources)) {
                    if (confirm('¿Deseas reemplazar los recursos existentes?')) {
                        resources = data.resources;
                        saveResources();
                        renderDashboard();
                        showNotification('Datos importados exitosamente');
                    }
                }
            } catch (error) {
                showNotification('Error al importar archivo', 'error');
            }
        };
        reader.readAsText(file);
    }, { once: true });
}

function clearAllData() {
    if (!confirm('⚠️ ¿Estás seguro? Esto elimará TODOS los recursos. No se puede deshacer.')) {
        return;
    }

    if (!confirm('Segunda confirmación: ¿Realmente deseas eliminar todo?')) {
        return;
    }

    resources = [];
    saveResources();
    navigateToSection('dashboard');
    showNotification('Todos los datos han sido eliminados');
}

// ===== STORAGE =====
function saveResources() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

function loadResources() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        resources = JSON.parse(data);
    } else {
        resources = [];
    }
}

// ===== UTILITIES =====
function getTypeName(type) {
    const names = {
        pdf: 'Material PDF',
        guias: 'Guía',
        videos: 'Video',
        enlaces: 'Enlace',
    };
    return names[type] || type;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background-color: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ===== SAMPLE DATA (Optional - Comment out if not needed) =====
function initSampleData() {
    if (resources.length === 0) {
        resources = [
            {
                id: '1',
                type: 'pdf',
                titulo: 'Guía de JavaScript ES6',
                descripcion: 'Introducción completa a las características modernas de JavaScript',
                url: '#',
                autor: 'Grupo E',
                etiquetas: 'javascript, web, programación',
                fecha: new Date().toISOString(),
            },
            {
                id: '2',
                type: 'guias',
                titulo: 'Metodología Ágil',
                descripcion: 'Guía práctica sobre metodologías ágiles de desarrollo',
                url: '#',
                autor: 'Grupo E',
                etiquetas: 'agile, metodología, gestión',
                fecha: new Date().toISOString(),
            },
            {
                id: '3',
                type: 'videos',
                titulo: 'Tutorial React Hooks',
                descripcion: 'Series de videos sobre React Hooks y estado',
                url: '#',
                autor: 'Grupo E',
                etiquetas: 'react, hooks, frontend',
                fecha: new Date().toISOString(),
            },
            {
                id: '4',
                type: 'enlaces',
                titulo: 'Documentación MDN',
                descripcion: 'Referencia oficial de tecnologías web',
                url: 'https://developer.mozilla.org',
                autor: 'Mozilla',
                etiquetas: 'documentación, referencia, web',
                fecha: new Date().toISOString(),
            },
        ];
        saveResources();
    }
}

// Uncomment the line below to initialize with sample data on first load
// initSampleData();
