/* File: certificaciones.js
   Módulo ES6 (usado por index.html y certificados.html)
   - Gestión de certificados en localStorage
   - Dibuja el certificado en <canvas> (permite descarga PNG sin dependencias externas)
   - APIs: generar, guardar, listar, buscar, exportar JSON, eliminar
*/

const STORAGE_KEY = 'sicfor:certificates:v1'
const LOGO_KEY = 'sicfor:brandlogo:v1'
let currentLogoImg = null

/** Utilities */
const uid = (len = 10) => Math.random().toString(36).slice(2, 2 + len)
const nowISO = () => new Date().toISOString()
const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString()
}

/** Certificate model factory */
function makeCertificate({ name, title, issuer, date, note }) {
  const id = uid(12)
  const verificationCode = uid(16).toUpperCase()
  return {
    id,
    verificationCode,
    name,
    title,
    issuer,
    date,
    note,
    createdAt: nowISO(),
  }
}

/** Storage helpers */
const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '[]'
      return JSON.parse(raw)
    } catch (e) {
      console.error('Storage read error', e)
      return []
    }
  },
  save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (e) {
      console.error('Storage write error', e)
    }
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/** Canvas renderer for certificate (1200 x 675 px) */
function drawCertificateToCanvas(cert, canvas) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width = 2400
  const H = canvas.height = 1350

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  drawCornerDecorations(ctx, W, H)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#0b1220'
  ctx.font = '108px Inter, Arial'
  ctx.fillText('CERTIFICADO', W/2, 260)

  ctx.font = '56px Inter, Arial'
  ctx.fillStyle = '#1f3d8b'
  ctx.fillText('DE RECONOCIMIENTO', W/2, 330)

  ctx.font = '28px Inter, Arial'
  ctx.fillStyle = '#475569'
  ctx.fillText('OTORGADO A:', W/2, 410)

  ctx.fillStyle = '#0b1220'
  ctx.font = '150px Great Vibes, cursive'
  ctx.fillText(String(cert.name || 'Beneficiario'), W/2, 540)

  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(360, 560)
  ctx.lineTo(W - 360, 560)
  ctx.stroke()

  ctx.fillStyle = '#0b1220'
  ctx.font = '30px Inter, Arial'
  wrapText(ctx, cert.note || 'Por haber completado satisfactoriamente la formación.', 300, 620, W - 600, 40)

  ctx.font = '64px Playfair Display, serif'
  ctx.fillStyle = '#0b1220'
  ctx.fillText(String(cert.title || 'CERTIFICADO').toUpperCase(), W/2, 740)

  drawSignatureLines(ctx, 320, 1020, 420, 'LIC. MAXIMILIANO FIRTMAN')
  drawSignatureLines(ctx, W - 740, 1020, 420, 'LIC. CARLA RODRÍGUEZ')

  if (currentLogoImg) {
    const maxW = 260
    const maxH = 180
    const ratio = Math.min(maxW / currentLogoImg.width, maxH / currentLogoImg.height)
    const w = Math.floor(currentLogoImg.width * ratio)
    const h = Math.floor(currentLogoImg.height * ratio)
    ctx.drawImage(currentLogoImg, W - 420, 220, w, h)
  } else {
    drawSeal(ctx, W - 420, 240, 180, 'SICFOR')
  }

  ctx.textAlign = 'left'
  ctx.fillStyle = '#475569'
  ctx.font = '24px Inter, Arial'
  ctx.fillText(`Fecha: ${formatDate(cert.date)}`, 320, H - 200)

  ctx.textAlign = 'right'
  ctx.fillText(`Código: ${cert.verificationCode}`, W - 320, H - 200)

  const url = buildVerificationURL(cert.verificationCode)
  drawQRToCanvas(url, ctx, W - 360, H - 520, 220)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#475569'
  ctx.font = '20px Inter, Arial'
  ctx.fillText('Verificación en línea', W - 320, H - 270)
}

/** Small helper: draw a mock QR (visual element only) */
function drawQRToCanvas(text, ctx, x, y, size) {
  const q = qrcode(0, 'M')
  q.addData(String(text))
  q.make()
  const count = q.getModuleCount()
  const scale = Math.floor(size / count)
  const pad = Math.floor((size - count * scale) / 2)
  ctx.save()
  ctx.fillStyle = '#fff'
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = '#0b1220'
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (q.isDark(r, c)) {
        ctx.fillRect(x + pad + c * scale, y + pad + r * scale, scale, scale)
      }
    }
  }
  ctx.restore()
}

function buildVerificationURL(code) {
  try {
    if (window.location.protocol === 'file:') {
      return String(code).toUpperCase()
    }
    const base = new URL('certificados.html', window.location.href)
    base.searchParams.set('code', String(code).toUpperCase())
    return base.toString()
  } catch {
    return `certificados.html?code=${String(code).toUpperCase()}`
  }
}

/** Text wrapping helper for canvas */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  ctx.textAlign = 'center'
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x + maxWidth / 2, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line.trim(), x + maxWidth / 2, y)
}

function drawSignatureLines(ctx, x, y, w, label){
  ctx.save()
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.stroke()
  ctx.fillStyle = '#475569'
  ctx.font = '18px Inter, Arial'
  ctx.textAlign = 'center'
  ctx.fillText(label, x + w/2, y + 28)
  ctx.restore()
}

function drawSeal(ctx, x, y, size, text){
  const r = size/2
  ctx.save()
  ctx.translate(x + r, y + r)
  ctx.fillStyle = '#0ea5a4'
  ctx.beginPath()
  ctx.arc(0,0,r,0,Math.PI*2)
  ctx.fill()
  ctx.strokeStyle = '#0b8f8e'
  ctx.lineWidth = 6
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 42px Inter, Arial'
  ctx.textAlign = 'center'
  ctx.fillText(text, 0, 14)
  ctx.restore()
}

function drawCornerDecorations(ctx, W, H){
  ctx.save()
  ctx.fillStyle = '#0b5f86'
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(0,220)
  ctx.lineTo(360,0)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#8cc63f'
  ctx.beginPath()
  ctx.moveTo(80,0)
  ctx.lineTo(0,160)
  ctx.lineTo(260,0)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#0b5f86'
  ctx.beginPath()
  ctx.moveTo(W, H)
  ctx.lineTo(W, H-220)
  ctx.lineTo(W-360, H)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#8cc63f'
  ctx.beginPath()
  ctx.moveTo(W-80, H)
  ctx.lineTo(W, H-160)
  ctx.lineTo(W-260, H)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function getVerifyBaseURL(){
  try{
    const u = new URL('certificados.html', window.location.href)
    return u.origin + u.pathname
  }catch{
    return 'certificados.html'
  }
}

function getAcronym(text){
  const m = String(text||'').match(/[A-Za-zÁÉÍÓÚÜÑ]/g)
  if(!m) return 'CERTIFICADO'
  return m.join('').slice(0,6).toUpperCase()
}

function extractHours(note){
  const m = String(note||'').match(/(\d{1,4})\s*horas?/i)
  return m ? m[1] : null
}

/** Download canvas as PNG */
function downloadCanvasAsPNG(canvas, filename = 'certificado.png') {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, 'image/png', 1)
}

/** Page module logic */
class CertificateModule {
  constructor() {
    this.certList = storage.load()
    this._initPages()
  }

  _initPages() {
    // Index page elements
    this.form = document.getElementById('form-generate')
    this.inputName = document.getElementById('input-name')
    this.inputTitle = document.getElementById('input-title')
    this.inputIssuer = document.getElementById('input-issuer')
    this.inputDate = document.getElementById('input-date')
    this.inputNote = document.getElementById('input-note')
    this.inputLogo = document.getElementById('input-logo')
    this.btnPreview = document.getElementById('btn-preview')
    this.btnClear = document.getElementById('btn-clear')
    this.canvas = document.getElementById('certificate-canvas')
    this.btnDownload = document.getElementById('btn-download')
  this.btnCopyJSON = document.getElementById('btn-copy-json')
  this.btnCopyLink = document.getElementById('btn-copy-link')
    this.msg = document.getElementById('msg')

  // History page elements (if present)
  this.historyList = document.getElementById('history-list')
  this.searchCode = document.getElementById('search-code')
  this.btnSearch = document.getElementById('btn-search')
  this.btnClearSearch = document.getElementById('btn-clear-search')
  this.searchResult = document.getElementById('search-result')
  this.btnExportJson = document.getElementById('btn-export-json')
  this.btnImportJson = document.getElementById('btn-import-json')
  this.btnClearHistory = document.getElementById('btn-clear-history')
  this.fileImport = document.getElementById('file-import')

    // Attach handlers where relevant
    if (this.form) this._attachIndexHandlers()
    if (this.historyList) this._attachHistoryHandlers()

    // initial render
    if (this.canvas) this._renderEmptyCanvas()
    if (this.historyList) this._renderHistory()
    if (this.searchCode) {
      const p = new URLSearchParams(window.location.search)
      const q = (p.get('code') || '').trim().toUpperCase()
      if (q) {
        this.searchCode.value = q
        this.btnSearch?.click()
      }
    }
    const savedLogo = localStorage.getItem(LOGO_KEY)
    if (savedLogo) {
      const img = new Image()
      img.onload = () => { currentLogoImg = img }
      img.src = savedLogo
    }
  }

  _attachIndexHandlers() {
    // default date to today
    if (this.inputDate && !this.inputDate.value) {
      this.inputDate.value = new Date().toISOString().slice(0, 10)
    }

    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this._handleGenerateAndSave()
    })

    this.btnPreview?.addEventListener('click', () => {
      this._renderPreviewFromForm()
    })

    this.btnClear?.addEventListener('click', () => {
      this.form.reset()
      this._renderEmptyCanvas()
      this._setMessage('Formulario limpiado', 'info')
      if (this.btnDownload) this.btnDownload.disabled = true
      if (this.btnCopyJSON) this.btnCopyJSON.disabled = true
      if (this.btnCopyLink) this.btnCopyLink.disabled = true
    })

    this.btnDownload?.addEventListener('click', () => {
      if (!this.currentPreview) return
      const filename = `certificado_${this.currentPreview.id}.png`
      downloadCanvasAsPNG(this.canvas, filename)
    })

    this.btnCopyJSON?.addEventListener('click', () => {
      if (!this.currentPreview) return
      navigator.clipboard?.writeText(JSON.stringify(this.currentPreview, null, 2))
        .then(() => this._setMessage('JSON copiado al portapapeles', 'info'))
        .catch(() => this._setMessage('No se pudo copiar JSON', 'error'))
    })

    this.btnCopyLink?.addEventListener('click', () => {
      if (!this.currentPreview) return
      const url = buildVerificationURL(this.currentPreview.verificationCode)
      navigator.clipboard?.writeText(url)
        .then(() => this._setMessage('Enlace copiado al portapapeles', 'info'))
        .catch(() => this._setMessage('No se pudo copiar el enlace', 'error'))
    })

    this.inputLogo?.addEventListener('change', (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        try { localStorage.setItem(LOGO_KEY, dataUrl) } catch {}
        const img = new Image()
        img.onload = () => {
          currentLogoImg = img
          if (this.currentPreview && this.canvas) drawCertificateToCanvas(this.currentPreview, this.canvas)
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    })
  }

  _attachHistoryHandlers() {
    this.btnSearch?.addEventListener('click', () => {
      const q = (this.searchCode.value || '').trim().toUpperCase()
      if (!q) { this.searchResult.textContent = 'Ingrese un código.'; return }
      const found = this.certList.find(c => c.verificationCode === q)
      if (found) {
        this.searchResult.textContent = `Certificado válido — ${found.name} · ${found.title} · emitido: ${formatDate(found.date)}`
        this.searchResult.classList.remove('muted')
      } else {
        this.searchResult.textContent = 'No se encontró el código.'
        this.searchResult.classList.add('muted')
      }
    })

    this.btnClearSearch?.addEventListener('click', () => {
      this.searchCode.value = ''
      this.searchResult.textContent = ''
    })

    this.btnExportJson?.addEventListener('click', () => {
      const dataStr = JSON.stringify(this.certList, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificados_sicfor_${new Date().toISOString().slice(0,10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    })

    this.btnImportJson?.addEventListener('click', () => {
      this.fileImport?.click()
    })

    this.fileImport?.addEventListener('change', (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const raw = reader.result
          const data = JSON.parse(raw)
          const arr = Array.isArray(data) ? data : (data?.certificates ?? [])
          if (!Array.isArray(arr)) { this._setMessage('JSON inválido: se esperaba un arreglo', 'error'); return }
          const normalized = arr.map(normalizeImportedCert).filter(Boolean)
          if (normalized.length === 0) { this._setMessage('No se encontraron certificados válidos en el JSON', 'error'); return }
          const existingIds = new Set(this.certList.map(c => c.id))
          const merged = [...normalized.filter(c => !existingIds.has(c.id)), ...this.certList]
          this.certList = merged
          storage.save(this.certList)
          this._renderHistory()
          this._setMessage('Importación de certificados completada', 'info')
          this.fileImport.value = ''
        } catch (err) {
          this._setMessage('Error al leer el archivo JSON', 'error')
        }
      }
      reader.readAsText(file, 'utf-8')
    })

    this.btnClearHistory?.addEventListener('click', () => {
      if (!confirm('¿Eliminar todo el historial de certificados? Esta acción es irreversible.')) return
      this.certList = []
      storage.clear()
      this._renderHistory()
      this._setMessage('Historial eliminado', 'info')
    })
  }

  _setMessage(text, type = 'info') {
    if (!this.msg) return
    this.msg.textContent = text
    this.msg.setAttribute('aria-hidden', 'false')
    this.msg.style.display = 'block'
    if (type === 'error') this.msg.style.background = '#fff1f2'
    else this.msg.style.background = '#f8fafc'
    setTimeout(() => {
      this.msg.style.display = 'none'
    }, 3000)
  }

  _renderEmptyCanvas() {
    if (!this.canvas) return
    const ctx = this.canvas.getContext('2d')
    const W = this.canvas.width = 1200
    const H = this.canvas.height = 675
    ctx.fillStyle = '#f7f8fc'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '20px Inter, Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Previsualización del certificado', W / 2, H / 2)
  }

  _renderPreviewFromForm() {
    if (!this.canvas) return
    const payload = {
      name: this.inputName.value.trim() || 'Nombre del beneficiario',
      title: this.inputTitle.value.trim() || 'Certificado',
      issuer: this.inputIssuer.value.trim() || 'Centro',
      date: this.inputDate.value || new Date().toISOString().slice(0,10),
      note: this.inputNote.value.trim() || ''
    }
    const temp = { ...makeCertificate(payload) }
    // Do not add to storage yet — this is a preview
    this.currentPreview = temp
    drawCertificateToCanvas(temp, this.canvas)
    if (this.btnDownload) this.btnDownload.disabled = false
    if (this.btnCopyJSON) this.btnCopyJSON.disabled = false
    if (this.btnCopyLink) this.btnCopyLink.disabled = false
    this._setMessage('Vista previa actualizada', 'info')
  }

  _handleGenerateAndSave() {
    const payload = {
      name: this.inputName.value.trim(),
      title: this.inputTitle.value.trim(),
      issuer: this.inputIssuer.value.trim(),
      date: this.inputDate.value || new Date().toISOString().slice(0,10),
      note: this.inputNote.value.trim()
    }
    if (!payload.name) { alert('El nombre del beneficiario es obligatorio'); return }
    const cert = makeCertificate(payload)
    // Save to storage
    this.certList.unshift(cert)
    storage.save(this.certList)
    this._setMessage('Certificado generado y guardado en historial', 'info')
    // Render preview and enable download
    this.currentPreview = cert
    if (this.canvas) drawCertificateToCanvas(cert, this.canvas)
    if (this.btnDownload) this.btnDownload.disabled = false
    if (this.btnCopyJSON) this.btnCopyJSON.disabled = false
    if (this.btnCopyLink) this.btnCopyLink.disabled = false
    // If on history page, update list (if present)
    this._renderHistory()
    // Keep form values but let user know
  }

  _renderHistory() {
    if (!this.historyList) return
    this.historyList.innerHTML = ''
    if (!this.certList || this.certList.length === 0) {
      this.historyList.innerHTML = `<div class="small muted">No hay certificados en el historial.</div>`
      return
    }

    for (const cert of this.certList) {
      const item = document.createElement('div')
      item.className = 'history-item'
      item.innerHTML = `
        <div>
          <div style="font-weight:700">${escapeHtml(cert.name)}</div>
          <div class="history-meta">${escapeHtml(cert.title)} · emitido: ${formatDate(cert.date)}</div>
          <div class="history-meta">Código: <strong>${cert.verificationCode}</strong></div>
          <div class="history-meta">Generado: ${new Date(cert.createdAt).toLocaleString()}</div>
        </div>
        <div class="history-actions">
          <button data-id="${cert.id}" class="btn-outline btn-view">Ver</button>
          <button data-id="${cert.id}" class="btn-ghost btn-delete">Eliminar</button>
        </div>
      `
      this.historyList.appendChild(item)
    }

    // Attach listeners for view / delete
    this.historyList.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id')
        const cert = this.certList.find(c => c.id === id)
        if (!cert) return
        // Open a small window with the PNG (download in-memory)
        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width = 1200
        tmpCanvas.height = 675
        drawCertificateToCanvas(cert, tmpCanvas)
        tmpCanvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 30000)
        }, 'image/png', 1)
      })
    })

    this.historyList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id')
        if (!confirm('¿Eliminar este certificado del historial?')) return
        this.certList = this.certList.filter(c => c.id !== id)
        storage.save(this.certList)
        this._renderHistory()
        this._setMessage('Certificado eliminado', 'info')
      })
    })
  }
}

/** Small HTML escape utility */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]))
}

function normalizeImportedCert(item) {
  if (!item || typeof item !== 'object') return null
  const hasModel = item.id && item.verificationCode && item.name && item.title && item.issuer && item.date
  if (hasModel) {
    return {
      id: String(item.id),
      verificationCode: String(item.verificationCode).toUpperCase(),
      name: String(item.name),
      title: String(item.title),
      issuer: String(item.issuer),
      date: String(item.date),
      note: item.note ? String(item.note) : '',
      createdAt: item.createdAt ? String(item.createdAt) : nowISO(),
    }
  }
  const hasMinimal = item.name && item.title && item.issuer && item.date
  if (hasMinimal) {
    return makeCertificate({
      name: String(item.name),
      title: String(item.title),
      issuer: String(item.issuer),
      date: String(item.date),
      note: item.note ? String(item.note) : '',
    })
  }
  return null
}


/** Initialize module when DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  // instantiate module
  window.SICFOR_CertModule = new CertificateModule()
})
