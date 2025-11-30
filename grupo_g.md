# SICFOR - Módulo de Asistencia (Grupo G)

Sistema Integral de Gestión para un Centro de Formación y Cursos - **Módulo de Asistencia**

## 📋 Descripción

Este es el módulo de asistencia desarrollado por el **Grupo G** para el sistema SICFOR. Es un módulo completamente independiente que permite:

- ✅ Gestionar sesiones de clase
- ✅ Registrar asistencia de estudiantes
- ✅ Manejar justificaciones (Tarde, Justificado, Falta)
- ✅ Ver historial de sesiones
- ✅ Generar estadísticas en tiempo real

## 🚀 Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Diseño**: Dark theme con glassmorphism y animaciones modernas

## 📁 Estructura Modular del Proyecto

```
SICFOR/
├── backend/
│   └── grupo_g/
│       ├── server.js           # Servidor Express con API REST
│       └── DESARROLLO.md       # Documentación del backend
├── frontend/
│   └── grupo_g/
│       ├── index.html          # Interfaz principal
│       ├── css/
│       │   └── styles.css      # Sistema de diseño
│       ├── js/
│       │   └── app.js          # Lógica de la aplicación
│       └── DESARROLLO.md       # Documentación del frontend
├── package.json                # Dependencias del proyecto
├── package-lock.json
├── .gitignore
└── README.md                   # Este archivo
```

## 📦 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar el servidor**:
```bash
npm start
```

3. **Abrir en el navegador**:
```
http://localhost:3000
```

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

## 🔌 API Endpoints

### Sesiones
- `GET /api/sessions` - Obtener todas las sesiones
- `GET /api/sessions/:id` - Obtener una sesión específica
- `POST /api/sessions` - Crear nueva sesión
- `PUT /api/sessions/:id` - Actualizar sesión
- `DELETE /api/sessions/:id` - Eliminar sesión

### Asistencia
- `GET /api/sessions/:id/attendance` - Obtener asistencia de una sesión
- `POST /api/sessions/:id/attendance` - Guardar asistencia

### Estudiantes
- `GET /api/students` - Obtener lista de estudiantes (mock data)

## 🎨 Características de Diseño

- **Dark Theme**: Tema oscuro moderno con colores vibrantes
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Gradientes**: Gradientes suaves en elementos principales
- **Animaciones**: Transiciones y micro-animaciones fluidas
- **Responsive**: Diseño adaptable a móviles y tablets
- **Tipografía**: Google Font Inter para mejor legibilidad

## 👥 Datos de Prueba

El sistema incluye datos de prueba (mock data):

**Estudiantes**:
- Ana Rodríguez
- Carlos López
- María González
- Pedro Martínez
- Laura Sánchez
- Diego Torres
- Sofia Ramírez
- Miguel Ángel Castro

**Sesiones**:
- 4 sesiones pre-cargadas del curso "Fundamentos de Programación"
- Docente: Juan Pérez
- Horario: 08:00 - 10:00

## 🔧 Desarrollo

### Estructura Modular

Este proyecto sigue una arquitectura modular donde:
- **Backend** (`backend/grupo_g/`): Contiene toda la lógica del servidor y API
- **Frontend** (`frontend/grupo_g/`): Contiene toda la interfaz de usuario

Cada módulo tiene su propia documentación `DESARROLLO.md` que explica en detalle lo implementado.

### Agregar más estudiantes
Editar el array `students` en `backend/grupo_g/server.js`:

```javascript
let students = [
  { id: 1, nombre: 'Nombre Apellido', foto: '👤' }
];
```

### Modificar estilos
Los colores y variables de diseño están en `frontend/grupo_g/css/styles.css` bajo `:root`:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  /* ... más variables */
}
```

## 📝 Notas

- Este módulo es **completamente independiente** y no requiere integración con otros módulos del sistema SICFOR
- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- Para producción, se recomienda implementar una base de datos real
- La estructura modular facilita el trabajo en equipo y la integración futura

## 👨‍💻 Grupo G

Módulo desarrollado por el Grupo G como parte del proyecto SICFOR para la asignatura de Diseño de Sistemas de Información.

### Integrantes del Equipo
- [Nombres de los integrantes]

---

**¡Listo para usar!** 🎉

Para más información técnica, consulta los archivos `DESARROLLO.md` en cada módulo.
