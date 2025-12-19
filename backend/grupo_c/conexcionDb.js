import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ajustar ruta al .env raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    port: process.env.DB_PORT,
});

conexion.getConnection()
    .then(() => console.log('Conexión a la base de datos exitosa (Grupo C)'))
    .catch(err => console.error('Error de conexión a la base de datos (Grupo C):', err));