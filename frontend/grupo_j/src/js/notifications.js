// Sistema de notificaciones personalizado
let notificationContainer = null

function createNotificationContainer() {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div')
    notificationContainer.id = 'notification-container'
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `
    document.body.appendChild(notificationContainer)
  }
  return notificationContainer
}

export function showNotification(message, type = 'info', duration = 3000) {
  const container = createNotificationContainer()
  
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  
  const colors = {
    success: { bg: '#10b981', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    warning: { bg: '#f59e0b', icon: '⚠' },
    info: { bg: '#3b82f6', icon: 'ℹ' }
  }
  
  const config = colors[type] || colors.info
  
  notification.style.cssText = `
    background: ${config.bg};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    font-size: 14px;
    font-weight: 500;
    min-width: 300px;
  `
  
  notification.innerHTML = `
    <span style="font-size: 20px; font-weight: bold;">${config.icon}</span>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; margin: 0; line-height: 1;">×</button>
  `
  
  container.appendChild(notification)
  
  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => notification.remove(), 300)
    }, duration)
  }
  
  return notification
}

export function showConfirm(message, onConfirm, onCancel) {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    animation: fadeIn 0.2s ease-out;
  `
  
  const modal = document.createElement('div')
  modal.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 400px;
    animation: scaleIn 0.2s ease-out;
  `
  
  modal.innerHTML = `
    <div style="margin-bottom: 20px; font-size: 16px; color: #374151; line-height: 1.5;">${message}</div>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn-cancel-confirm" style="
        padding: 10px 20px;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
      ">Cancelar</button>
      <button class="btn-confirm" style="
        padding: 10px 20px;
        border: none;
        background: #2563eb;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
      ">Confirmar</button>
    </div>
  `
  
  overlay.appendChild(modal)
  document.body.appendChild(overlay)
  
  modal.querySelector('.btn-confirm').addEventListener('click', () => {
    overlay.remove()
    if (onConfirm) onConfirm()
  })
  
  modal.querySelector('.btn-cancel-confirm').addEventListener('click', () => {
    overlay.remove()
    if (onCancel) onCancel()
  })
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove()
      if (onCancel) onCancel()
    }
  })
}

// Agregar estilos de animación al head
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .btn-confirm:hover {
      background: #1d4ed8 !important;
    }
    
    .btn-cancel-confirm:hover {
      background: #f3f4f6 !important;
    }
  `
  document.head.appendChild(style)
}
