const express = require('express');
const db = require('./db');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Servir archivos estáticos del frontend (CSS, HTML)
app.use(express.static(path.join(__dirname, '../frontend/grupo_h')));

// Servir archivos estáticos del backend (JS)
app.use('/backend/grupo_h', express.static(path.join(__dirname, 'grupo_h')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/grupo_h/grupoh.html'));
});

// API Endpoints
app.post('/api/evaluaciones', (req, res) => {
  const { nombre, tipo, fecha, descripcion } = req.body;
  const query = 'INSERT INTO evaluaciones (nombre, tipo, fecha, descripcion) VALUES (?, ?, ?, ?)';
  
  db.query(query, [nombre, tipo, fecha, descripcion], (err, result) => {
    if (err) {
      console.error('Error al crear evaluación:', err);
      res.status(500).json({ error: 'Error al crear la evaluación' });
      return;
    }
    res.status(201).json({ message: 'Evaluación creada exitosamente', id: result.insertId });
  });
});

// Example route to test DB connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      res.status(500).send('Error querying database');
      return;
    }
    res.json({ solution: results[0].solution, message: 'Database connection working' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});