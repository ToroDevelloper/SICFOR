# Backend - Módulo de Asistencia (Grupo G)

## 📋 Descripción del Desarrollo

Este documento describe el desarrollo del backend para el **Módulo de Asistencia** del sistema SICFOR, desarrollado por el Grupo G.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución JavaScript
- **Express.js**: Framework web para Node.js
- **CORS**: Middleware para habilitar Cross-Origin Resource Sharing

## 📁 Estructura del Backend

```
backend/grupo_g/
├── server.js           # Servidor principal con API REST
├── DESARROLLO.md       # Este archivo
└── package.json        # Dependencias (en raíz del proyecto)
```

## 🔌 API REST Desarrollada

### Endpoints de Sesiones

#### `GET /api/sessions`
- **Descripción**: Obtiene todas las sesiones registradas
- **Respuesta**: Array de objetos sesión
- **Ejemplo**:
```json
[
  {
    "id": 1,
    "curso": "Fundamentos de Programación",
    "fecha": "2025-11-25",
    "horaInicio": "08:00",
    "horaFin": "10:00",
    "docente": "Juan Pérez"
  }
]
```

#### `GET /api/sessions/:id`
- **Descripción**: Obtiene una sesión específica por ID
- **Parámetros**: `id` (número)
- **Respuesta**: Objeto sesión o error 404

#### `POST /api/sessions`
- **Descripción**: Crea una nueva sesión
- **Body**:
```json
{
  "curso": "string",
  "fecha": "YYYY-MM-DD",
  "horaInicio": "HH:MM",
  "horaFin": "HH:MM",
  "docente": "string"
}
```
- **Respuesta**: Sesión creada con ID asignado

#### `PUT /api/sessions/:id`
- **Descripción**: Actualiza una sesión existente
- **Parámetros**: `id` (número)
- **Body**: Campos a actualizar
- **Respuesta**: Sesión actualizada

#### `DELETE /api/sessions/:id`
- **Descripción**: Elimina una sesión
- **Parámetros**: `id` (número)
- **Respuesta**: 204 No Content

### Endpoints de Asistencia

#### `GET /api/sessions/:id/attendance`
- **Descripción**: Obtiene los registros de asistencia de una sesión
- **Parámetros**: `id` (número de sesión)
- **Respuesta**: Array de registros de asistencia
```json
[
  {
    "studentId": 1,
    "presente": true,
    "justificacion": null
  }
]
```

#### `POST /api/sessions/:id/attendance`
- **Descripción**: Guarda los registros de asistencia de una sesión
- **Parámetros**: `id` (número de sesión)
- **Body**: Array de registros de asistencia
- **Respuesta**: Mensaje de confirmación

### Endpoints de Estudiantes

#### `GET /api/students`
- **Descripción**: Obtiene la lista de estudiantes
- **Respuesta**: Array de estudiantes
```json
[
  {
    "id": 1,
    "nombre": "Ana Rodríguez",
    "foto": "👩"
  }
]
```

## 💾 Modelo de Datos

### Sesión (Session)
```javascript
{
  id: number,           // ID único autogenerado
  curso: string,        // Nombre del curso
  fecha: string,        // Fecha en formato YYYY-MM-DD
  horaInicio: string,   // Hora de inicio HH:MM
  horaFin: string,      // Hora de fin HH:MM
  docente: string       // Nombre del docente
}
```

### Estudiante (Student)
```javascript
{
  id: number,           // ID único
  nombre: string,       // Nombre completo
  foto: string          // Emoji representativo
}
```

### Registro de Asistencia (Attendance Record)
```javascript
{
  studentId: number,    // ID del estudiante
  presente: boolean,    // true si está presente
  justificacion: string | null  // "Tarde", "Justificado", "Falta", o null
}
```

## 🗄️ Almacenamiento de Datos

El backend utiliza **almacenamiento en memoria** mediante variables JavaScript:

- `sessions`: Array de sesiones
- `students`: Array de estudiantes
- `attendance`: Objeto que mapea ID de sesión a array de registros
- `nextSessionId`: Contador para IDs autoincrementales

> **Nota**: Los datos se pierden al reiniciar el servidor. Para producción se recomienda implementar una base de datos (MongoDB, PostgreSQL, etc.)

## 🔧 Configuración del Servidor

- **Puerto**: 3000
- **CORS**: Habilitado para todas las origins
- **Static Files**: Sirve archivos desde `../../frontend/grupo_g`
- **Body Parser**: JSON habilitado

## 📊 Datos de Prueba (Mock Data)

El servidor incluye datos de prueba precargados:

- **4 sesiones** del curso "Fundamentos de Programación"
- **8 estudiantes** con nombres y emojis
- **Registros de asistencia** para la sesión 1

## 🚀 Ejecución

```bash
# Desde la raíz del proyecto
npm start

# O directamente
node backend/grupo_g/server.js
```

El servidor estará disponible en: `http://localhost:3000`

## 🔄 Flujo de Operaciones

### Crear Sesión
1. Cliente envía POST a `/api/sessions`
2. Servidor asigna ID único
3. Sesión se agrega al inicio del array
4. Se inicializa asistencia vacía para todos los estudiantes
5. Retorna sesión creada

### Registrar Asistencia
1. Cliente obtiene estudiantes con GET `/api/students`
2. Cliente carga asistencia actual con GET `/api/sessions/:id/attendance`
3. Usuario marca presente/ausente y justificaciones
4. Cliente envía POST `/api/sessions/:id/attendance` con todos los registros
5. Servidor guarda en memoria

### Consultar Historial
1. Cliente solicita GET `/api/sessions`
2. Servidor retorna todas las sesiones ordenadas (más reciente primero)
3. Cliente puede ver detalles de cada sesión

## 🎯 Características Implementadas

✅ CRUD completo de sesiones  
✅ Gestión de asistencia por sesión  
✅ Validación de IDs  
✅ Manejo de errores (404, etc.)  
✅ Inicialización automática de asistencia  
✅ Datos de prueba precargados  
✅ API RESTful siguiendo convenciones  
✅ Respuestas en formato JSON  

## 📝 Notas de Desarrollo

- El backend es **completamente independiente** y no requiere otros módulos del sistema SICFOR
- Diseñado para ser **stateless** (sin estado persistente entre reinicios)
- Preparado para **fácil migración** a base de datos real
- Sigue principios **REST** para la API
- Código **modular** y fácil de mantener

---

**Desarrollado por**: Grupo G  
**Asignatura**: Diseño de Sistemas de Información  
**Fecha**: Noviembre 2025
