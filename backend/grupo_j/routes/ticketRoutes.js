import express from 'express'
import * as ticketController from '../controllers/ticketController.js'

const router = express.Router()

// GET /api/tickets?usuarioId=1&estado=Abiertos|Cerrados
router.get('/tickets', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId)
  const estadoFiltro = req.query.estado

  if (!usuarioId) return res.status(400).json({ error: 'usuarioId requerido' })

  try {
    const tickets = await ticketController.getAllTickets(usuarioId, estadoFiltro)
    res.json(tickets)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener tickets' })
  }
})

// GET /api/tickets/:id
router.get('/tickets/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const ticket = await ticketController.getTicketById(id)
    if (!ticket) return res.status(404).json({ error: 'No encontrado' })
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener ticket' })
  }
})

// POST /api/tickets
router.post('/tickets', async (req, res) => {
  const { asunto, descripcion, categoria, prioridad, usuarioId } = req.body
  if (!asunto || !descripcion || !usuarioId) {
    return res.status(400).json({ error: 'Datos inválidos' })
  }
  try {
    const ticket = await ticketController.createTicket({ asunto, descripcion, categoria, prioridad, usuarioId })
    res.status(201).json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear ticket' })
  }
})

// PUT /api/tickets/:id
router.put('/tickets/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { asunto, descripcion, categoria, prioridad, estado } = req.body
  try {
    const ticket = await ticketController.updateTicket(id, { asunto, descripcion, categoria, prioridad, estado })
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar ticket' })
  }
})

// DELETE /api/tickets/:id
router.delete('/tickets/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await ticketController.deleteTicket(id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar ticket' })
  }
})

// POST /api/tickets/:id/respuestas
router.post('/tickets/:id/respuestas', async (req, res) => {
  const id = Number(req.params.id)
  const { autor, mensaje, esAgente } = req.body
  if (!autor || !mensaje) return res.status(400).json({ error: 'Datos inválidos' })
  try {
    const respuestas = await ticketController.addRespuesta(id, { autor, mensaje, esAgente })
    res.status(201).json(respuestas)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al agregar respuesta' })
  }
})

// POST /api/tickets/:id/cerrar
router.post('/tickets/:id/cerrar', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const ticket = await ticketController.cerrarTicket(id)
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cerrar ticket' })
  }
})

// POST /api/tickets/:id/reabrir
router.post('/tickets/:id/reabrir', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const ticket = await ticketController.reabrirTicket(id)
    res.json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al reabrir ticket' })
  }
})

// PUT /api/tickets/:id/respuestas/:respId
router.put('/tickets/:id/respuestas/:respId', async (req, res) => {
  const respId = Number(req.params.respId)
  const { mensaje } = req.body
  if (!mensaje || mensaje.trim().length < 5) {
    return res.status(400).json({ error: 'El mensaje debe tener al menos 5 caracteres' })
  }
  try {
    const respuesta = await ticketController.updateRespuesta(respId, { mensaje })
    if (!respuesta) return res.status(404).json({ error: 'Respuesta no encontrada' })
    res.json(respuesta)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al actualizar respuesta' })
  }
})

// GET /api/tickets/:id/historial
router.get('/tickets/:id/historial', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const historial = await ticketController.getHistorial(id)
    res.json(historial)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener historial' })
  }
})

// GET /api/historial-general?usuarioId=1
router.get('/historial-general', async (req, res) => {
  const usuarioId = Number(req.query.usuarioId)
  if (!usuarioId) return res.status(400).json({ error: 'usuarioId requerido' })
  try {
    const historial = await ticketController.getHistorialGeneral(usuarioId)
    res.json(historial)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener historial general' })
  }
})

// Health check
router.get('/health', async (_req, res) => {
  try {
    const { pool } = await import('../db.js')
    const [rows] = await pool.query('SELECT 1 AS ok')
    res.json({ status: 'ok', db: rows[0].ok === 1 })
  } catch {
    res.status(500).json({ status: 'error' })
  }
})

export default router
