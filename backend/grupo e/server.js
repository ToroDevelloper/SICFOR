// ===== IMPORTACIONES =====
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('./config/cloudinary');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3'); // NUEVO
const { initializeDatabase } = require('./init-db');

// ===== INICIALIZACIÓN =====
const app = express();
const PORT = process.env.PORT || 8080;

// ===== VARIABLE GLOBAL DE POOL =====
let pool;

// ===== CONFIGURACIÓN DE AWS S3 =====
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// ===== CARPETA DE UPLOADS =====
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// ===== MIDDLEWARE =====
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../../frontend/grupo\ e')));
app.use('/uploads', express.static(uploadsDir));

// ===== CONFIGURACIÓN DE MULTER =====
const uploadMemory = multer({ storage: multer.memoryStorage() });
const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});

// LÍMITES
const MAX_SIZE_IMAGE = 10 * 1024 * 1024;
const MAX_SIZE_VIDEO = 30 * 1024 * 1024;

function sanitizeFilename(filename) {
    let name = filename.split('.')[0];
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    name = name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    return (name || 'archivo').toLowerCase().substring(0, 50);
}

// ===== RUTAS DE PRUEBA =====
app.get('/', (req, res) => res.json({ mensaje: 'Servidor Grupo E Online', status: 'online' }));

// ===== UPLOAD A AWS S3 (NUEVO) =====
app.post('/api/v1/upload-aws', uploadMemory.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No hay archivo' });
        const { tipo, titulo, descripcion, autor, etiquetas } = req.body;

        const sanitizedName = sanitizeFilename(req.file.originalname);
        const fileName = `${tipo}/${Date.now()}-${sanitizedName}${path.extname(req.file.originalname)}`;

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO recursos (tipo, titulo, descripcion, url, public_id, autor, etiquetas) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tipo, titulo, descripcion || '', fileUrl, `aws:${fileName}`, autor || '', etiquetas || '']
        );
        connection.release();

        res.status(201).json({ id: result.insertId, tipo, titulo, url: fileUrl, mensaje: 'Subido a AWS exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== UPLOAD A CLOUDINARY (EXISTENTE) =====
app.post('/api/v1/upload', uploadMemory.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No hay archivo' });
        const { tipo, titulo, descripcion, autor, etiquetas } = req.body;

        const isVideo = req.file.mimetype.startsWith('video');
        const resourceType = isVideo ? 'video' : 'auto';

        const cloudinaryResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: `sicfor/${tipo}`, resource_type: resourceType },
                (err, res) => err ? reject(err) : resolve(res)
            );
            stream.end(req.file.buffer);
        });

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO recursos (tipo, titulo, descripcion, url, url_cloudinary, public_id, autor, etiquetas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tipo, titulo, descripcion || '', cloudinaryResult.secure_url, cloudinaryResult.secure_url, cloudinaryResult.public_id, autor || '', etiquetas || '']
        );
        connection.release();

        res.status(201).json({ id: result.insertId, url: cloudinaryResult.secure_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== UPLOAD LOCAL (EXISTENTE) =====
app.post('/api/v1/upload-local', uploadDisk.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No hay archivo' });
        const { tipo, titulo, descripcion, autor, etiquetas } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO recursos (tipo, titulo, descripcion, url, public_id, autor, etiquetas) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tipo, titulo, descripcion || '', fileUrl, `local:${req.file.filename}`, autor || '', etiquetas || '']
        );
        connection.release();

        res.status(201).json({ id: result.insertId, url: fileUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== DESCARGAR ARCHIVO DE AWS S3 =====
app.get('/api/v1/download-aws/:tipo/*', async (req, res) => {
    try {
        const tipo = req.params.tipo;
        const filePath = req.params[0]; // Obtiene la parte después del tipo
        const fileName = `${tipo}/${filePath}`;

        const downloadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName
        };

        const data = await s3Client.send(new GetObjectCommand(downloadParams));
        
        // Configurar headers para descargar o visualizar
        res.setHeader('Content-Type', data.ContentType);
        res.setHeader('Content-Disposition', 'inline'); // 'inline' para ver en navegador, 'attachment' para descargar
        
        data.Body.pipe(res);
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

// ===== CRUD RESTANTE (Copiado de tu original) =====
app.get('/api/v1/recursos', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM recursos ORDER BY fecha_creacion DESC');
        connection.release();
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/v1/recursos/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM recursos WHERE id = ?', [req.params.id]);
        connection.release();
        res.json({ mensaje: 'Eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ===== INICIO =====
async function startServer() {
    try {
        pool = await initializeDatabase();
        app.listen(PORT, () => console.log(`🚀 Servidor Grupo E en puerto ${PORT}`));
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}
startServer();