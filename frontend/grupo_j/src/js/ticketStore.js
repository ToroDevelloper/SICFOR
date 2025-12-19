import { CURRENT_USER } from './constants.js'
import * as api from './api.js'

class TicketStore {
  constructor() {
    this.tickets = []
    this.currentUser = CURRENT_USER
    this.listeners = []
    this.lastFiltro = 'Abiertos'
  }

  async fetchTickets(filtro = this.lastFiltro) {
    this.lastFiltro = filtro
    this.tickets = await api.getTickets({ usuarioId: this.currentUser.id, estado: filtro })
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
    const nuevoTicket = await api.createTicket(payload)
    this.tickets = [nuevoTicket, ...this.tickets]
    this.notifyListeners()
    return nuevoTicket
  }

  obtenerTicket(id) {
    const strId = String(id)
    return this.tickets.find(t => String(t.id) === strId)
  }

  async fetchTicketDetalle(id) {
    const numId = Number(id)
    const detalle = await api.getTicket(numId)
    const strId = String(numId)
    const yaExiste = this.tickets.some(t => String(t.id) === strId)
    this.tickets = yaExiste
      ? this.tickets.map(t => (String(t.id) === strId ? detalle : t))
      : [detalle, ...this.tickets]
    this.notifyListeners()
    return detalle
  }

  async actualizarTicket(id, cambios) {
    const strId = String(id)
    const actualizado = await api.updateTicket(id, cambios)
    this.tickets = this.tickets.map(t => (String(t.id) === strId ? actualizado : t))
    this.notifyListeners()
  }

  async eliminarTicket(id) {
    const strId = String(id)
    await api.deleteTicket(id)
    this.tickets = this.tickets.filter(t => String(t.id) !== strId)
    this.notifyListeners()
  }

  async agregarRespuesta(ticketId, mensaje, esAgente = false) {
    const strId = String(ticketId)
    const autor = esAgente ? 'Soporte' : this.currentUser.nombre
    const respuestas = await api.addRespuesta(ticketId, { autor, mensaje, esAgente })
    this.tickets = this.tickets.map(ticket => {
      if (String(ticket.id) === strId) {
        const nuevoEstado = ticket.estado === 'Abierto' ? 'En proceso' : ticket.estado
        return { ...ticket, respuestas, estado: nuevoEstado }
      }
      return ticket
    })
    this.notifyListeners()
  }

  async cerrarTicket(ticketId) {
    const strId = String(ticketId)
    const cerrado = await api.cerrarTicket(ticketId)
    this.tickets = this.tickets.map(t => (String(t.id) === strId ? cerrado : t))
    this.notifyListeners()
  }

  async reabrirTicket(ticketId) {
    const strId = String(ticketId)
    const reabierto = await api.reabrirTicket(ticketId)
    this.tickets = this.tickets.map(t => (String(t.id) === strId ? reabierto : t))
    this.notifyListeners()
  }

  async actualizarRespuesta(ticketId, respuestaId, nuevoMensaje) {
    const strId = String(ticketId)
    await api.updateRespuesta(ticketId, respuestaId, { mensaje: nuevoMensaje })
    // Refetch ticket to get updated response
    const updatedTicket = await api.getTicket(ticketId)
    this.tickets = this.tickets.map(t => (String(t.id) === strId ? updatedTicket : t))
    this.notifyListeners()
  }

  async obtenerHistorial(ticketId) {
    return await api.getHistorial(ticketId)
  }

  async obtenerHistorialGeneral() {
    return await api.getHistorialGeneral(this.currentUser.id)
  }

  obtenerTicketsPorEstado(estado) {
    return this.tickets.filter(t =>
      t.usuarioId === this.currentUser.id &&
      (estado === 'Abiertos' ? t.estado !== 'Cerrado' : t.estado === 'Cerrado')
    )
  }
}

export const ticketStore = new TicketStore()
