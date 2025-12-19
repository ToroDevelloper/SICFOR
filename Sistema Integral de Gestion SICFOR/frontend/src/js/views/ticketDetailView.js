import { ticketStore } from '../ticketStore.js'
import { getEstadoClase, getPrioridadClase, formatearFechaHora } from './utils.js'

export function renderVerTicket(ticketId, editMode = false) {
  const ticket = ticketStore.obtenerTicket(ticketId)
  if (!ticket) return '<div class="loading">Ticket no encontrado</div>'

  const respuestasHTML = ticket.respuestas.map(resp => `
    <div class="respuesta-item ${resp.esAgente ? 'respuesta-agente' : 'respuesta-usuario'}" data-respuesta-id="${resp.id}">
      <div class="respuesta-header">
        <span class="respuesta-autor">${resp.esAgente ? '🎧 ' : '👤 '}${resp.autor}</span>
        <span class="respuesta-fecha">(${formatearFechaHora(resp.fecha)})</span>
        ${ticket.estado !== 'Cerrado' ? `<button class="btn-editar-respuesta" data-action="editar-respuesta" data-respuesta-id="${resp.id}" title="Editar comentario">✏️</button>` : ''}
      </div>
      <div class="respuesta-mensaje" id="mensaje-${resp.id}">"${resp.mensaje}"</div>
      <div class="respuesta-edit-container" id="edit-container-${resp.id}" style="display: none;">
        <textarea id="edit-textarea-${resp.id}" class="respuesta-edit-textarea" rows="3">${resp.mensaje}</textarea>
        <div class="respuesta-edit-buttons">
          <button class="btn-small btn-guardar-resp" data-action="guardar-respuesta" data-respuesta-id="${resp.id}">Guardar</button>
          <button class="btn-small btn-cancelar-resp" data-action="cancelar-respuesta" data-respuesta-id="${resp.id}">Cancelar</button>
        </div>
      </div>
    </div>
  `).join('')

  const estadoClase = getEstadoClase(ticket.estado)

  const categorias = ['Técnico', 'Administrativo', 'Académico', 'Software', 'Hardware']
  const prioridades = ['Baja', 'Media', 'Alta', 'Urgente']

  const categoriasOptions = categorias.map(cat => `<option value="${cat}" ${ticket.categoria === cat ? 'selected' : ''}>${cat}</option>`).join('')
  const prioridadesOptions = prioridades.map(pri => `<option value="${pri}" ${ticket.prioridad === pri ? 'selected' : ''}>${pri}</option>`).join('')

  return `
    <div class="ver-ticket-page">
      <div class="ver-ticket-container">
        <div class="ticket-header">
          <div class="ticket-header-left">
            <h2 class="ticket-title">VER TICKET</h2>
            <div class="ticket-id-estado">
              <span class="ticket-id-label">Ticket ID: ${ticket.id}</span>
              <span class="estado-badge-large ${estadoClase}">${ticket.estado.toUpperCase()}</span>
            </div>
          </div>
          <button class="btn-volver" data-action="volver">← Volver al listado</button>
        </div>
        <div class="ticket-info-section" id="infoSection">
          ${editMode ? `
            <div class="info-row">
              <div class="info-group">
                <label>Prioridad:</label>
                <select id="editPrioridad" class="form-select">${prioridadesOptions}</select>
              </div>
              <div class="info-group">
                <label>Categoría:</label>
                <select id="editCategoria" class="form-select">${categoriasOptions}</select>
              </div>
            </div>
            <div class="info-group full-width">
              <label>Asunto: <span class="required">*</span></label>
              <input id="editAsunto" class="form-input" type="text" value="${ticket.asunto}" required minlength="3" maxlength="120" />
            </div>
            <div class="info-group full-width">
              <label>Descripción Detallada: <span class="required">*</span></label>
              <textarea id="editDescripcion" class="form-textarea" rows="6" required minlength="5" maxlength="1000">${ticket.descripcion}</textarea>
            </div>
          ` : `
            <div class="info-row">
              <div class="info-group">
                <label>Prioridad:</label>
                <span class="prioridad-badge prioridad-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span>
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
          `}
          <div class="info-buttons">
            ${editMode ? `
              <button class="btn-info-action btn-guardar" data-action="guardar-edicion">Guardar Cambios</button>
              <button class="btn-info-action btn-cancelar" data-action="cancelar-edicion">Cancelar</button>
            ` : `
              <button class="btn-info-action btn-ver" data-action="editar" ${ticket.estado === 'Cerrado' ? 'disabled' : ''}>Ver / Editar</button>
              <button class="btn-info-action btn-responder" data-action="scroll-responder" ${ticket.estado === 'Cerrado' ? 'disabled' : ''}>Responder</button>
            `}
            <button class="btn-info-action btn-reabrir" data-action="reabrir" ${ticket.estado !== 'Cerrado' ? 'disabled' : ''}>Reabrir</button>
          </div>
        </div>
        <div class="respuestas-section">
          <h3 class="section-title">HISTORIAL DE RESPUESTAS</h3>
          <div class="respuestas-lista">
            ${ticket.respuestas.length === 0 ? `
              <div class="empty-respuestas"><p>No hay respuestas aún. Sea el primero en responder.</p></div>
            ` : respuestasHTML}
          </div>
          ${ticket.estado !== 'Cerrado' ? `
            <div class="anadir-respuesta">
              <h4 class="anadir-title">Añadir Respuesta...</h4>
              <textarea id="respuestaTextarea" class="respuesta-textarea" placeholder="Escriba su respuesta aquí..." rows="4"></textarea>
              <div class="respuesta-buttons">
                <button class="btn btn-responder-usuario" data-action="responder-usuario">Responder como Usuario</button>
                <button class="btn btn-responder-agente" data-action="responder-agente">Responder como Soporte</button>
              </div>
            </div>
          ` : ''}
        </div>
        <div id="historialContainer" class="historial-container">
          <div class="loading">Cargando historial...</div>
        </div>
        <div class="ticket-actions">
          <button class="btn btn-cerrar-ticket" data-action="cerrar" ${ticket.estado === 'Cerrado' ? 'disabled' : ''}>CERRAR TICKET</button>
        </div>
      </div>
    </div>
  `
}
