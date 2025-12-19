import { ticketStore } from './ticketStore.js'
import { renderLayout, renderDashboard, renderCrearTicket, renderVerTicket } from './views.js'

let currentPage = 'dashboard'
let currentTicketId = null
let currentFiltro = 'Abiertos'

// Enrutador simple
export function navigate(page, params = {}) {
  currentPage = page
  currentTicketId = params.id || null
  render()
}

function render() {
  const root = document.getElementById('root')
  let content = ''

  switch (currentPage) {
    case 'dashboard':
      content = renderDashboard(currentFiltro)
      break
    case 'crear-ticket':
      content = renderCrearTicket()
      break
    case 'ver-ticket':
      content = renderVerTicket(currentTicketId)
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
  } else if (currentPage === 'crear-ticket') {
    attachCrearTicketListeners()
  } else if (currentPage === 'ver-ticket') {
    attachVerTicketListeners()
  }
}

function handleAction(e) {
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
    case 'editar':
      navigate('ver-ticket', { id })
      break
    case 'eliminar':
      handleEliminar(id)
      break
    case 'cerrar':
      handleCerrarTicket(currentTicketId)
      break
    case 'responder-usuario':
      handleEnviarRespuesta(false)
      break
    case 'responder-agente':
      handleEnviarRespuesta(true)
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
      // Actualizar desde el servidor y re-render
      ticketStore.fetchTickets(filtro).then(() => render())
    })
  })

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

function handleEliminar(id) {
  if (window.confirm('¿Está seguro de eliminar este ticket?')) {
    ticketStore.eliminarTicket(id)
    render()
  }
}

function handleCrearTicket(e) {
  e.preventDefault()
  
  const formData = {
    asunto: document.getElementById('asunto').value,
    categoria: document.getElementById('categoria').value,
    prioridad: document.getElementById('prioridad').value,
    descripcion: document.getElementById('descripcion').value
  }

  if (!formData.asunto.trim() || !formData.descripcion.trim()) {
    alert('Por favor complete todos los campos requeridos')
    return
  }

  const nuevoTicket = ticketStore.crearTicket(formData)
  alert(`Ticket #${nuevoTicket.id} creado exitosamente`)
  navigate('dashboard')
}

function handleCerrarTicket(id) {
  if (window.confirm('¿Está seguro de cerrar este ticket?')) {
    ticketStore.cerrarTicket(id)
    alert('Ticket cerrado exitosamente')
    render()
  }
}

function handleEnviarRespuesta(esAgente) {
  const textarea = document.getElementById('respuestaTextarea')
  const respuesta = textarea ? textarea.value.trim() : ''

  if (!respuesta) {
    alert('Por favor escriba una respuesta')
    return
  }

  ticketStore.agregarRespuesta(currentTicketId, respuesta, esAgente)
  render()
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
