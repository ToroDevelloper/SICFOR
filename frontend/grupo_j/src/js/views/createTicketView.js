import { ticketStore } from '../ticketStore.js'

export function renderCrearTicket() {
  const { currentUser } = ticketStore
  const categorias = ['Técnico', 'Administrativo', 'Académico', 'Software', 'Hardware']
  const prioridades = ['Baja', 'Media', 'Alta', 'Urgente']

  const categoriasOptions = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')
  const prioridadesOptions = prioridades.map(pri => `<option value="${pri}">${pri}</option>`).join('')

  return `
    <div class="crear-ticket-page">
      <div class="crear-ticket-container">
        <h2 class="page-title">CREAR TICKET</h2>
        <form id="ticketForm" class="ticket-form">
          <div class="form-section user-section">
            <div class="user-photo"><img src="${currentUser.foto}" alt="${currentUser.nombre}" /></div>
            <div class="user-name"><h3>${currentUser.nombre}</h3></div>
          </div>
          <div class="form-group">
            <label for="asunto" class="form-label">Asunto: <span class="required">*</span></label>
            <input type="text" id="asunto" name="asunto" class="form-input" placeholder="Ingrese el asunto del ticket" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="categoria" class="form-label">Categoría:</label>
              <select id="categoria" name="categoria" class="form-select">${categoriasOptions}</select>
            </div>
            <div class="form-group">
              <label for="prioridad" class="form-label">Prioridad:</label>
              <select id="prioridad" name="prioridad" class="form-select">${prioridadesOptions}</select>
            </div>
          </div>
          <div class="form-group">
            <label for="descripcion" class="form-label">Descripción: <span class="required">*</span></label>
            <textarea id="descripcion" name="descripcion" class="form-textarea" placeholder="Describa detalladamente su problema o solicitud" rows="6" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-guardar">GUARDAR</button>
            <button type="button" class="btn btn-cancelar" data-action="cancelar">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  `
}
