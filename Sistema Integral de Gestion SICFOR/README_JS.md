# Mesa de Ayuda - SICFOR (Versión JavaScript/HTML Puro)

Módulo de Mesa de Ayuda y Soporte - Sistema Integral SICFOR - Grupo J

## 📋 Descripción

Este proyecto ha sido convertido de React a **JavaScript puro y HTML**, manteniéndose totalmente funcional. No requiere dependencias de React o React Router.

### Características principales:
- ✅ Sistema de tickets de soporte
- ✅ Crear, editar y eliminar tickets
- ✅ Historial de respuestas (usuario y agente)
- ✅ Filtrado por estado (Abiertos/Cerrados)
- ✅ Gestión de prioridades y categorías
- ✅ Interfaz responsiva
- ✅ Almacenamiento en localStorage
- ✅ Navegación SPA (Single Page Application)

## 🚀 Instalación y Ejecución

### Requisitos previos:
- Node.js 16+ instalado
- npm o yarn

### Pasos:

1. **Instalar dependencias** (solo Vite):
```bash
npm install
```

2. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

3. **Compilar para producción**:
```bash
npm run build
```

4. **Previsualizar build de producción**:
```bash
npm run preview
```

## 📁 Estructura de archivos

```
src/
├── js/
│   ├── app.js              # Gestor de navegación y eventos
│   ├── ticketStore.js      # Gestión de estado y datos
│   └── views.js            # Renderización de vistas HTML
├── main.js                 # Punto de entrada
├── App.css                 # Estilos consolidados
├── index.css               # Estilos base globales
└── components/             # Archivos CSS originales (ahora vacíos)
    └── Layout/
        └── Layout.css
└── pages/                  # Archivos CSS originales (ahora vacíos)
    ├── Dashboard/
    │   └── Dashboard.css
    ├── CrearTicket/
    │   └── CrearTicket.css
    └── VerTicket/
        └── VerTicket.css

index.html                  # HTML principal
package.json               # Configuración del proyecto
vite.config.js            # Configuración de Vite
```

## 🔧 Cambios realizados

### Conversión de React a JavaScript Puro:

1. **Componentes → Funciones generadoras de HTML**
   - Los componentes React se convirtieron en funciones que retornan strings HTML

2. **Context API → Clase TicketStore**
   - Sistema de estado global basado en una clase con suscriptores

3. **React Router → Enrutador personalizado**
   - Navegación manual sin dependencias externas

4. **Hooks → Event Listeners tradicionales**
   - Manejo de eventos con `addEventListener` y `dataset`

5. **JSX → Template Strings**
   - HTML generado con template literals de JavaScript

### Dependencias eliminadas:
- ❌ react
- ❌ react-dom
- ❌ react-router-dom
- ❌ @vitejs/plugin-react

### Dependencias mantenidas:
- ✅ vite (servidor de desarrollo y bundler)

## 💾 Datos y Almacenamiento

Los tickets se almacenan en **localStorage** del navegador. Los datos persisten entre sesiones.

### Datos iniciales de ejemplo:
- 3 tickets predefinidos para demostración
- Usuario: "Fabian Andres" (fijo)
- Categorías: Técnico, Administrativo, Académico, Software, Hardware
- Prioridades: Baja, Media, Alta, Urgente
- Estados: Abierto, En proceso, Cerrado

## 🎨 Estilos y Temas

El proyecto utiliza un sistema de **CSS variables** para fácil personalización:

```css
:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-danger: #ef4444;
  /* ... más variables */
}
```

Todos los estilos están consolidados en `src/App.css`

## 📱 Responsividad

La aplicación es completamente responsiva y se adapta a:
- Dispositivos de escritorio (1200px+)
- Tablets (768px - 1199px)
- Móviles (<768px)

## 🔐 Notas de seguridad

Este es un proyecto de demostración con datos en memoria/localStorage. Para producción:
- Implementar autenticación real
- Usar backend seguro para persistencia
- Implementar validación de datos
- Usar HTTPS
- Implementar control de acceso (RBAC)

## 📝 Licencia

Grupo J - Sistema Integral SICFOR © 2023

## 🤝 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

---

**Versión JavaScript Puro**: 1.0.0  
**Última actualización**: 2025-11-29
