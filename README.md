# Módulo Financiero - HTML/CSS/JavaScript Puro

Aplicación web para gestión financiera con HTML, CSS, JavaScript y Node.js/Express con MySQL.

## Requisitos Previos

- Node.js (versión 18 o superior)
- MySQL Server (versión 8.0 o superior)
- Visual Studio Code

## Estructura del Proyecto

```
├── public/
│   ├── index.html          # Frontend principal
│   ├── css/
│   │   └── styles.css      # Estilos CSS
│   └── js/
│       └── app.js          # Lógica JavaScript
├── server/
│   └── index.js            # Backend Express + MySQL
├── scripts/
│   ├── 001-create-database.sql  # Crear tablas
│   └── 002-seed-data.sql        # Datos de prueba
└── README.md
```

## Instalación en Visual Studio Code

### 1. Abrir el proyecto

```
Archivo > Abrir Carpeta > Seleccionar la carpeta del proyecto
```

### 2. Abrir Terminal

Presiona `Ctrl + Ñ` o ve a `Terminal > Nueva Terminal`

### 3. Instalar dependencias

```bash
npm install express mysql2 cors
```

### 4. Configurar MySQL

#### 4.1 Crear la base de datos

Abre MySQL Workbench, phpMyAdmin o la terminal de MySQL y ejecuta:

```sql
SOURCE scripts/001-create-database.sql;
SOURCE scripts/002-seed-data.sql;
```

O copia y pega el contenido de cada archivo SQL.

### 5. Configurar variables de entorno (opcional)

Por defecto, el servidor usa:
- Host: `localhost`
- Usuario: `root`
- Password: (vacío)
- Database: `modulo_financiero`

Para cambiar esto, puedes establecer variables de entorno:

**Windows (PowerShell):**
```powershell
$env:MYSQL_HOST="localhost"
$env:MYSQL_USER="tu_usuario"
$env:MYSQL_PASSWORD="tu_contraseña"
$env:MYSQL_DATABASE="modulo_financiero"
```

**Windows (CMD):**
```cmd
set MYSQL_HOST=localhost
set MYSQL_USER=tu_usuario
set MYSQL_PASSWORD=tu_contraseña
set MYSQL_DATABASE=modulo_financiero
```

**Linux/Mac:**
```bash
export MYSQL_HOST=localhost
export MYSQL_USER=tu_usuario
export MYSQL_PASSWORD=tu_contraseña
export MYSQL_DATABASE=modulo_financiero
```

## Ejecutar la Aplicación

### Iniciar el servidor

```bash
node server/index.js  C:\Users\andre\OneDrive\Escritorio\Modulo_Financiero\SICFOR\frontend\grupo_f\server
```

Verás el mensaje: `Servidor corriendo en http://localhost:3000`

### Abrir en el navegador

Ve a: `http://localhost:3000`

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard` | Datos del dashboard |
| GET | `/api/transacciones` | Listar transacciones |
| POST | `/api/transacciones` | Registrar pago |
| GET | `/api/metodos-pago` | Listar métodos de pago |
| POST | `/api/metodos-pago` | Agregar método |
| DELETE | `/api/metodos-pago/:id` | Eliminar método |

## Funcionalidades

- **Dashboard**: Saldo pendiente, estadísticas y transacciones recientes
- **Transacciones**: Historial con filtros (hoy, semana, mes)
- **Registrar Pago**: Formulario para pagos enviados/recibidos
- **Métodos de Pago**: Gestión de tarjetas y cuentas

## Solución de Problemas

### Error: "Cannot connect to MySQL"

1. Verifica que MySQL esté corriendo
2. Revisa usuario y contraseña
3. Asegúrate de que la base de datos `modulo_financiero` exista

### Error: "EADDRINUSE: port 3000"

El puerto está en uso. Cambia el puerto:

```bash
PORT=3001 node server/index.js
```

### Error: "Module not found"

Ejecuta nuevamente:

```bash
npm install express mysql2 cors
```

## Extensiones Recomendadas VS Code

- Live Server (para desarrollo frontend)
- MySQL (Jun Han)
- JavaScript (ES6) code snippets
