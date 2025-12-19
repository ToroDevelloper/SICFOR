// Usuario actual
const CURRENT_USER = {
  id: 1,
  nombre: 'Fabian Andres',
  rol: 'Usuario',
  foto: 'https://ui-avatars.com/api/?name=Fabian+Andres&background=2563eb&color=fff&size=128'
}

const API_BASE = '/api'

class TicketStore {
  constructor() {
    this.tickets = []
    this.currentUser = CURRENT_USER
    this.listeners = []
    this.lastFiltro = 'Abiertos'
  }

  async fetchTickets(filtro = this.lastFiltro) {
    this.lastFiltro = filtro
    const params = new URLSearchParams({
      usuarioId: String(this.currentUser.id),
      estado: filtro
    })
    const res = await fetch(`${API_BASE}/tickets?${params.toString()}`)
    if (!res.ok) throw new Error('Error cargando tickets')
    this.tickets = await res.json()
    this.notifyListeners()
    return this.tickets
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  async crearTicket(ticketData) {
    const payload = {
      ...ticketData,
      usuarioId: this.currentUser.id
    }
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error creando ticket')
    const nuevoTicket = await res.json()
    this.tickets = [nuevoTicket, ...this.tickets]
    this.notifyListeners()
    return nuevoTicket
  }

  obtenerTicket(id) {
    return this.tickets.find(t => t.id === id)
  }

  async actualizarTicket(id, cambios) {
    const numId = Number(id)
    const res = await fetch(`${API_BASE}/tickets/${numId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    })
    if (!res.ok) throw new Error('Error actualizando ticket')
    const actualizado = await res.json()
    this.tickets = this.tickets.map(t => (t.id === id ? actualizado : t))
    this.notifyListeners()
  }

  async eliminarTicket(id) {
    const numId = Number(id)
    const res = await fetch(`${API_BASE}/tickets/${numId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error eliminando ticket')
    this.tickets = this.tickets.filter(t => t.id !== id)
    this.notifyListeners()
  }

  async agregarRespuesta(ticketId, mensaje, esAgente = false) {
    const numId = Number(ticketId)
    const autor = esAgente ? 'Soporte' : this.currentUser.nombre
    const res = await fetch(`${API_BASE}/tickets/${numId}/respuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, mensaje, esAgente })
    })
    if (!res.ok) throw new Error('Error agregando respuesta')
    const respuestas = await res.json()
    this.tickets = this.tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const nuevoEstado = ticket.estado === 'Abierto' ? 'En proceso' : ticket.estado
        return { ...ticket, respuestas, estado: nuevoEstado }
      }
      return ticket
    })
    this.notifyListeners()
  }

  async cerrarTicket(ticketId) {
    const numId = Number(ticketId)
    const res = await fetch(`${API_BASE}/tickets/${numId}/cerrar`, { method: 'POST' })
    if (!res.ok) throw new Error('Error cerrando ticket')
    const cerrado = await res.json()
    this.tickets = this.tickets.map(t => (t.id === ticketId ? cerrado : t))
    this.notifyListeners()
  }

  obtenerTicketsPorEstado(estado) {
    return this.tickets.filter(t =>
      t.usuarioId === this.currentUser.id &&
      (estado === 'Abiertos' ? t.estado !== 'Cerrado' : t.estado === 'Cerrado')
    )
  }
}

export const ticketStore = new TicketStore()
