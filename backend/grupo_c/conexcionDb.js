import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    port: process.env.DB_PORT,
});

conexion.getConnection()
    .then(() => console.log('Conexión a la base de datos exitosa'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));