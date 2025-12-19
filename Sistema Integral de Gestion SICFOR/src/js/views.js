import { ticketStore } from './ticketStore.js'

// Utilidades de formateo
export const getPrioridadClase = (prioridad) => {
  const clases = {
    'Baja': 'prioridad-baja',
    'Media': 'prioridad-media',
    'Alta': 'prioridad-alta',
    'Urgente': 'prioridad-urgente'
  }
  return clases[prioridad] || ''
}

export const getEstadoClase = (estado) => {
  const clases = {
    'Abierto': 'estado-abierto',
    'En proceso': 'estado-proceso',
    'Cerrado': 'estado-cerrado'
  }
  return clases[estado] || ''
}

export const formatearFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

export const formatearFechaHora = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Renderizar Layout
export function renderLayout(content) {
  const { currentUser } = ticketStore
  
  return `
    <div class="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="header-left">
              <h1 class="header-title">MESA DE AYUDA / SOPORTE</h1>
              <span class="header-subtitle">Sistema SICFOR - Grupo J</span>
            </div>
            <div class="header-right">
              <div class="user-info">
                <img 
                  src="${currentUser.foto}" 
                  alt="${currentUser.nombre}"
                  class="user-avatar"
                />
                <div class="user-details">
                  <span class="user-name">${currentUser.nombre}</span>
                  <span class="user-role">Rol: ${currentUser.rol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          ${content}
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p class="footer-text">
            Pie de página - SICFOR © 2023 | Grupo J - Mesa de Ayuda
          </p>
        </div>
      </footer>
    </div>
  `
}

// Renderizar Dashboard
export function renderDashboard(filtro = 'Abiertos') {
  const ticketsFiltrados = ticketStore.obtenerTicketsPorEstado(filtro)
  const estado = filtro

  const ticketsHTML = ticketsFiltrados.map(ticket => {
    const estadoClase = getEstadoClase(ticket.estado)
    const prioridadClase = getPrioridadClase(ticket.prioridad)
    
    return `
      <tr class="ticket-row" data-id="${ticket.id}">
        <td class="ticket-id">${ticket.id}</td>
        <td class="ticket-asunto">
          <div class="asunto-content">
            <span class="asunto-text">${ticket.asunto}</span>
            <span class="estado-badge ${estadoClase}">
              ${ticket.estado}
            </span>
          </div>
        </td>
        <td class="ticket-categoria">${ticket.categoria}</td>
        <td>
          <span class="prioridad-badge ${prioridadClase}">
            ${ticket.prioridad}
          </span>
        </td>
        <td class="ticket-fecha">${formatearFecha(ticket.fechaCreacion)}</td>
        <td class="ticket-acciones">
          <button class="btn-accion btn-ver" data-action="ver" data-id="${ticket.id}" title="Ver ticket">👁️</button>
          <button class="btn-accion btn-editar" data-action="editar" data-id="${ticket.id}" title="Editar ticket">✏️</button>
          <button class="btn-accion btn-eliminar" data-action="eliminar" data-id="${ticket.id}" title="Eliminar ticket">🗑️</button>
        </td>
      </tr>
    `
  }).join('')

  const emptyState = ticketsFiltrados.length === 0 ? `
    <div class="empty-state">
      <p>No hay tickets ${estado.toLowerCase()} en este momento</p>
    </div>
  ` : `
    <div class="tickets-table-container">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ASUNTO</th>
            <th>CATEGORÍA</th>
            <th>PRIORIDAD</th>
            <th>FECHA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          ${ticketsHTML}
        </tbody>
      </table>
    </div>
  `

  return `
    <div class="dashboard">
      <!-- Botón Crear Ticket -->
      <div class="crear-ticket-section">
        <button class="btn-crear-ticket" data-action="crear">
          <span class="btn-icon">+</span>
          CREAR TICKET DE SOPORTE
        </button>
      </div>

      <!-- Filtros -->
      <div class="filtros-section">
        <h2 class="section-title">Mis Tickets</h2>
        <div class="filtros-tabs">
          <button class="tab ${filtro === 'Abiertos' ? 'active' : ''}" data-filter="Abiertos">
            Mis Tickets Abiertos
          </button>
          <button class="tab ${filtro === 'Cerrados' ? 'active' : ''}" data-filter="Cerrados">
            Cerrados
          </button>
        </div>
      </div>

      <!-- Tabla de Tickets -->
      <div class="tickets-section">
        <h3 class="section-subtitle">LISTA DE TICKETS</h3>
        ${emptyState}
      </div>
    </div>
  `
}

// Renderizar Crear Ticket
export function renderCrearTicket() {
  const { currentUser } = ticketStore
  const categorias = ['Técnico', 'Administrativo', 'Académico', 'Software', 'Hardware']
  const prioridades = ['Baja', 'Media', 'Alta', 'Urgente']

  const categoriasOptions = categorias.map(cat => 
    `<option value="${cat}">${cat}</option>`
  ).join('')

  const prioridadesOptions = prioridades.map(pri => 
    `<option value="${pri}">${pri}</option>`
  ).join('')

  return `
    <div class="crear-ticket-page">
      <div class="crear-ticket-container">
        <h2 class="page-title">CREAR TICKET</h2>
        
        <form id="ticketForm" class="ticket-form">
          <!-- Usuario -->
          <div class="form-section user-section">
            <div class="user-photo">
              <img src="${currentUser.foto}" alt="${currentUser.nombre}" />
            </div>
            <div class="user-name">
              <h3>${currentUser.nombre}</h3>
            </div>
          </div>

          <!-- Asunto -->
          <div class="form-group">
            <label for="asunto" class="form-label">
              Asunto: <span class="required">*</span>
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              class="form-input"
              placeholder="Ingrese el asunto del ticket"
              required
            />
          </div>

          <!-- Categoría y Prioridad -->
          <div class="form-row">
            <div class="form-group">
              <label for="categoria" class="form-label">
                Categoría:
              </label>
              <select
                id="categoria"
                name="categoria"
                class="form-select"
              >
                ${categoriasOptions}
              </select>
            </div>

            <div class="form-group">
              <label for="prioridad" class="form-label">
                Prioridad:
              </label>
              <select
                id="prioridad"
                name="prioridad"
                class="form-select"
              >
                ${prioridadesOptions}
              </select>
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion" class="form-label">
              Descripción: <span class="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              class="form-textarea"
              placeholder="Describa detalladamente su problema o solicitud"
              rows="6"
              required
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button type="submit" class="btn btn-guardar">
              GUARDAR
            </button>
            <button 
              type="button" 
              class="btn btn-cancelar"
              data-action="cancelar"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  `
}

// Renderizar Ver Ticket
export function renderVerTicket(ticketId) {
  const ticket = ticketStore.obtenerTicket(ticketId)
  
  if (!ticket) {
    return `<div class="loading">Ticket no encontrado</div>`
  }

  const respuestasHTML = ticket.respuestas.map(resp => `
    <div class="respuesta-item ${resp.esAgente ? 'respuesta-agente' : 'respuesta-usuario'}">
      <div class="respuesta-header">
        <span class="respuesta-autor">
          ${resp.esAgente ? '🎧 ' : '👤 '}${resp.autor}
        </span>
        <span class="respuesta-fecha">
          (${formatearFechaHora(resp.fecha)})
        </span>
      </div>
      <div class="respuesta-mensaje">
        "${resp.mensaje}"
      </div>
    </div>
  `).join('')

  const estadoClase = getEstadoClase(ticket.estado)
  const prioridadClase = getPrioridadClase(ticket.prioridad)

  return `
    <div class="ver-ticket-page">
      <div class="ver-ticket-container">
        <!-- Header -->
        <div class="ticket-header">
          <div class="ticket-header-left">
            <h2 class="ticket-title">VER TICKET</h2>
            <div class="ticket-id-estado">
              <span class="ticket-id-label">Ticket ID: ${ticket.id}</span>
              <span class="estado-badge-large ${estadoClase}">
                ${ticket.estado.toUpperCase()}
              </span>
            </div>
          </div>
          <button class="btn-volver" data-action="volver">
            ← Volver al listado
          </button>
        </div>

        <!-- Información del Ticket -->
        <div class="ticket-info-section" id="infoSection">
          <div class="info-row">
            <div class="info-group">
              <label>Prioridad:</label>
              <span class="prioridad-badge prioridad-${ticket.prioridad.toLowerCase()}">
                ${ticket.prioridad}
              </span>
            </div>
            <div class="info-group">
              <label>Categoría:</label>
              <span class="categoria-badge">${ticket.categoria}</span>
            </div>
          </div>

          <div class="info-group full-width">
            <label>Asunto:</label>
            <p class="info-value">${ticket.asunto}</p>
          </div>

          <div class="info-group full-width">
            <label>Descripción Detallada:</label>
            <p class="info-description">${ticket.descripcion}</p>
          </div>

          <div class="info-buttons">
            <button 
              class="btn-info-action btn-ver"
              data-action="editar"
              ${ticket.estado === 'Cerrado' ? 'disabled' : ''}
            >
              Ver / Editar
            </button>
            <button 
              class="btn-info-action btn-responder"
              ${ticket.estado === 'Cerrado' ? 'disabled' : ''}
            >
              Responder
            </button>
            <button 
              class="btn-info-action btn-reabrir"
              ${ticket.estado !== 'Cerrado' ? 'disabled' : ''}
            >
              Reabrir
            </button>
          </div>
        </div>

        <!-- Historial de Respuestas -->
        <div class="respuestas-section">
          <h3 class="section-title">HISTORIAL DE RESPUESTAS</h3>
          
          <div class="respuestas-lista">
            ${ticket.respuestas.length === 0 ? `
              <div class="empty-respuestas">
                <p>No hay respuestas aún. Sea el primero en responder.</p>
              </div>
            ` : respuestasHTML}
          </div>

          ${ticket.estado !== 'Cerrado' ? `
            <div class="anadir-respuesta">
              <h4 class="anadir-title">Añadir Respuesta...</h4>
              <textarea
                id="respuestaTextarea"
                class="respuesta-textarea"
                placeholder="Escriba su respuesta aquí..."
                rows="4"
              ></textarea>
              <div class="respuesta-buttons">
                <button 
                  class="btn btn-responder-usuario"
                  data-action="responder-usuario"
                >
                  Responder como Usuario
                </button>
                <button 
                  class="btn btn-responder-agente"
                  data-action="responder-agente"
                >
                  Responder como Soporte
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Acción Final -->
        <div class="ticket-actions">
          <button 
            class="btn btn-cerrar-ticket"
            data-action="cerrar"
            ${ticket.estado === 'Cerrado' ? 'disabled' : ''}
          >
            CERRAR TICKET
          </button>
        </div>
      </div>
    </div>
  `
}
