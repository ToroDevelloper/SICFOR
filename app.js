import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Importar rutas (ajustar require a import si los archivos de ruta no son módulos aún, o usar createRequire)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const estudiantesRoutes = require('./backend/grupo_b/routes/estudiantes.js');
const cursosRoutes = require('./backend/grupo_d/routes/cursos.js');
import ticketRoutes from './backend/grupo_j/routes/ticketRoutes.js';
import { initSchema as initTicketSchema } from './backend/grupo_j/db.js';

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del dashboard y módulos frontend
app.use(express.static(__dirname));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// Rutas API
app.use('/estudiantes', estudiantesRoutes);
app.use('/api', cursosRoutes); // Grupo D
app.use('/api', ticketRoutes); // Grupo J

// Ruta principal para el Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  
  // Inicializar esquemas de BD que lo requieran
  await initTicketSchema();
});