import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { initSchema } from './db.js'
import ticketRoutes from './routes/ticketRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

const app = express()
const { PORT = 8080, NODE_ENV = 'development' } = process.env

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')))

// API routes
app.use('/api', ticketRoutes)

// Servir index.html para cualquier ruta no-API (soporte para cliente-side routing)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'))
})

initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT} (${NODE_ENV})`)
      console.log(`Abrir: http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Error inicializando esquema:', err)
    process.exit(1)
  })

