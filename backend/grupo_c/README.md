# API Instructores - Backend

## 📐 Arquitectura

Este proyecto implementa una API REST para la gestión de instructores utilizando una **arquitectura en capas** (Layered Architecture) con el patrón **Repository**.

### Estructura de Capas

```text
┌─────────────────────────┐
│   app-instructores.js   │  ← Punto de entrada (Express Server)
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│        Routes           │  ← Definición de endpoints
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│      Controllers        │  ← Manejo de peticiones HTTP
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│       Services          │  ← Lógica de negocio
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│     Repositories        │  ← Acceso a datos (SQL)
└───────────┬─────────────┘
            │
┌───────────▼─────────────┐
│    conexcionDb.js       │  ← Pool de conexiones MySQL
└─────────────────────────┘
```

## 📂 Componentes

### **app-instructores.js**

Aplicación Express que configura:

- CORS para peticiones desde el frontend
- Middleware JSON
- Rutas bajo `/api/instructores`
- Puerto de escucha desde `.env`

### **conexcionDb.js**

Pool de conexiones a MySQL usando `mysql2/promise` con configuración desde variables de entorno.

### **routes/instructorRoutes.js**

Define los endpoints REST:

- `GET /api/instructores` - Listar todos
- `GET /api/instructores/:id` - Obtener por ID
- `POST /api/instructores` - Crear instructor
- `PUT /api/instructores/:id` - Actualizar instructor
- `DELETE /api/instructores/:id` - Eliminar instructor

### **controllers/instructorController.js**

Recibe las peticiones HTTP, delega la lógica al servicio y retorna las respuestas con el código de estado apropiado.

### **services/instructorService.js**

Contiene la lógica de negocio:

- Validación de datos
- Formateo de fechas
- Orquestación entre repositorios (instructores y áreas de experiencia)

### **repositories/**

- **instructorRepository.js**: Queries SQL para CRUD de instructores
- **areaExperienciaRepository.js**: Queries SQL para áreas de experiencia

## 🛠 Tecnologías

- **Express**: Framework web
- **MySQL2**: Cliente de base de datos con soporte de promesas
- **CORS**: Gestión de peticiones cross-origin
- **dotenv**: Variables de entorno

## 🚀 Ejecución

```bash
npm run dev
```

El servidor escucha en el puerto definido en `.env`.
