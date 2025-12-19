// Configuración de la API
const API_URL = "http://localhost:3001/api"

// Estado de la aplicación
const metodosPago = []
let transacciones = []

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacion()
  inicializarFormularios()
  inicializarFiltros()
  cargarDashboard()
  setFechaActual()
})

// Navegación entre pantallas
function inicializarNavegacion() {
  document.querySelectorAll(".sidebar .nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const screenId = e.currentTarget.getAttribute("data-screen")
      if (screenId) {
        showScreen(screenId)
      }
    })
  })
}

function showScreen(screenId) {
  // Ocultar todas las pantallas
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active")
  })

  // Mostrar la pantalla solicitada
  const newScreen = document.getElementById(screenId)
  if (newScreen) {
    newScreen.classList.add("active")
  }

  // Actualizar navegación activa
  document.querySelectorAll(".sidebar .nav-item").forEach((item) => {
    item.classList.remove("active")
    if (item.getAttribute("data-screen") === screenId) {
      item.classList.add("active")
    }
  })

  // Cargar datos según la pantalla
  switch (screenId) {
    case "home-screen":
      cargarDashboard()
      break
    case "estado-cuenta-screen":
      cargarEstadoCuenta()
      break
    case "transaction-history-screen":
      cargarTransacciones()
      break
    case "register-payment-screen":
      cargarMetodosParaSelect()
      cargarDashboard() // Para actualizar deuda en formulario
      break
  }
}

// Establecer fecha actual en el formulario (no permitir futuras)
function setFechaActual() {
  const fechaInput = document.getElementById("fecha")
  if (fechaInput) {
    const hoy = new Date().toISOString().split("T")[0]
    fechaInput.value = hoy
    fechaInput.max = hoy // Impedir fechas futuras
  }
}

// Cargar Dashboard
async function cargarDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`)
    const data = await response.json()

    if (data.success) {
      document.getElementById("deuda-pendiente").textContent = formatearMoneda(data.data.deudaPendiente)
      document.getElementById("total-pagado").textContent = formatearMoneda(data.data.totalPagado)
      document.getElementById("pagos-pendientes").textContent = `${data.data.transaccionesPendientes} transacciones`

      // Actualizar en formulario
      const deudaForm = document.getElementById("deuda-form")
      if (deudaForm) {
        deudaForm.textContent = formatearMoneda(data.data.deudaPendiente)
      }

      // Renderizar últimas transacciones
      renderizarUltimasTransacciones(data.data.ultimasTransacciones)
    }
  } catch (error) {
    console.error("Error al cargar dashboard:", error)
    mostrarToast("Error al cargar el dashboard", "error")
  }
}

// Renderizar últimas transacciones en el home
function renderizarUltimasTransacciones(transacciones) {
  const container = document.getElementById("ultimas-transacciones")

  if (!transacciones || transacciones.length === 0) {
    container.innerHTML = '<p class="loading">No hay transacciones recientes</p>'
    return
  }

  container.innerHTML = transacciones
    .map((t) => {
      const estadoClass = t.estado.toLowerCase()
      const estadoIcon =
        t.estado === "Aprobado" ? "fa-check-circle" : t.estado === "Pendiente" ? "fa-clock" : "fa-times-circle"
      return `
        <div class="transaction-item">
            <div class="icon-text">
                <i class="fas ${estadoIcon} ${estadoClass}-icon"></i>
                <div>
                    <span>${t.concepto}</span>
                    <span class="ref-web">N° ${t.numero_operacion}</span>
                </div>
            </div>
            <div class="transaction-right">
                <span class="amount-web">${formatearMoneda(t.monto)}</span>
                <span class="status-badge ${estadoClass}">${t.estado}</span>
            </div>
        </div>
      `
    })
    .join("")
}

async function cargarEstadoCuenta() {
  try {
    const fechaInicio = document.getElementById("filtro-fecha-inicio")?.value || ""
    const fechaFin = document.getElementById("filtro-fecha-fin")?.value || ""
    const estado = document.getElementById("filtro-estado")?.value || "todos"

    const params = new URLSearchParams()
    if (fechaInicio) params.append("fechaInicio", fechaInicio)
    if (fechaFin) params.append("fechaFin", fechaFin)
    if (estado) params.append("estado", estado)

    const response = await fetch(`${API_URL}/estado-cuenta?${params}`)
    const data = await response.json()

    if (data.success) {
      // Actualizar resumen
      document.getElementById("ec-total-pagado").textContent = formatearMoneda(data.data.resumen.totalPagado)
      document.getElementById("ec-total-pendiente").textContent = formatearMoneda(data.data.resumen.totalPendiente)
      document.getElementById("ec-total-rechazado").textContent = formatearMoneda(data.data.resumen.totalRechazado)
      document.getElementById("ec-deuda-total").textContent = formatearMoneda(data.data.resumen.deudaTotal)

      // Renderizar tabla
      renderizarEstadoCuenta(data.data.transacciones)
    }
  } catch (error) {
    console.error("Error al cargar estado de cuenta:", error)
    mostrarToast("Error al cargar estado de cuenta", "error")
  }
}

// Renderizar tabla de estado de cuenta
function renderizarEstadoCuenta(lista) {
  const tbody = document.getElementById("estado-cuenta-body")

  if (!lista || lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading">No hay transacciones</td></tr>'
    return
  }

  tbody.innerHTML = lista
    .map((t) => {
      const estadoClass = t.estado.toLowerCase()
      const acciones =
        t.estado === "Pendiente"
          ? `<button class="btn-accion aprobar" onclick="cambiarEstado(${t.id}, 'Aprobado')" title="Aprobar">
             <i class="fas fa-check"></i>
           </button>
           <button class="btn-accion rechazar" onclick="cambiarEstado(${t.id}, 'Rechazado')" title="Rechazar">
             <i class="fas fa-times"></i>
           </button>`
          : t.estado === "Aprobado"
            ? `<button class="btn-accion recibo" onclick="verRecibo(${t.id})" title="Ver Recibo">
             <i class="fas fa-receipt"></i>
           </button>`
            : "-"

      return `
        <tr>
            <td><strong>${t.numero_operacion}</strong></td>
            <td>${formatearFecha(t.fecha)}</td>
            <td>${t.concepto}</td>
            <td>${t.metodo_pago || "-"}</td>
            <td class="text-right"><strong>${formatearMoneda(t.monto)}</strong></td>
            <td><span class="status-badge ${estadoClass}">${t.estado}</span></td>
            <td>${acciones}</td>
        </tr>
      `
    })
    .join("")
}

// Cargar todas las transacciones
async function cargarTransacciones(filtro = "todos") {
  try {
    const response = await fetch(`${API_URL}/transacciones?filtro=${filtro}`)
    const data = await response.json()

    if (data.success) {
      transacciones = data.data
      renderizarTablaTransacciones(transacciones)
    }
  } catch (error) {
    console.error("Error al cargar transacciones:", error)
    mostrarToast("Error al cargar transacciones", "error")
  }
}

// Renderizar tabla de transacciones
function renderizarTablaTransacciones(lista) {
  const tbody = document.getElementById("transactions-table-body")

  if (!lista || lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">No hay transacciones</td></tr>'
    return
  }

  tbody.innerHTML = lista
    .map((t) => {
      const estadoClass = t.estado.toLowerCase()
      const accionRecibo =
        t.estado === "Aprobado"
          ? `<button class="btn-accion recibo" onclick="verRecibo(${t.id})" title="Ver Recibo">
             <i class="fas fa-receipt"></i>
           </button>`
          : "-"

      return `
        <tr>
            <td><strong>${t.numero_operacion}</strong></td>
            <td>${formatearFecha(t.fecha)}</td>
            <td>${t.concepto}</td>
            <td class="text-right"><strong>${formatearMoneda(t.monto)}</strong></td>
            <td><span class="status-badge ${estadoClass}">${t.estado}</span></td>
            <td>${accionRecibo}</td>
        </tr>
      `
    })
    .join("")
}

// Cargar métodos para el select del formulario
async function cargarMetodosParaSelect() {
  try {
    const response = await fetch(`${API_URL}/metodos-pago`)
    const data = await response.json()

    const select = document.getElementById("metodo")

    if (data.success && data.data.length > 0) {
      select.innerHTML =
        '<option value="">Seleccione un método...</option>' +
        data.data.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("")
    } else {
      select.innerHTML = '<option value="">No hay métodos disponibles</option>'
    }
  } catch (error) {
    console.error("Error al cargar métodos:", error)
  }
}

// Inicializar formularios
function inicializarFormularios() {
  // Formulario de pago
  const paymentForm = document.getElementById("payment-form")
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      await registrarPago(new FormData(paymentForm))
    })
  }

  // Búsqueda de transacciones
  const searchInput = document.getElementById("search-transactions")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      const filtradas = transacciones.filter(
        (t) =>
          t.numero_operacion.toLowerCase().includes(query) ||
          t.concepto.toLowerCase().includes(query) ||
          t.monto.toString().includes(query),
      )
      renderizarTablaTransacciones(filtradas)
    })
  }
}

async function registrarPago(formData) {
  const btn = document.getElementById("btn-confirmar")
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'

  try {
    const datos = {
      concepto: formData.get("concepto"),
      monto: Number.parseFloat(formData.get("monto")),
      fecha: formData.get("fecha"),
      metodo_pago_id: Number.parseInt(formData.get("metodo_pago_id")),
    }

    // Validación cliente: monto mayor a cero
    if (datos.monto <= 0) {
      mostrarToast("El monto debe ser mayor a cero", "error")
      return
    }

    // Validación cliente: fecha no futura
    const fechaPago = new Date(datos.fecha)
    const hoy = new Date()
    hoy.setHours(23, 59, 59, 999)
    if (fechaPago > hoy) {
      mostrarToast("No se permiten fechas futuras", "error")
      return
    }

    const response = await fetch(`${API_URL}/transacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })

    const data = await response.json()

    if (data.success) {
      mostrarToast(`Pago registrado. N° Operación: ${data.data.numeroOperacion}`, "success")
      document.getElementById("payment-form").reset()
      setFechaActual()
      showScreen("estado-cuenta-screen")
    } else {
      mostrarToast(data.message || "Error al registrar pago", "error")
    }
  } catch (error) {
    console.error("Error al registrar pago:", error)
    mostrarToast("Error de conexión", "error")
  } finally {
    btn.disabled = false
    btn.innerHTML = '<i class="fas fa-check"></i> Confirmar Pago'
  }
}

async function cambiarEstado(id, nuevoEstado) {
  if (!confirm(`¿Está seguro de ${nuevoEstado === "Aprobado" ? "aprobar" : "rechazar"} esta transacción?`)) {
    return
  }

  try {
    const response = await fetch(`${API_URL}/transacciones/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    })

    const data = await response.json()

    if (data.success) {
      mostrarToast(`Transacción ${nuevoEstado.toLowerCase()}`, "success")
      cargarEstadoCuenta()
      cargarDashboard()
    } else {
      mostrarToast(data.message || "Error al actualizar estado", "error")
    }
  } catch (error) {
    console.error("Error al cambiar estado:", error)
    mostrarToast("Error de conexión", "error")
  }
}

async function verRecibo(id) {
  try {
    const response = await fetch(`${API_URL}/transacciones/${id}/recibo`)
    const data = await response.json()

    if (data.success) {
      mostrarModalRecibo(data.data)
    } else {
      mostrarToast(data.message || "Error al generar recibo", "error")
    }
  } catch (error) {
    console.error("Error al obtener recibo:", error)
    mostrarToast("Error de conexión", "error")
  }
}

function mostrarModalRecibo(recibo) {
  const container = document.getElementById("recibo-container")

  container.innerHTML = `
    <div class="recibo-header">
      <h2><i class="fas fa-chart-pie"></i> ${recibo.empresa}</h2>
      <p>Recibo de Pago Electrónico</p>
    </div>
    
    <div class="recibo-info">
      <div class="recibo-info-item">
        <span class="label">N° de Operación</span>
        <span class="value">${recibo.numero_operacion}</span>
      </div>
      <div class="recibo-info-item">
        <span class="label">Fecha de Pago</span>
        <span class="value">${formatearFecha(recibo.fecha)}</span>
      </div>
      <div class="recibo-info-item">
        <span class="label">Método de Pago</span>
        <span class="value">${recibo.metodo_pago}</span>
      </div>
      <div class="recibo-info-item">
        <span class="label">Estado</span>
        <span class="value" style="color: var(--positive-color);">${recibo.estado}</span>
      </div>
    </div>
    
    <div class="recibo-info-item" style="margin-bottom: 15px;">
      <span class="label">Concepto</span>
      <span class="value">${recibo.concepto}</span>
    </div>
    
    <div class="recibo-monto">
      <span class="label">MONTO PAGADO</span>
      <span class="valor">${formatearMoneda(recibo.monto)}</span>
    </div>
    
    <div class="recibo-info">
      <div class="recibo-info-item">
        <span class="label">Pagado por</span>
        <span class="value">${recibo.usuario_nombre}</span>
      </div>
      <div class="recibo-info-item">
        <span class="label">Fecha de Emisión</span>
        <span class="value">${formatearFechaHora(recibo.fechaEmision)}</span>
      </div>
    </div>
    
    <div class="recibo-footer">
      <p>Este es un comprobante electrónico válido.</p>
      <p>Conserve este documento para futuras referencias.</p>
    </div>
  `

  document.getElementById("modal-recibo").classList.add("active")
}

function cerrarModalRecibo() {
  document.getElementById("modal-recibo").classList.remove("active")
}

// Imprimir recibo
function imprimirRecibo() {
  const contenido = document.getElementById("recibo-container").innerHTML
  const ventana = window.open("", "_blank")
  ventana.document.write(`
    <html>
    <head>
      <title>Recibo de Pago</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .recibo-header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
        .recibo-header h2 { color: #007bff; }
        .recibo-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .recibo-info-item .label { font-size: 12px; color: #666; display: block; }
        .recibo-info-item .value { font-weight: bold; }
        .recibo-monto { text-align: center; background: #f0f0f0; padding: 20px; margin: 20px 0; }
        .recibo-monto .valor { font-size: 28px; font-weight: bold; color: #28a745; }
        .recibo-footer { text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>${contenido}</body>
    </html>
  `)
  ventana.document.close()
  ventana.print()
}

// Inicializar filtros de transacciones
function inicializarFiltros() {
  document.querySelectorAll(".filter-tabs-web .tab-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-tabs-web .tab-button").forEach((b) => b.classList.remove("active"))
      e.target.classList.add("active")

      const filtro = e.target.getAttribute("data-filter")
      cargarTransacciones(filtro)
    })
  })
}

// Cerrar modal al hacer clic fuera
document.getElementById("modal-recibo")?.addEventListener("click", (e) => {
  if (e.target.id === "modal-recibo") {
    cerrarModalRecibo()
  }
})

// Utilidades
function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor)
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatearFechaHora(fecha) {
  return new Date(fecha).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function mostrarToast(mensaje, tipo = "info") {
  const toast = document.getElementById("toast")
  toast.textContent = mensaje
  toast.className = `toast ${tipo} show`

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}
