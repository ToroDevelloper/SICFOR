import { ticketStore } from '../ticketStore.js'
import { getEstadoClase, getPrioridadClase, formatearFecha } from './utils.js'

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
            <span class="estado-badge ${estadoClase}">${ticket.estado}</span>
          </div>
        </td>
        <td class="ticket-categoria">${ticket.categoria}</td>
        <td><span class="prioridad-badge ${prioridadClase}">${ticket.prioridad}</span></td>
        <td class="ticket-fecha">${formatearFecha(ticket.fechaCreacion)}</td>
        <td class="ticket-acciones">
          <button class="btn-accion btn-ver" data-action="ver" data-id="${ticket.id}" title="Ver ticket">👁️</button>
          <button class="btn-accion btn-editar" data-action="editar" data-id="${ticket.id}" title="Editar ticket" ${ticket.estado === 'Cerrado' ? 'disabled' : ''}>✏️</button>
          <button class="btn-accion btn-eliminar" data-action="eliminar" data-id="${ticket.id}" title="Eliminar ticket">🗑️</button>
        </td>
      </tr>
    `
  }).join('')

  const emptyState = ticketsFiltrados.length === 0 ? `
    <div class="empty-state"><p>No hay tickets ${estado.toLowerCase()} en este momento</p></div>
  ` : `
    <div class="tickets-table-container">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>ID</th><th>ASUNTO</th><th>CATEGORÍA</th><th>PRIORIDAD</th><th>FECHA</th><th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>${ticketsHTML}</tbody>
      </table>
    </div>
  `

  return `
    <div class="dashboard">
      <div class="crear-ticket-section">
        <button class="btn-crear-ticket" data-action="crear"><span class="btn-icon">+</span>CREAR TICKET DE SOPORTE</button>
      </div>
      <div class="filtros-section">
        <h2 class="section-title">Mis Tickets</h2>
        <div class="filtros-tabs">
          <button class="tab ${filtro === 'Abiertos' ? 'active' : ''}" data-filter="Abiertos">Mis Tickets Abiertos</button>
          <button class="tab ${filtro === 'Cerrados' ? 'active' : ''}" data-filter="Cerrados">Cerrados</button>
          <button class="tab ${filtro === 'Historial' ? 'active' : ''}" data-filter="Historial">Historial</button>
        </div>
      </div>
      ${filtro === 'Historial' ? `
        <div class="historial-section" id="historialGeneralContainer">
          <h3 class="section-title">Historial de tickets</h3>
          <div class="historial-filtros">
            <button class="tab hist-filter active" data-hist-filter="Todos">Todos</button>
            <button class="tab hist-filter" data-hist-filter="Pendientes">Pendientes</button>
            <button class="tab hist-filter" data-hist-filter="Finalizados">Finalizados</button>
          </div>
          <div class="historial-contenido">
            <div class="loading">Cargando historial...</div>
          </div>
        </div>
      ` : `
        <div class="tickets-section">
          <h3 class="section-subtitle">LISTA DE TICKETS</h3>
          ${emptyState}
        </div>
      `}
    </div>
  `
}
