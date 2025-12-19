import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

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
import instructorRoutes from './backend/grupo_c/routes/instructorRoutes.js';

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del dashboard y módulos frontend
app.use(express.static(__dirname));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Servir archivos estáticos de public en la raíz para compatibilidad con rutas absolutas
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));

// ========== GRUPO A: Configuración BD para Auth ==========
const authPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Verificar conexión Auth
(async () => {
    try {
        const connection = await authPool.getConnection();
        console.log('✅ Conexión Auth (Grupo A) exitosa');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar Auth:', error.message);
    }
})();

// ========== GRUPO A: Ruta de Login ==========
app.post('/api/auth/login', async (req, res) => {
    console.log('📧 Login solicitado para:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email y contraseña requeridos' });
    }

    try {
        const [usuarios] = await authPool.query(
            'SELECT * FROM usuarios WHERE email = ? AND estado = "active"',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ success: false, error: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];
        const passwordValido = await bcrypt.compare(password, usuario.contraseña);

        if (!passwordValido) {
            return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || 'sicfor_secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// ========== GRUPO A: Recuperación de contraseña ==========
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    const codigo = Math.floor(100000 + Math.random() * 900000);
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    try {
        const [rows] = await authPool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (!rows.length) return res.json({ success: false, error: 'Usuario no encontrado' });

        await authPool.query(
            'UPDATE usuarios SET reset_code = ?, reset_expira = ? WHERE email = ?',
            [codigo, expira, email]
        );

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Tu código de recuperación es: ${codigo}. Expira en 15 minutos.`,
        });

        res.json({ success: true, message: 'Código enviado al correo' });
    } catch (err) {
        console.error('❌ Error en forgot-password:', err);
        res.status(500).json({ success: false, error: 'Error al enviar código' });
    }
});

app.post('/api/verify-code', async (req, res) => {
    const { email, codigo } = req.body;
    try {
        const [rows] = await authPool.query(
            'SELECT reset_code, reset_expira FROM usuarios WHERE email = ?',
            [email]
        );
        if (!rows.length) return res.json({ success: false, error: 'Usuario no encontrado' });

        const user = rows[0];
        if (user.reset_code != codigo) return res.json({ success: false, error: 'Código inválido' });
        if (new Date() > user.reset_expira) return res.json({ success: false, error: 'Código expirado' });

        res.json({ success: true, message: 'Código válido' });
    } catch (err) {
        console.error('❌ Error en verify-code:', err);
        res.status(500).json({ success: false, error: 'Error al verificar código' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email, codigo, nuevaPassword } = req.body;
    try {
        const [rows] = await authPool.query(
            'SELECT reset_code, reset_expira FROM usuarios WHERE email = ?',
            [email]
        );
        if (!rows.length) return res.json({ success: false, error: 'Usuario no encontrado' });

        const user = rows[0];
        if (user.reset_code != codigo) return res.json({ success: false, error: 'Código inválido' });
        if (new Date() > user.reset_expira) return res.json({ success: false, error: 'Código expirado' });

        const hash = await bcrypt.hash(nuevaPassword, 10);
        await authPool.query(
            'UPDATE usuarios SET contraseña = ?, reset_code = NULL, reset_expira = NULL WHERE email = ?',
            [hash, email]
        );

        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        console.error('❌ Error en reset-password:', err);
        res.status(500).json({ success: false, error: 'Error al actualizar contraseña' });
    }
});

// Rutas API
app.use('/estudiantes', estudiantesRoutes);
app.use('/api', cursosRoutes); // Grupo D
app.use('/api', ticketRoutes); // Grupo J
app.use('/api/instructores', instructorRoutes); // Grupo C

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