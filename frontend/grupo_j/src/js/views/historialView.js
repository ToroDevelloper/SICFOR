import { formatearFechaHora, getAccionClase, getAccionIcono } from './utils.js'

export function renderHistorial(historial, titulo = 'HISTORIAL DE CAMBIOS') {
  if (!historial || historial.length === 0) {
    return `
      <div class="historial-section">
        <h3 class="section-title">${titulo}</h3>
        <div class="historial-vacio">
          <p>No hay historial registrado para este ticket</p>
        </div>
      </div>
    `
  }

  const historialHTML = historial.map(item => {
    const accionClase = getAccionClase(item.accion)
    const icono = getAccionIcono(item.accion)
    const ticketInfo = item.ticketId ? `
      <div class="historial-ticket">
        <span class="historial-ticket-id">Ticket #${item.ticketId}</span>
        ${item.asunto ? `<span class="historial-ticket-asunto">${item.asunto}</span>` : ''}
      </div>
    ` : ''
    
    return `
      <div class="historial-item ${accionClase}">
        <div class="historial-icono">${icono}</div>
        <div class="historial-content">
          <div class="historial-header">
            <span class="historial-accion">${item.accion}</span>
            <span class="historial-fecha">${formatearFechaHora(item.fecha)}</span>
          </div>
          <div class="historial-detalles">
            <span class="historial-usuario">👤 ${item.usuario}</span>
            ${item.estadoAnterior ? `
              <span class="historial-estados">
                <span class="estado-badge-small ${item.estadoAnterior.toLowerCase()}">${item.estadoAnterior}</span>
                →
                <span class="estado-badge-small ${item.estadoNuevo.toLowerCase()}">${item.estadoNuevo}</span>
              </span>
            ` : ''}
          </div>
          ${ticketInfo}
          ${item.descripcion ? `<div class="historial-descripcion">${item.descripcion}</div>` : ''}
        </div>
      </div>
    `
  }).join('')

  return `
    <div class="historial-section">
      <h3 class="section-title">${titulo}</h3>
      <div class="historial-timeline">
        ${historialHTML}
      </div>
    </div>
  `
}
