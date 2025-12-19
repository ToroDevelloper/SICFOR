import mysql from 'mysql2/promise'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Ajustar ruta al .env raíz
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env') })

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env

// Configuración del pool
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export async function initSchema() {
  let conn
  try {
    conn = await pool.getConnection()
    console.log('Grupo J: conexión establecida, verificando esquema...')
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asunto VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        prioridad VARCHAR(20) NOT NULL,
        estado VARCHAR(20) NOT NULL,
        fecha_creacion DATETIME NOT NULL,
        fecha_cierre DATETIME NULL,
        usuario_id INT NOT NULL
      )
    `)

    await conn.query(`
      CREATE TABLE IF NOT EXISTS respuestas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        autor VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        fecha DATETIME NOT NULL,
        es_agente TINYINT(1) NOT NULL DEFAULT 0,
        CONSTRAINT fk_respuestas_ticket
          FOREIGN KEY (ticket_id) REFERENCES tickets(id)
          ON DELETE CASCADE
      )
    `)
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ticket_historial (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        accion VARCHAR(100) NOT NULL,
        estado_anterior VARCHAR(20),
        estado_nuevo VARCHAR(20),
        descripcion TEXT,
        usuario VARCHAR(255) NOT NULL,
        fecha DATETIME NOT NULL,
        CONSTRAINT fk_historial_ticket
          FOREIGN KEY (ticket_id) REFERENCES tickets(id)
          ON DELETE CASCADE
      )
    `)
    
    console.log('Grupo J: esquema OK')
  } catch (err) {
    console.error('Grupo J: error inicializando esquema', err)
    // No lanzar error fatal para no tumbar el servidor principal, pero loguear
  } finally {
    if (conn) conn.release()
  }
}

export function toClientTicket(row, respuestas = []) {
  return {
    id: String(row.id).padStart(3, '0'),
    asunto: row.asunto,
    descripcion: row.descripcion,
    categoria: row.categoria,
    prioridad: row.prioridad,
    estado: row.estado,
    fechaCreacion: row.fecha_creacion?.toISOString(),
    fechaCierre: row.fecha_cierre ? row.fecha_cierre.toISOString() : undefined,
    usuarioId: row.usuario_id,
    respuestas: respuestas.map(r => ({
      id: r.id,
      autor: r.autor,
      mensaje: r.mensaje,
      fecha: r.fecha?.toISOString(),
      esAgente: !!r.es_agente
    }))
  }
}
