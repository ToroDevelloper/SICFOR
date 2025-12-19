const mysql = require("mysql2")
const path = require("path")
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

// Crear conexión usando variables de entorno
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

// Probar la conexión
conexion.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos (Grupo D):', error)
        // No lanzamos error fatal aquí para no tumbar todo el servidor si este módulo falla,
        // pero en producción se debería manejar mejor.
        return;
    }
    console.log('Conexión exitosa a MySQL (Módulo Grupo D)')
})

module.exports = { conexion }
