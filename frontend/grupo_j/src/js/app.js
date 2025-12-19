import { ticketStore } from './ticketStore.js'
import { renderLayout, renderDashboard, renderCrearTicket, renderVerTicket, renderHistorial } from './views.js'
import { showNotification, showConfirm } from './notifications.js'

let currentPage = 'dashboard'
let currentTicketId = null
let currentFiltro = 'Abiertos'
let isEditMode = false
let historialGeneral = []
let historialFiltro = 'Todos'

// Enrutador simple
export function navigate(page, params = {}) {
  currentPage = page
  currentTicketId = params.id || null
  if (typeof params.editMode !== 'undefined') {
    isEditMode = !!params.editMode
  }
  render()
}

function render() {
  const root = document.getElementById('root')

  if (currentPage === 'ver-ticket') {
    const ticket = ticketStore.obtenerTicket(currentTicketId)
    const necesitaDetalle = !ticket || !Array.isArray(ticket.respuestas)
    if (necesitaDetalle) {
      ticketStore.fetchTicketDetalle(currentTicketId).then(() => render())
      root.innerHTML = renderLayout('<div class="loading">Cargando ticket...</div>')
      return
    }
  }

  let content = ''

  switch (currentPage) {
    case 'dashboard':
      content = renderDashboard(currentFiltro)
      break
    case 'crear-ticket':
      content = renderCrearTicket()
      break
    case 'ver-ticket':
      content = renderVerTicket(currentTicketId, isEditMode)
      break
    default:
      content = renderDashboard(currentFiltro)
  }

  root.innerHTML = renderLayout(content)
  attachEventListeners()
}

function attachEventListeners() {
  // Botones de acción global
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', handleAction)
  })

  // Event listeners específicos por página
  if (currentPage === 'dashboard') {
    attachDashboardListeners()
    if (currentFiltro === 'Historial') {
      loadHistorialGeneral()
    }
  } else if (currentPage === 'crear-ticket') {
    attachCrearTicketListeners()
  } else if (currentPage === 'ver-ticket') {
    attachVerTicketListeners()
    loadHistorial()
  }
}

async function handleAction(e) {
  const action = e.currentTarget.dataset.action
  const id = e.currentTarget.dataset.id

  switch (action) {
    case 'crear':
      navigate('crear-ticket')
      break
    case 'volver':
      navigate('dashboard')
      break
    case 'cancelar':
      navigate('dashboard')
      break
    case 'ver':
      await ticketStore.fetchTicketDetalle(id)
      navigate('ver-ticket', { id, editMode: false })
      break
    case 'editar':
      const t = ticketStore.obtenerTicket(currentPage === 'dashboard' ? id : currentTicketId)
      if (t && t.estado === 'Cerrado') {
        showNotification('No se puede editar un ticket cerrado', 'warning')
        break
      }
      if (currentPage === 'dashboard') {
        await ticketStore.fetchTicketDetalle(id)
        navigate('ver-ticket', { id, editMode: true })
      } else {
        isEditMode = true
        render()
      }
      break
    case 'eliminar':
      handleEliminar(id)
      break
    case 'cerrar':
      handleCerrarTicket(currentTicketId)
      break
    case 'reabrir':
      handleReabrirTicket(currentTicketId)
      break
    case 'guardar-edicion':
      handleGuardarEdicion()
      break
    case 'cancelar-edicion':
      isEditMode = false
      render()
      break
    case 'responder-usuario':
      handleEnviarRespuesta(false)
      break
    case 'responder-agente':
      handleEnviarRespuesta(true)
      break
    case 'editar-respuesta':
      handleEditarRespuesta(e.currentTarget.dataset.respuestaId)
      break
    case 'guardar-respuesta':
      handleGuardarRespuesta(e.currentTarget.dataset.respuestaId)
      break
    case 'cancelar-respuesta':
      handleCancelarRespuesta(e.currentTarget.dataset.respuestaId)
      break
    case 'scroll-responder':
      handleScrollToRespuestas()
      break
  }
}

function attachDashboardListeners() {
  // Filtros de tabs
  document.querySelectorAll('.filtros-tabs .tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.filtros-tabs .tab').forEach(t => t.classList.remove('active'))
      e.currentTarget.classList.add('active')
      
      const filtro = e.currentTarget.dataset.filter
      currentFiltro = filtro
      if (filtro === 'Historial') {
        historialFiltro = 'Todos'
      }
      if (filtro === 'Historial') {
        render()
      } else {
        // Actualizar desde el servidor y re-render
        ticketStore.fetchTickets(filtro).then(() => render())
      }
    })
  })

  // Filtros del historial general
  if (currentFiltro === 'Historial') {
    document.querySelectorAll('.hist-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.hist-filter').forEach(b => b.classList.remove('active'))
        e.currentTarget.classList.add('active')
        const filtro = e.currentTarget.dataset.histFilter
        historialFiltro = filtro
        renderHistorialGeneralFiltrado(filtro)
      })
    })
  }

  // Hacer las filas de la tabla clicables
  document.querySelectorAll('.ticket-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (!e.target.closest('.ticket-acciones')) {
        const id = row.dataset.id
        navigate('ver-ticket', { id })
      }
    })
  })
}

function attachCrearTicketListeners() {
  const form = document.getElementById('ticketForm')
  if (form) {
    form.addEventListener('submit', handleCrearTicket)
  }
}

function attachVerTicketListeners() {
  // Los listeners de responder ya están en handleAction
}

async function handleEliminar(id) {
  showConfirm('¿Está seguro de eliminar este ticket?', async () => {
    try {
      await ticketStore.eliminarTicket(id)
      showNotification('Ticket eliminado exitosamente', 'success')
      render()
    } catch (err) {
      console.error('No se pudo eliminar el ticket:', err)
      showNotification('No se pudo eliminar el ticket', 'error')
    }
  })
}

async function handleCrearTicket(e) {
  e.preventDefault()
  
  const formData = {
    asunto: document.getElementById('asunto').value,
    categoria: document.getElementById('categoria').value,
    prioridad: document.getElementById('prioridad').value,
    descripcion: document.getElementById('descripcion').value
  }

  if (!formData.asunto.trim() || !formData.descripcion.trim()) {
    showNotification('Por favor complete todos los campos requeridos', 'warning')
    return
  }

  try {
    const nuevoTicket = await ticketStore.crearTicket(formData)
    showNotification(`Ticket #${nuevoTicket.id} creado exitosamente`, 'success')
    navigate('dashboard')
  } catch (err) {
    console.error('No se pudo crear el ticket:', err)
    showNotification('No se pudo crear el ticket', 'error')
  }
}

async function handleCerrarTicket(id) {
  showConfirm('¿Está seguro de cerrar este ticket?', async () => {
    try {
      await ticketStore.cerrarTicket(id)
      showNotification('Ticket cerrado exitosamente', 'success')
      render()
    } catch (err) {
      console.error('No se pudo cerrar el ticket:', err)
      showNotification('No se pudo cerrar el ticket', 'error')
    }
  })
}

async function handleReabrirTicket(id) {
  showConfirm('¿Está seguro de reabrir este ticket?', async () => {
    try {
      await ticketStore.reabrirTicket(id)
      showNotification('Ticket reabierto exitosamente', 'success')
      navigate('dashboard')
    } catch (err) {
      console.error('No se pudo reabrir el ticket:', err)
      showNotification('No se pudo reabrir el ticket', 'error')
    }
  })
}

async function handleGuardarEdicion() {
  const ticket = ticketStore.obtenerTicket(currentTicketId)
  if (!ticket) {
    showNotification('Ticket no encontrado', 'error')
    return
  }
  if (ticket.estado === 'Cerrado') {
    showNotification('No se puede editar un ticket cerrado', 'warning')
    return
  }
  const asunto = document.getElementById('editAsunto')?.value.trim() || ticket.asunto
  const categoria = document.getElementById('editCategoria')?.value || ticket.categoria
  const prioridad = document.getElementById('editPrioridad')?.value || ticket.prioridad
  const descripcion = document.getElementById('editDescripcion')?.value.trim() || ticket.descripcion

  if (!asunto || asunto.length < 3 || asunto.length > 120) {
    showNotification('El asunto debe tener entre 3 y 120 caracteres', 'warning')
    return
  }
  if (!descripcion || descripcion.length < 5 || descripcion.length > 1000) {
    showNotification('La descripción debe tener entre 5 y 1000 caracteres', 'warning')
    return
  }
  const categoriasValidas = ['Técnico','Administrativo','Académico','Software','Hardware']
  const prioridadesValidas = ['Baja','Media','Alta','Urgente']
  if (!categoriasValidas.includes(categoria) || !prioridadesValidas.includes(prioridad)) {
    showNotification('Categoría o prioridad inválidas', 'warning')
    return
  }

  try {
    await ticketStore.actualizarTicket(currentTicketId, {
      asunto,
      categoria,
      prioridad,
      descripcion,
      estado: ticket.estado
    })
    showNotification('Cambios guardados exitosamente', 'success')
    isEditMode = false
    render()
  } catch (err) {
    console.error('No se pudo guardar cambios:', err)
    showNotification('No se pudo guardar cambios', 'error')
  }
}

async function handleEnviarRespuesta(esAgente) {
  const textarea = document.getElementById('respuestaTextarea')
  const respuesta = textarea ? textarea.value.trim() : ''

  if (!respuesta) {
    showNotification('Por favor escriba una respuesta', 'warning')
    return
  }

  if (respuesta.length < 5) {
    showNotification('La respuesta debe tener al menos 5 caracteres', 'warning')
    return
  }

  try {
    await ticketStore.agregarRespuesta(currentTicketId, respuesta, esAgente)
    showNotification('Respuesta agregada exitosamente', 'success')
    render()
  } catch (err) {
    console.error('No se pudo enviar la respuesta:', err)
    showNotification('No se pudo enviar la respuesta', 'error')
  }
}

function handleEditarRespuesta(respuestaId) {
  const mensajeDiv = document.getElementById(`mensaje-${respuestaId}`)
  const editContainer = document.getElementById(`edit-container-${respuestaId}`)
  
  if (mensajeDiv && editContainer) {
    mensajeDiv.style.display = 'none'
    editContainer.style.display = 'block'
  }
}

async function handleGuardarRespuesta(respuestaId) {
  const textarea = document.getElementById(`edit-textarea-${respuestaId}`)
  const nuevoMensaje = textarea ? textarea.value.trim() : ''

  if (!nuevoMensaje) {
    showNotification('El mensaje no puede estar vacío', 'warning')
    return
  }

  if (nuevoMensaje.length < 5) {
    showNotification('El mensaje debe tener al menos 5 caracteres', 'warning')
    return
  }

  try {
    await ticketStore.actualizarRespuesta(currentTicketId, respuestaId, nuevoMensaje)
    showNotification('Comentario actualizado exitosamente', 'success')
    render()
  } catch (err) {
    console.error('No se pudo actualizar el comentario:', err)
    showNotification('No se pudo actualizar el comentario', 'error')
  }
}

function handleCancelarRespuesta(respuestaId) {
  const mensajeDiv = document.getElementById(`mensaje-${respuestaId}`)
  const editContainer = document.getElementById(`edit-container-${respuestaId}`)
  
  if (mensajeDiv && editContainer) {
    mensajeDiv.style.display = 'block'
    editContainer.style.display = 'none'
  }
}

function handleScrollToRespuestas() {
  const respuestasSection = document.querySelector('.anadir-respuesta')
  if (respuestasSection) {
    respuestasSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const textarea = document.getElementById('respuestaTextarea')
    if (textarea) {
      setTimeout(() => textarea.focus(), 300)
    }
  }
}

async function loadHistorial() {
  if (!currentTicketId) return
  
  try {
    const historial = await ticketStore.obtenerHistorial(currentTicketId)
    const container = document.getElementById('historialContainer')
    if (container) {
      container.innerHTML = renderHistorial(historial)
    }
  } catch (err) {
    console.error('Error cargando historial:', err)
    const container = document.getElementById('historialContainer')
    if (container) {
      container.innerHTML = `
        <div class="historial-section">
          <h3 class="section-title">HISTORIAL DE CAMBIOS</h3>
          <div class="error-message">No se pudo cargar el historial</div>
        </div>
      `
    }
  }
}

async function loadHistorialGeneral() {
  try {
    const historialRaw = await ticketStore.obtenerHistorialGeneral()
    historialGeneral = historialRaw.map(item => ({
      ...item,
      descripcion: item.descripcion || `Ticket ${item.ticketId} · ${item.asunto || ''}`.trim()
    }))
    renderHistorialGeneralFiltrado('Todos')
  } catch (err) {
    console.error('Error cargando historial general:', err)
    const container = document.querySelector('#historialGeneralContainer .historial-contenido')
    if (container) {
      container.innerHTML = `
        <div class="historial-section">
          <h3 class="section-title">Historial de tickets</h3>
          <div class="error-message">No se pudo cargar el historial</div>
        </div>
      `
    }
  }
}

function normalizarEstadoHistorial(item) {
  return (item.estadoNuevo || item.estado || '').toLowerCase()
}

function filtrarHistorialGeneral(filtro) {
  if (filtro === 'Todos') return historialGeneral
  return historialGeneral.filter(item => {
    const estadoActual = normalizarEstadoHistorial(item)
    const esCerrado = estadoActual === 'cerrado' || estadoActual === 'finalizado'
    if (filtro === 'Finalizados') {
      return esCerrado
    }
    if (filtro === 'Pendientes') {
      return !esCerrado
    }
    return true
  })
}

function renderHistorialGeneralFiltrado(filtro = historialFiltro) {
  const container = document.querySelector('#historialGeneralContainer .historial-contenido')
  if (!container) return
  const filtrado = filtrarHistorialGeneral(filtro)
  container.innerHTML = renderHistorial(filtrado, 'Historial de tickets')
}

// Inicializar la app
export async function initApp() {
  try {
    await ticketStore.fetchTickets('Abiertos')
  } catch (err) {
    console.error('No se pudieron cargar tickets:', err)
  }
  render()
}
