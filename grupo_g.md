# SICFOR - Módulo de Asistencia (Grupo G)

Sistema Integral de Gestión para un Centro de Formación y Cursos - **Módulo de Asistencia**

## 📋 Descripción

Este es el módulo de asistencia desarrollado por el **Grupo G** para el sistema SICFOR. Es un módulo **100% autónomo** que funciona sin necesidad de backend, usando datos mockeados y localStorage.

### Funcionalidades Principales
- ✅ Gestionar sesiones de clase
- ✅ Registrar asistencia de estudiantes
- ✅ Manejar justificaciones (Tarde, Justificado, Falta)
- ✅ Ver historial de sesiones
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Buscador de estudiantes
- ✅ Modo oscuro/claro
- ✅ Reloj en tiempo real

## 🚀 Tecnologías

- **HTML5**: Estructura semántica moderna
- **CSS3**: Variables CSS, animaciones, glassmorphism
- **JavaScript (Vanilla)**: Sin frameworks, 100% nativo
- **LocalStorage**: Persistencia de datos sin backend
- **Google Fonts**: Tipografía Inter

## 📁 Estructura del Proyecto

```
SICFOR/
├── frontend/
│   └── grupo_g/
│       ├── asistencias.html    # Interfaz principal del módulo
│       ├── index.html          # Redirección a asistencias.html
│       ├── css/
│       │   └── styles.css      # Sistema de diseño (1,118 líneas)
│       ├── js/
│       │   └── app.js          # Lógica completa (785 líneas)
│       └── DESARROLLO.md       # Documentación técnica
├── .gitignore                  # Configuración Git
└── grupo_g.md                  # Este archivo (README)
```

## � Uso

**No requiere instalación ni configuración**. Solo abre el archivo en tu navegador:

1. **Navega a la carpeta**:
```bash
cd frontend/grupo_g/
```

2. **Abre el archivo principal**:
   - Doble clic en `asistencias.html`, o
   - Abre con tu navegador favorito, o
   - Usa Live Server en VS Code

¡Eso es todo! El módulo funciona de inmediato sin servidor ni dependencias.

## ✨ Características v2.0

### 🎨 Animaciones Suaves
- Animaciones de entrada para todos los componentes
- Efectos fadeIn, slideDown, scaleIn
- Transiciones suaves en hover
- Stagger effect en dashboard cards

### 🔍 Buscador de Estudiantes
- Búsqueda en tiempo real sobre la tabla
- Filtra por nombre mientras escribes
- Diseño integrado con ícono

### 🌙 Modo Oscuro
- Toggle claro/oscuro en el header
- Persistencia en localStorage
- Paleta de colores optimizada
- Ícono dinámico (🌙/☀️)

### ⏱️ Reloj en Tiempo Real
- Actualizado cada segundo
- Formato 24 horas (HH:MM:SS)
- En el header junto a la fecha

### 📈 Dashboard de Estadísticas
- Total de estudiantes
- Promedio de asistencia
- Sesión actual
- Última actualización

## 🎯 Funcionalidades

### Gestión de Sesiones
- Crear nueva sesión de clase
- Editar sesión existente
- Eliminar sesión
- Ver detalles de sesión

### Registro de Asistencia
- Marcar estudiantes como presentes/ausentes
- Agregar justificaciones:
  - **Tarde**: Llegó tarde a clase
  - **Justificado**: Ausencia justificada
  - **Falta**: Ausencia sin justificar
- Guardar registros de asistencia

### Estadísticas
- Contador de presentes en tiempo real
- Contador de tardanzas
- Contador de faltas

### Historial
- Ver todas las sesiones registradas
- Acceder a sesiones pasadas
- Consultar asistencia histórica

## 📚 Documentación Detallada

Para información técnica detallada sobre cada módulo, consulta:

- **Backend**: [`backend/grupo_g/DESARROLLO.md`](backend/grupo_g/DESARROLLO.md)
  - API REST endpoints
  - Modelos de datos
  - Configuración del servidor

- **Frontend**: [`frontend/grupo_g/DESARROLLO.md`](frontend/grupo_g/DESARROLLO.md)
  - Componentes UI
  - Sistema de diseño
  - Lógica JavaScript
  - Flujos de usuario

## � Persistencia de Datos

### LocalStorage
Todos los datos se guardan automáticamente en el navegador:
- ✅ Sesiones creadas
- ✅ Registros de asistencia
- ✅ Preferencia de tema (claro/oscuro)
- ✅ Configuraciones del usuario

**Nota**: Los datos persisten entre sesiones del navegador. Para reiniciar, abre las DevTools del navegador y limpia el localStorage.

## 🎨 Características de Diseño

- **Dark Theme**: Tema oscuro moderno con colores vibrantes
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Gradientes**: Gradientes suaves en elementos principales
- **Animaciones**: Transiciones y micro-animaciones fluidas
- **Responsive**: Diseño adaptable a móviles y tablets
- **Tipografía**: Google Font Inter para mejor legibilidad

## 👥 Datos Iniciales

El sistema incluye datos de prueba precargados:

**Estudiantes** (10):
- Ana Rodríguez
- Carlos López
- María González
- Pedro Martínez
- Laura Sánchez
- Diego Torres
- Sofia Ramírez
- Miguel Ángel Castro
- Valentina Flores
- Andrés Morales

**Sesiones** (4 precargadas):
- Fundamentos de Programación
- Base de Datos
- Diseño de Sistemas
- Fechas actualizadas automáticamente

## 🔧 Personalización

### Agregar más estudiantes
Editar el array `MOCK_STUDENTS` en `frontend/grupo_g/js/app.js`:

```javascript
const MOCK_STUDENTS = [
  { id: 1, nombre: 'Nombre Apellido', foto: '👤' }
];
```

### Modificar colores y tema
Los colores están en `frontend/grupo_g/css/styles.css` bajo `:root`:

```css
:root {
  --primary-blue: #2563eb;
  --bg-main: #f8f9fa;
  /* ... más variables */
}

body.dark-mode {
  --bg-main: #0f172a;
  /* ... variables modo oscuro */
}
```

### Agregar nuevas animaciones
Las animaciones están definidas con `@keyframes` en el CSS:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 📝 Notas Técnicas

- ✅ **100% autónomo**: No requiere backend, servidor ni dependencias
- ✅ **Datos persistentes**: LocalStorage mantiene los datos entre sesiones
- ✅ **Vanilla JavaScript**: Sin frameworks, máximo rendimiento
- ✅ **Responsive**: Funciona en móviles, tablets y desktop
- ✅ **Modo offline**: Funciona sin conexión a internet
- ⚠️ **Limitación**: Los datos son locales al navegador y dispositivo

## 👨‍💻 Grupo G

Módulo desarrollado por el Grupo G como parte del proyecto SICFOR para la asignatura de Diseño de Sistemas de Información.

### Integrantes del Equipo
- [Nombres de los integrantes]

---

## 🎓 Información Académica

**Asignatura**: Diseño de Sistemas de Información  
**Semestre**: 2025-2  
**Grupo**: G  
**Proyecto**: SICFOR - Sistema Integral de Gestión para Centro de Formación  
**Módulo**: Asistencia  

---

**¡Listo para usar!** 🎉

Para documentación técnica detallada, consulta [`DESARROLLO.md`](frontend/grupo_g/DESARROLLO.md)
