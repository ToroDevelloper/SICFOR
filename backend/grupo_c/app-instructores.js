import express from 'express';
import cors from 'cors';
import instructorRoutes from './routes/instructorRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json());

// Configurar rutas
app.use('/api/instructores', instructorRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});