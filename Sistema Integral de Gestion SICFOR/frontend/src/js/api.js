import { API_BASE } from './constants.js'

const check = async (res, msg) => {
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json()).error || '' } catch {}
    throw new Error(detail || msg)
  }
  return res
}

export async function getTickets({ usuarioId, estado }) {
  const params = new URLSearchParams({ usuarioId: String(usuarioId), estado })
  const res = await fetch(`${API_BASE}/tickets?${params.toString()}`)
  await check(res, 'Error cargando tickets')
  return res.json()
}

export async function getTicket(id) {
  const numId = Number(id)
  const res = await fetch(`${API_BASE}/tickets/${numId}`)
  await check(res, 'Error obteniendo ticket')
  return res.json()
}

export async function createTicket(payload) {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  await check(res, 'Error creando ticket')
  return res.json()
}

export async function updateTicket(id, cambios) {
  const numId = Number(id)
  const res = await fetch(`${API_BASE}/tickets/${numId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios)
  })
  await check(res, 'Error actualizando ticket')
  return res.json()
}

export async function deleteTicket(id) {
  const numId = Number(id)
  const res = await fetch(`${API_BASE}/tickets/${numId}`, { method: 'DELETE' })
  await check(res, 'Error eliminando ticket')
}

export async function addRespuesta(ticketId, { autor, mensaje, esAgente }) {
  const numId = Number(ticketId)
  const res = await fetch(`${API_BASE}/tickets/${numId}/respuestas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ autor, mensaje, esAgente })
  })
  await check(res, 'Error agregando respuesta')
  return res.json()
}

export async function cerrarTicket(id) {
  const numId = Number(id)
  const res = await fetch(`${API_BASE}/tickets/${numId}/cerrar`, { method: 'POST' })
  await check(res, 'Error cerrando ticket')
  return res.json()
}

export async function reabrirTicket(id) {
  const numId = Number(id)
  const res = await fetch(`${API_BASE}/tickets/${numId}/reabrir`, { method: 'POST' })
  await check(res, 'Error reabriendo ticket')
  return res.json()
}

export async function updateRespuesta(ticketId, respuestaId, { mensaje }) {
  const numTicketId = Number(ticketId)
  const numRespId = Number(respuestaId)
  const res = await fetch(`${API_BASE}/tickets/${numTicketId}/respuestas/${numRespId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje })
  })
  await check(res, 'Error actualizando respuesta')
  return res.json()
}

export async function getHistorial(ticketId) {
  const numId = Number(ticketId)
  const res = await fetch(`${API_BASE}/tickets/${numId}/historial`)
  await check(res, 'Error obteniendo historial')
  return res.json()
}

export async function getHistorialGeneral(usuarioId) {
  const params = new URLSearchParams({ usuarioId: String(usuarioId) })
  const res = await fetch(`${API_BASE}/historial-general?${params.toString()}`)
  await check(res, 'Error obteniendo historial general')
  return res.json()
}
