import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import instructorRoutes from './routes/instructorRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend/grupo_c')));

// Configurar rutas de la API
app.use('/api/instructores', instructorRoutes);

// Ruta para servir el index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/grupo_c/index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`Frontend disponible en http://localhost:${PORT}`);
});