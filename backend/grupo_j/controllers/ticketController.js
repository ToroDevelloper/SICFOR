import { pool, toClientTicket } from '../db.js'

export async function getAllTickets(usuarioId, estadoFiltro) {
  let where = 'WHERE usuario_id = ?'
  const params = [usuarioId]

  if (estadoFiltro === 'Cerrados') {
    where += ' AND estado = ?'
    params.push('Cerrado')
  } else if (estadoFiltro === 'Abiertos') {
    where += " AND estado <> 'Cerrado'"
  }

  const [rows] = await pool.query(
    `SELECT * FROM tickets ${where} ORDER BY id DESC`,
    params
  )
  return rows.map(r => toClientTicket(r))
}

export async function getTicketById(id) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id])
  if (rows.length === 0) return null

  const [resp] = await pool.query('SELECT * FROM respuestas WHERE ticket_id = ? ORDER BY id ASC', [id])
  return toClientTicket(rows[0], resp)
}

export async function createTicket({ asunto, descripcion, categoria, prioridad, usuarioId }) {
  const now = new Date()
  const [result] = await pool.query(
    `INSERT INTO tickets (asunto, descripcion, categoria, prioridad, estado, fecha_creacion, usuario_id)
     VALUES (?, ?, ?, ?, 'Abierto', ?, ?)`,
    [asunto, descripcion, categoria || 'Software', prioridad || 'Media', now, usuarioId]
  )
  const newId = result.insertId
  
  // Registrar en historial
  await pool.query(
    `INSERT INTO ticket_historial (ticket_id, accion, estado_nuevo, usuario, fecha)
     VALUES (?, 'Creado', 'Abierto', 'Sistema', ?)`,
    [newId, now]
  )
  
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [newId])
  return toClientTicket(rows[0], [])
}

export async function updateTicket(id, { asunto, descripcion, categoria, prioridad, estado }) {
  const now = new Date()
  
  // Obtener estado anterior
  const [oldTicket] = await pool.query('SELECT estado FROM tickets WHERE id = ?', [id])
  const estadoAnterior = oldTicket.length > 0 ? oldTicket[0].estado : null
  
  await pool.query(
    `UPDATE tickets SET asunto = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ? WHERE id = ?`,
    [asunto, descripcion, categoria, prioridad, estado, id]
  )
  
  // Registrar en historial
  const cambios = []
  if (estadoAnterior && estadoAnterior !== estado) {
    cambios.push(`Estado: ${estadoAnterior} → ${estado}`)
  }
  
  await pool.query(
    `INSERT INTO ticket_historial (ticket_id, accion, estado_anterior, estado_nuevo, descripcion, usuario, fecha)
     VALUES (?, 'Editado', ?, ?, ?, 'Usuario', ?)`,
    [id, estadoAnterior, estado, cambios.length > 0 ? cambios.join(', ') : 'Datos actualizados', now]
  )
  
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id])
  return toClientTicket(rows[0], [])
}

export async function deleteTicket(id) {
  await pool.query('DELETE FROM tickets WHERE id = ?', [id])
}

export async function addRespuesta(ticketId, { autor, mensaje, esAgente }) {
  const now = new Date()
  await pool.query(
    `INSERT INTO respuestas (ticket_id, autor, mensaje, fecha, es_agente) VALUES (?, ?, ?, ?, ?)`,
    [ticketId, autor, mensaje, now, esAgente ? 1 : 0]
  )
  
  // Registrar en historial
  const preview = mensaje.length > 50 ? mensaje.substring(0, 50) + '...' : mensaje
  await pool.query(
    `INSERT INTO ticket_historial (ticket_id, accion, descripcion, usuario, fecha)
     VALUES (?, 'Respuesta agregada', ?, ?, ?)`,
    [ticketId, `${autor}: "${preview}"`, autor, now]
  )
  
  const [resp] = await pool.query('SELECT * FROM respuestas WHERE ticket_id = ? ORDER BY id ASC', [ticketId])
  return resp.map(r => ({
    id: r.id,
    autor: r.autor,
    mensaje: r.mensaje,
    fecha: r.fecha?.toISOString(),
    esAgente: !!r.es_agente
  }))
}

export async function cerrarTicket(id) {
  const now = new Date()
  await pool.query(
    `UPDATE tickets SET estado = 'Cerrado', fecha_cierre = ? WHERE id = ?`,
    [now, id]
  )
  
  // Registrar en historial
  await pool.query(
    `INSERT INTO ticket_historial (ticket_id, accion, estado_anterior, estado_nuevo, usuario, fecha)
     VALUES (?, 'Cerrado', 'Abierto', 'Cerrado', 'Usuario', ?)`,
    [id, now]
  )
  
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id])
  return toClientTicket(rows[0], [])
}

export async function reabrirTicket(id) {
  const now = new Date()
  await pool.query(
    `UPDATE tickets SET estado = 'Abierto', fecha_cierre = NULL WHERE id = ?`,
    [id]
  )
  
  // Registrar en historial
  await pool.query(
    `INSERT INTO ticket_historial (ticket_id, accion, estado_anterior, estado_nuevo, usuario, fecha)
     VALUES (?, 'Reabierto', 'Cerrado', 'Abierto', 'Usuario', ?)`,
    [id, now]
  )
  
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id])
  return toClientTicket(rows[0], [])
}

export async function updateRespuesta(respuestaId, { mensaje }) {
  const now = new Date()
  
  // Obtener información de la respuesta y ticket
  const [respInfo] = await pool.query('SELECT ticket_id, autor FROM respuestas WHERE id = ?', [respuestaId])
  
  await pool.query(
    `UPDATE respuestas SET mensaje = ? WHERE id = ?`,
    [mensaje, respuestaId]
  )
  
  // Registrar en historial
  if (respInfo.length > 0) {
    const { ticket_id, autor } = respInfo[0]
    await pool.query(
      `INSERT INTO ticket_historial (ticket_id, accion, descripcion, usuario, fecha)
       VALUES (?, 'Respuesta editada', ?, ?, ?)`,
      [ticket_id, `Comentario de ${autor} fue editado`, autor, now]
    )
  }
  
  const [rows] = await pool.query('SELECT * FROM respuestas WHERE id = ?', [respuestaId])
  if (rows.length === 0) return null
  
  const r = rows[0]
  return {
    id: r.id,
    autor: r.autor,
    mensaje: r.mensaje,
    fecha: r.fecha?.toISOString(),
    esAgente: !!r.es_agente
  }
}

export async function getHistorial(ticketId) {
  const [rows] = await pool.query(
    'SELECT * FROM ticket_historial WHERE ticket_id = ? ORDER BY fecha DESC',
    [ticketId]
  )
  return rows.map(r => ({
    id: r.id,
    ticketId: r.ticket_id,
    accion: r.accion,
    estadoAnterior: r.estado_anterior,
    estadoNuevo: r.estado_nuevo,
    descripcion: r.descripcion,
    usuario: r.usuario,
    fecha: r.fecha?.toISOString()
  }))
}

export async function getHistorialGeneral(usuarioId) {
  const [rows] = await pool.query(
    `SELECT h.*, t.asunto, t.estado AS estado_ticket, t.id AS ticket_id
     FROM ticket_historial h
     JOIN tickets t ON h.ticket_id = t.id
     WHERE t.usuario_id = ?
     ORDER BY h.fecha DESC
     LIMIT 200`,
    [usuarioId]
  )

  return rows.map(r => ({
    id: r.id,
    ticketId: r.ticket_id,
    asunto: r.asunto,
    accion: r.accion,
    estadoAnterior: r.estado_anterior,
    estadoNuevo: r.estado_nuevo || r.estado_ticket,
    descripcion: r.descripcion,
    usuario: r.usuario,
    fecha: r.fecha?.toISOString()
  }))
}
