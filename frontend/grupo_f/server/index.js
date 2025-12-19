const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// Configuración de MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "123456",//Agregar su contraseña mysql
  database: process.env.MYSQL_DATABASE || "modulo_financiero",
}

// Pool de conexiones
let pool

async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig)
    console.log("Conexión a MySQL establecida")
  } catch (error) {
    console.error("Error al conectar a MySQL:", error)
    process.exit(1)
  }
}

// Helper para ejecutar queries
async function query(sql, params) {
  const [results] = await pool.execute(sql, params)
  return results
}

function generarNumeroOperacion() {
  const fecha = new Date()
  const año = fecha.getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `OP${año}${timestamp}`
}

// =====================
// RUTAS API
// =====================

// GET /api/dashboard - Obtener datos del dashboard y estado de cuenta
app.get("/api/dashboard", async (req, res) => {
  try {
    // Obtener estado de cuenta
    const [estadoCuenta] = await query("SELECT total_pagado, deuda_pendiente FROM estados_cuenta WHERE usuario_id = 1")

    // Contar transacciones pendientes
    const [pendientesResult] = await query(
      "SELECT COUNT(*) as total FROM transacciones WHERE usuario_id = 1 AND estado = 'Pendiente'",
    )

    // Transacciones de hoy
    const [hoyResult] = await query(
      "SELECT COUNT(*) as total FROM transacciones WHERE usuario_id = 1 AND DATE(fecha) = CURDATE()",
    )

    // Últimas transacciones
    const ultimasTransacciones = await query(
      `SELECT id, fecha, monto, concepto, estado, numero_operacion, 
              metodo_pago_id, created_at
       FROM transacciones 
       WHERE usuario_id = 1 
       ORDER BY fecha DESC, id DESC 
       LIMIT 5`,
    )

    res.json({
      success: true,
      data: {
        totalPagado: estadoCuenta?.total_pagado || 0,
        deudaPendiente: estadoCuenta?.deuda_pendiente || 0,
        transaccionesPendientes: pendientesResult?.total || 0,
        transaccionesHoy: hoyResult?.total || 0,
        ultimasTransacciones,
      },
    })
  } catch (error) {
    console.error("Error en dashboard:", error)
    res.status(500).json({ success: false, message: "Error al obtener datos del dashboard" })
  }
})

// GET /api/estado-cuenta - Estado de cuenta tipo "Cartola Bancaria"
app.get("/api/estado-cuenta", async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado } = req.query

    let whereClause = "WHERE t.usuario_id = 1"
    const params = []

    if (fechaInicio) {
      whereClause += " AND t.fecha >= ?"
      params.push(fechaInicio)
    }
    if (fechaFin) {
      whereClause += " AND t.fecha <= ?"
      params.push(fechaFin)
    }

    if (estado && estado !== "todos") {
      whereClause += " AND t.estado = ?"
      params.push(estado)
    }

    const transacciones = await query(
      `SELECT t.id, t.fecha, t.monto, t.concepto, t.estado, 
              t.numero_operacion, t.comprobante_url, t.created_at,
              m.nombre as metodo_pago
       FROM transacciones t
       LEFT JOIN metodos_pago m ON t.metodo_pago_id = m.id
       ${whereClause}
       ORDER BY t.fecha DESC, t.id DESC`,
      params,
    )

    // Calcular totales
    const [totales] = await query(
      `SELECT 
        COALESCE(SUM(CASE WHEN estado = 'Aprobado' THEN monto ELSE 0 END), 0) as total_pagado,
        COALESCE(SUM(CASE WHEN estado = 'Pendiente' THEN monto ELSE 0 END), 0) as total_pendiente,
        COALESCE(SUM(CASE WHEN estado = 'Rechazado' THEN monto ELSE 0 END), 0) as total_rechazado
       FROM transacciones 
       WHERE usuario_id = 1`,
    )

    const [estadoCuenta] = await query("SELECT deuda_pendiente FROM estados_cuenta WHERE usuario_id = 1")

    res.json({
      success: true,
      data: {
        transacciones,
        resumen: {
          totalPagado: totales?.total_pagado || 0,
          totalPendiente: totales?.total_pendiente || 0,
          totalRechazado: totales?.total_rechazado || 0,
          deudaTotal: estadoCuenta?.deuda_pendiente || 0,
        },
      },
    })
  } catch (error) {
    console.error("Error en estado de cuenta:", error)
    res.status(500).json({ success: false, message: "Error al obtener estado de cuenta" })
  }
})

// GET /api/transacciones - Listar transacciones con filtros
app.get("/api/transacciones", async (req, res) => {
  try {
    const { filtro = "todos" } = req.query

    let whereClause = "WHERE t.usuario_id = 1"

    switch (filtro) {
      case "hoy":
        whereClause += " AND DATE(t.fecha) = CURDATE()"
        break
      case "semana":
        whereClause += " AND t.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
        break
      case "mes":
        whereClause += " AND MONTH(t.fecha) = MONTH(CURDATE()) AND YEAR(t.fecha) = YEAR(CURDATE())"
        break
    }

    const transacciones = await query(
      `SELECT t.id, t.fecha, t.monto, t.concepto, t.estado, 
              t.numero_operacion, t.created_at,
              m.nombre as metodo_pago
       FROM transacciones t
       LEFT JOIN metodos_pago m ON t.metodo_pago_id = m.id
       ${whereClause}
       ORDER BY t.fecha DESC, t.id DESC`,
    )

    res.json({ success: true, data: transacciones })
  } catch (error) {
    console.error("Error al listar transacciones:", error)
    res.status(500).json({ success: false, message: "Error al obtener transacciones" })
  }
})

// POST /api/transacciones - Registrar pago (con validaciones)
app.post("/api/transacciones", async (req, res) => {
  try {
    const { monto, fecha, concepto, metodo_pago_id } = req.body

    if (!monto || !fecha || !concepto || !metodo_pago_id) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: monto, fecha, concepto y método de pago",
      })
    }

    if (Number.parseFloat(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a cero",
      })
    }

    const fechaPago = new Date(fecha)
    const hoy = new Date()
    hoy.setHours(23, 59, 59, 999)

    if (fechaPago > hoy) {
      return res.status(400).json({
        success: false,
        message: "No se permiten fechas futuras",
      })
    }

    const numeroOperacion = generarNumeroOperacion()

    // Insertar transacción con estado Pendiente por defecto
    const result = await query(
      `INSERT INTO transacciones (usuario_id, fecha, monto, concepto, metodo_pago_id, numero_operacion, estado)
       VALUES (1, ?, ?, ?, ?, ?, 'Pendiente')`,
      [fecha, monto, concepto, metodo_pago_id, numeroOperacion],
    )

    res.json({
      success: true,
      message: "Pago registrado exitosamente",
      data: {
        id: result.insertId,
        numeroOperacion,
        estado: "Pendiente",
      },
    })
  } catch (error) {
    console.error("Error al registrar pago:", error)
    res.status(500).json({ success: false, message: "Error al registrar el pago" })
  }
})

// PUT /api/transacciones/:id/estado - Aprobar o rechazar transacción
app.put("/api/transacciones/:id/estado", async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    if (!["Aprobado", "Rechazado"].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido. Use 'Aprobado' o 'Rechazado'",
      })
    }

    // Obtener transacción
    const [transaccion] = await query(
      "SELECT monto, estado as estadoActual FROM transacciones WHERE id = ? AND usuario_id = 1",
      [id],
    )

    if (!transaccion) {
      return res.status(404).json({ success: false, message: "Transacción no encontrada" })
    }

    if (transaccion.estadoActual !== "Pendiente") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden modificar transacciones pendientes",
      })
    }

    // Actualizar estado
    await query("UPDATE transacciones SET estado = ? WHERE id = ?", [estado, id])

    // Si se aprueba, actualizar estado de cuenta
    if (estado === "Aprobado") {
      await query(
        `UPDATE estados_cuenta 
         SET total_pagado = total_pagado + ?,
             deuda_pendiente = GREATEST(deuda_pendiente - ?, 0)
         WHERE usuario_id = 1`,
        [transaccion.monto, transaccion.monto],
      )
    }

    res.json({ success: true, message: `Transacción ${estado.toLowerCase()}` })
  } catch (error) {
    console.error("Error al actualizar estado:", error)
    res.status(500).json({ success: false, message: "Error al actualizar estado" })
  }
})

// GET /api/transacciones/:id/recibo - Generar datos para recibo
app.get("/api/transacciones/:id/recibo", async (req, res) => {
  try {
    const { id } = req.params

    const [transaccion] = await query(
      `SELECT t.id, t.fecha, t.monto, t.concepto, t.estado, 
              t.numero_operacion, t.created_at,
              m.nombre as metodo_pago,
              u.nombre as usuario_nombre, u.email as usuario_email
       FROM transacciones t
       LEFT JOIN metodos_pago m ON t.metodo_pago_id = m.id
       LEFT JOIN usuarios u ON t.usuario_id = u.id
       WHERE t.id = ? AND t.usuario_id = 1`,
      [id],
    )

    if (!transaccion) {
      return res.status(404).json({ success: false, message: "Transacción no encontrada" })
    }

    if (transaccion.estado !== "Aprobado") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden generar recibos de transacciones aprobadas",
      })
    }

    res.json({
      success: true,
      data: {
        ...transaccion,
        fechaEmision: new Date().toISOString(),
        empresa: "Grupo F - Sistema de Pagos",
      },
    })
  } catch (error) {
    console.error("Error al generar recibo:", error)
    res.status(500).json({ success: false, message: "Error al generar recibo" })
  }
})

// GET /api/metodos-pago - Listar métodos de pago
app.get("/api/metodos-pago", async (req, res) => {
  try {
    const metodos = await query("SELECT id, nombre, descripcion FROM metodos_pago WHERE activo = 1")
    res.json({ success: true, data: metodos })
  } catch (error) {
    console.error("Error al listar métodos:", error)
    res.status(500).json({ success: false, message: "Error al obtener métodos de pago" })
  }
})

// Ruta principal - servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Iniciar servidor
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
})
