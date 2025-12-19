import { ticketStore } from '../ticketStore.js'

export function renderLayout(content) {
  const { currentUser } = ticketStore
  return `
    <div class="app">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="header-left">
              <h1 class="header-title">MESA DE AYUDA / SOPORTE</h1>
              <span class="header-subtitle">Sistema SICFOR - Grupo J</span>
            </div>
            <div class="header-right">
              <div class="user-info">
                <img src="${currentUser.foto}" alt="${currentUser.nombre}" class="user-avatar" />
                <div class="user-details">
                  <span class="user-name">${currentUser.nombre}</span>
                  <span class="user-role">Rol: ${currentUser.rol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="main-content">
        <div class="container">${content}</div>
      </main>
      <footer class="footer">
        <div class="container">
          <p class="footer-text">Pie de página - SICFOR © 2023 | Grupo J - Mesa de Ayuda</p>
        </div>
      </footer>
    </div>
  `
}
