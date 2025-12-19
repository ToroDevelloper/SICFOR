# Frontend - Módulo de Asistencia (Grupo G)

## 📋 Descripción del Desarrollo

Este documento describe el desarrollo del frontend para el **Módulo de Asistencia** del sistema SICFOR, desarrollado por el Grupo G.

## ✨ Nuevas Características (v2.0)

### 🎨 Animaciones Suaves
- **fadeIn**: Aparición suave de elementos al cargar
- **slideDown**: Deslizamiento desde arriba para secciones
- **scaleIn**: Escalado suave para cards
- **pulse**: Animación de pulsación para elementos cargando
- Todas las secciones y componentes tienen animaciones de entrada
- Transiciones suaves en todos los hover effects

### 🔍 Buscador de Estudiantes
- Campo de búsqueda en tiempo real sobre la tabla de asistencia
- Filtra estudiantes por nombre mientras escribes
- Animación fadeIn al mostrar resultados
- Diseño integrado con ícono de búsqueda
- Responsive en móviles

### 🌙 Modo Oscuro
- Toggle de tema claro/oscuro en el header
- Persistencia del tema seleccionado en localStorage
- Transiciones suaves al cambiar de tema
- Paleta de colores optimizada para modo oscuro
- Ícono dinámico (🌙/☀️) según el tema activo

### ⏱️ Reloj en Tiempo Real
- Reloj actualizado cada segundo en el header
- Formato 24 horas (HH:MM:SS)
- Sincronizado con la hora del sistema
- Diseño coherente con otros info-items del header

### 📈 Dashboard de Estadísticas
- Panel de control con 4 métricas clave:
  - **Total de Estudiantes**: Cantidad registrada en el sistema
  - **Promedio de Asistencia**: Porcentaje calculado de todas las sesiones
  - **Sesión Actual**: Curso de la sesión activa
  - **Última Actualización**: Hora de la última modificación
- Cards animadas con stagger effect
- Actualización automática al modificar datos
- Diseño con gradientes y sombras profesionales

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS y animaciones
- **JavaScript (Vanilla)**: Lógica de aplicación sin frameworks
- **LocalStorage**: Persistencia de datos y preferencias
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Frontend

```
frontend/grupo_g/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Sistema de diseño y estilos
├── js/
│   └── app.js          # Lógica de la aplicación
└── DESARROLLO.md       # Este archivo
```

## 🎨 Sistema de Diseño

### Paleta de Colores

El diseño utiliza un **tema oscuro moderno** con acentos vibrantes:

```css
--color-bg-primary: #0a0e27      /* Fondo principal */
--color-bg-secondary: #151932    /* Fondo secundario */
--color-bg-tertiary: #1e2442     /* Fondo terciario */

--color-primary: #6366f1         /* Índigo vibrante */
--color-secondary: #8b5cf6       /* Violeta */
--color-success: #10b981         /* Verde */
--color-warning: #f59e0b         /* Ámbar */
--color-danger: #ef4444          /* Rojo */
```

### Efectos Visuales

- **Glassmorphism**: Efectos de vidrio esmerilado con `backdrop-filter: blur()`
- **Gradientes**: Gradientes lineales en botones y encabezados
- **Sombras**: Sistema de sombras con glow effects
- **Animaciones**: Transiciones suaves y micro-animaciones

### Tipografía

- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Escala**: Sistema de tamaños desde xs (0.75rem) hasta 3xl (2rem)

## 📱 Componentes Desarrollados

### 1. Sidebar (Barra Lateral)
- **Ubicación**: `index.html` líneas 11-24
- **Características**:
  - Logo del sistema SICFOR
  - Navegación con íconos
  - Responsive (se oculta en móvil)
  - Efecto hover con desplazamiento

### 2. Header (Encabezado)
- **Ubicación**: `index.html` líneas 28-40
- **Características**:
  - Título con gradiente
  - Perfil de usuario
  - Botón de menú para móvil
  - Sticky positioning

### 3. Session Card (Tarjeta de Sesión)
- **Ubicación**: `index.html` líneas 51-73
- **Características**:
  - Información de la sesión actual
  - Grid responsive
  - Botones de acción (Editar/Eliminar)
  - Efecto hover con elevación

### 4. Attendance Table (Tabla de Asistencia)
- **Ubicación**: `index.html` líneas 77-95
- **Características**:
  - Tabla con foto, nombre, presente, justificación
  - Checkboxes personalizados
  - Selectores de justificación
  - Encabezado con gradiente

### 5. Summary Cards (Tarjetas de Resumen)
- **Ubicación**: `index.html` líneas 97-113
- **Características**:
  - Contadores en tiempo real
  - Presentes, Tarde, Faltas
  - Números con gradiente
  - Grid responsive

### 6. Modal Dialog (Diálogo Modal)
- **Ubicación**: `index.html` líneas 145-182
- **Características**:
  - Formulario para crear/editar sesiones
  - Backdrop con blur
  - Animación de entrada (slide up)
  - Validación HTML5

### 7. History Table (Tabla de Historial)
- **Ubicación**: `index.html` líneas 117-143
- **Características**:
  - Lista de sesiones pasadas
  - Botón "Ver" para cada sesión
  - Formato de fechas localizado

## 💻 Funcionalidades JavaScript

### Gestión de Estado

```javascript
let currentSession = null;        // Sesión actual
let students = [];                // Lista de estudiantes
let attendanceRecords = [];       // Registros de asistencia
let isEditMode = false;           // Modo edición
let editSessionId = null;         // ID de sesión en edición
```

### Funciones Principales

#### Comunicación con API
- `fetchSessions()`: Obtiene todas las sesiones
- `fetchStudents()`: Obtiene estudiantes
- `fetchAttendance(sessionId)`: Obtiene asistencia de sesión
- `saveAttendance(sessionId, data)`: Guarda asistencia
- `createSession(data)`: Crea nueva sesión
- `updateSession(id, data)`: Actualiza sesión
- `deleteSession(id)`: Elimina sesión

#### Renderizado de UI
- `renderCurrentSession(session)`: Muestra sesión actual
- `renderAttendanceTable()`: Genera tabla de asistencia
- `renderSessionHistory(sessions)`: Muestra historial
- `updateSummary()`: Actualiza contadores

#### Manejo de Eventos
- `handleAttendanceChange(event)`: Checkbox de presente/ausente
- `handleJustificationChange(event)`: Selector de justificación
- `handleSaveAttendance()`: Guardar asistencia
- `handleAddSession()`: Abrir modal para nueva sesión
- `handleEditSession()`: Abrir modal para editar
- `handleSaveSession()`: Guardar sesión (crear/actualizar)
- `handleDeleteSession()`: Eliminar sesión

### Lógica de Asistencia

```javascript
// Cuando se marca presente:
- Se deshabilita el selector de justificación
- Se limpia cualquier justificación previa
- Se actualiza el contador de presentes

// Cuando se desmarca presente:
- Se habilita el selector de justificación
- Se puede seleccionar: Tarde, Justificado, Falta
- Se actualizan los contadores correspondientes
```

### Cálculo de Estadísticas

```javascript
Presentes: Suma de checkboxes marcados
Tarde: Suma de justificaciones "Tarde"
Faltas: Suma de justificaciones "Falta" + ausentes sin justificar
```

## 🎯 Flujos de Usuario

### Flujo 1: Registrar Asistencia
1. Usuario ve la sesión actual
2. Marca checkboxes de estudiantes presentes
3. Selecciona justificaciones para ausentes
4. Ve estadísticas actualizarse en tiempo real
5. Hace clic en "Guardar asistencia"
6. Recibe confirmación

### Flujo 2: Crear Nueva Sesión
1. Usuario hace clic en "Agregar sesión"
2. Se abre modal con formulario
3. Llena: curso, fecha, hora inicio/fin, docente
4. Hace clic en "Guardar"
5. Modal se cierra
6. Nueva sesión aparece como actual

### Flujo 3: Editar Sesión
1. Usuario hace clic en "Editar sesión"
2. Modal se abre con datos precargados
3. Modifica campos necesarios
4. Guarda cambios
5. Sesión se actualiza

### Flujo 4: Ver Historial
1. Usuario hace clic en "Listar sesiones"
2. Se muestra tabla de historial
3. Puede hacer clic en "[Ver]" de cualquier sesión
4. Vuelve a vista principal con esa sesión cargada

## 📐 Diseño Responsive

### Breakpoint: 768px

```css
@media (max-width: 768px) {
  - Sidebar se oculta (transform: translateX(-100%))
  - Botón de menú aparece
  - Grids cambian a 1 columna
  - Botones ocupan ancho completo
  - Padding reducido
}
```

## ✨ Características Destacadas

### 1. Checkboxes Personalizados
- Diseño moderno con gradiente al marcar
- Ícono de check (✓) animado
- Efecto hover

### 2. Selectores Estilizados
- Fondo oscuro consistente
- Border con efecto focus
- Deshabilitado cuando estudiante está presente

### 3. Animaciones
- **fadeIn**: Entrada de secciones
- **slideUp**: Apertura de modal
- **hover effects**: Elevación y escalado
- **transitions**: Suaves en todos los elementos

### 4. Glassmorphism
- `backdrop-filter: blur(10px)` en cards
- Fondos semi-transparentes
- Bordes sutiles

## 🔄 Integración con Backend

### Base URL
```javascript
const API_BASE = 'http://localhost:3000/api';
```

### Manejo de Errores
```javascript
try {
  // Llamada a API
} catch (error) {
  console.error('Error:', error);
  alert('❌ Error al realizar la operación');
}
```

### Formato de Fechas
```javascript
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
```

## 🎨 Mejores Prácticas Implementadas

✅ **Separación de responsabilidades**: HTML (estructura), CSS (presentación), JS (lógica)  
✅ **Variables CSS**: Sistema de diseño centralizado  
✅ **Código modular**: Funciones pequeñas y reutilizables  
✅ **Nombres descriptivos**: Variables y funciones auto-explicativas  
✅ **Comentarios**: Secciones bien documentadas  
✅ **Responsive**: Mobile-first approach  
✅ **Accesibilidad**: Labels en formularios, contraste adecuado  
✅ **Performance**: Vanilla JS sin dependencias pesadas  

## 📝 Notas de Desarrollo

- **Sin frameworks**: Todo desarrollado con JavaScript vanilla para máxima compatibilidad
- **Modular**: Fácil de mantener y extender
- **Independiente**: No requiere otros módulos del sistema
- **Profesional**: Diseño moderno que impresiona visualmente

## 🚀 Carga Inicial

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 SICFOR - Módulo de Asistencia iniciado');
  loadInitialData();
});
```

1. Carga estudiantes
2. Carga sesiones
3. Establece sesión más reciente como actual
4. Carga asistencia de sesión actual
5. Renderiza tabla y historial

---

**Desarrollado por**: Grupo G  
**Asignatura**: Diseño de Sistemas de Información  
**Fecha**: Noviembre 2025
