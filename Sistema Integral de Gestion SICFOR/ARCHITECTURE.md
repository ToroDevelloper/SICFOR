# 🏗️ Arquitectura del Proyecto

## Flujo de la aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                      HTML (index.html)                       │
│                      <div id="root">                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      main.js (Entrada)                       │
│              import { initApp } from './js/app.js'           │
│              document.addEventListener('DOMContentLoaded')  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   app.js (Orquestador)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ initApp() - Inicializa la aplicación                │  │
│  │ navigate(page, params) - Cambia de página           │  │
│  │ render() - Renderiza la vista actual                │  │
│  │ attachEventListeners() - Adjunta listeners          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌─────────────────────┐   ┌──────────────────┐
        │ ticketStore.js      │   │ views.js         │
        │ (Estado Global)     │   │ (HTML Templates) │
        │                     │   │                  │
        │ ┌─────────────────┐ │   │ renderLayout()   │
        │ │ tickets[]       │ │   │ renderDashboard()│
        │ │ currentUser     │ │   │ renderCrearTicket
        │ │ listeners       │ │   │ renderVerTicket()│
        │ │                 │ │   │                  │
        │ │ Methods:        │ │   │ getPrioridadClase
        │ │ - crearTicket() │ │   │ getEstadoClase() │
        │ │ - obtenerTicket │ │   │ formatearFecha() │
        │ │ - actualizarTicket│  │                  │
        │ │ - agregarRespuesta
        │ │ - cerrarTicket()│ │   │                  │
        │ │ - subscribe()   │ │   │                  │
        │ └─────────────────┘ │   └──────────────────┘
        └─────────────────────┘
                    ▲
                    │ (Lectura/Escritura)
                    │
            ┌───────▼─────────┐
            │  localStorage   │
            │  'sicfor-tickets'
            └─────────────────┘
```

## Componentes principales

### 1. `ticketStore.js` - Gestión de Estado
```
┌─ TicketStore (Clase)
│  ├─ Propiedades
│  │  ├─ tickets: Array de tickets
│  │  ├─ currentUser: Usuario actual
│  │  └─ listeners: Array de observers
│  │
│  └─ Métodos (CRUD + más)
│     ├─ crearTicket(data)
│     ├─ obtenerTicket(id)
│     ├─ actualizarTicket(id, cambios)
│     ├─ eliminarTicket(id)
│     ├─ agregarRespuesta(ticketId, mensaje, esAgente)
│     ├─ cerrarTicket(ticketId)
│     ├─ obtenerTicketsPorEstado(estado)
│     ├─ loadTickets()
│     ├─ saveTickets()
│     ├─ subscribe(listener)
│     └─ notifyListeners()
```

### 2. `views.js` - Generación de HTML
```
┌─ Funciones de Utilidad
│  ├─ getPrioridadClase(prioridad)
│  ├─ getEstadoClase(estado)
│  ├─ formatearFecha(fecha)
│  └─ formatearFechaHora(fecha)
│
├─ renderLayout(content)
│  └─ Retorna: HTML con header, main, footer
│
├─ renderDashboard()
│  ├─ Botón crear ticket
│  ├─ Tabs de filtros
│  └─ Tabla de tickets
│
├─ renderCrearTicket()
│  ├─ Información de usuario
│  ├─ Form con campos: asunto, categoría, prioridad, descripción
│  └─ Botones: Guardar, Cancelar
│
└─ renderVerTicket(ticketId)
   ├─ Información del ticket
   ├─ Botones de acción
   ├─ Historial de respuestas
   └─ Formulario para agregar respuesta
```

### 3. `app.js` - Orquestación
```
┌─ Variables Globales
│  ├─ currentPage: Página actual
│  └─ currentTicketId: ID del ticket siendo visto
│
├─ initApp()
│  └─ Punto de entrada de la app
│
├─ navigate(page, params)
│  ├─ Actualiza currentPage
│  └─ Llama render()
│
├─ render()
│  ├─ Genera HTML según currentPage
│  ├─ Actualiza el DOM
│  └─ Llama attachEventListeners()
│
├─ attachEventListeners()
│  ├─ Adjunta listeners globales
│  └─ Adjunta listeners específicos por página
│
├─ handleAction(e)
│  └─ Manejador centralizado de acciones
│
├─ handleEliminar(id)
├─ handleCrearTicket(e)
├─ handleCerrarTicket(id)
└─ handleEnviarRespuesta(esAgente)
```

## Flujos principales

### Crear Ticket
```
Usuario hace click
    ↓
handleAction('crear')
    ↓
navigate('crear-ticket')
    ↓
render() genera formulario
    ↓
Usuario completa el form
    ↓
handleCrearTicket(e) validación
    ↓
ticketStore.crearTicket(data)
    ↓
ticketStore.saveTickets() a localStorage
    ↓
navigate('dashboard') y render()
    ↓
Tabla actualizada con nuevo ticket
```

### Ver Ticket
```
Usuario hace click en ticket
    ↓
handleAction('ver', {id})
    ↓
navigate('ver-ticket', {id})
    ↓
render() llama renderVerTicket(id)
    ↓
Se genera HTML con datos del ticket
    ↓
Mostrar información + historial + formulario respuesta
```

### Agregar Respuesta
```
Usuario escribe respuesta
    ↓
Click en "Responder como Usuario/Soporte"
    ↓
handleEnviarRespuesta(esAgente)
    ↓
ticketStore.agregarRespuesta(ticketId, mensaje, esAgente)
    ↓
Actualiza estado del ticket a 'En proceso' (si estaba 'Abierto')
    ↓
ticketStore.saveTickets()
    ↓
render() actualiza la vista
    ↓
Nueva respuesta visible en historial
```

## Event Delegation Pattern

```
┌─ Document (raíz)
│  └─ click event listener global
│     │
│     ├─ Si target.dataset.action === 'crear'
│     │  └─ handleAction → navigate('crear-ticket')
│     │
│     ├─ Si target.dataset.action === 'ver'
│     │  └─ handleAction → navigate('ver-ticket', {id})
│     │
│     ├─ Si target.dataset.filter === 'Abiertos'/'Cerrados'
│     │  └─ Filtra y re-renderiza tabla
│     │
│     └─ ...más acciones
```

## Ciclo de vida

```
1. INIT
   ├─ main.js carga
   ├─ Event DOMContentLoaded
   └─ initApp() se ejecuta

2. SETUP
   ├─ ticketStore se instancia
   ├─ Carga datos de localStorage
   └─ currentPage = 'dashboard'

3. RENDER
   ├─ render() se ejecuta
   ├─ renderDashboard() genera HTML
   ├─ renderLayout(content) lo envuelve
   └─ root.innerHTML = HTML

4. ATTACH
   ├─ attachEventListeners()
   ├─ Se adjuntan listeners globales
   └─ Se adjuntan listeners específicos

5. LISTEN
   ├─ Usuario interactúa
   ├─ Event dispara
   └─ Handler ejecuta

6. UPDATE (si es necesario)
   ├─ ticketStore se actualiza
   ├─ saveTickets() → localStorage
   └─ Vuelve a paso 3 (RENDER)
```

## Responsabilidades por archivo

| Archivo | Responsabilidad |
|---------|-----------------|
| `main.js` | Inicializar la aplicación |
| `app.js` | Gestionar navegación y eventos |
| `ticketStore.js` | Gestionar estado y datos |
| `views.js` | Generar HTML para cada vista |
| `App.css` | Todos los estilos visuales |
| `index.css` | Estilos globales base |

## Ventajas de esta arquitectura

✅ **Separación de responsabilidades**: Lógica, datos, vista
✅ **Fácil de mantener**: Código predecible y organizado
✅ **Sin dependencias externas**: Solo Vite
✅ **Rendimiento**: Menos código, recargas rápidas
✅ **Escalable**: Patrón que crece bien
✅ **Debuggable**: Estado centralizado en ticketStore

---

**Diagrama actualizado: Nov 29, 2025**
