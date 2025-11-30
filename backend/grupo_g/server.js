const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/grupo_g')));

// Mock data - Simulated database
let sessions = [
  {
    id: 1,
    curso: 'Fundamentos de Programación',
    fecha: '2025-11-25',
    horaInicio: '08:00',
    horaFin: '10:00',
    docente: 'Juan Pérez'
  },
  {
    id: 2,
    curso: 'Fundamentos de Programación',
    fecha: '2025-11-24',
    horaInicio: '08:00',
    horaFin: '10:00',
    docente: 'Juan Pérez'
  },
  {
    id: 3,
    curso: 'Fundamentos de Programación',
    fecha: '2025-11-22',
    horaInicio: '08:00',
    horaFin: '10:00',
    docente: 'Juan Pérez'
  },
  {
    id: 4,
    curso: 'Fundamentos de Programación',
    fecha: '2025-11-21',
    horaInicio: '08:00',
    horaFin: '10:00',
    docente: 'Juan Pérez'
  }
];

let students = [
  { id: 1, nombre: 'Ana Rodríguez', foto: '👩' },
  { id: 2, nombre: 'Carlos López', foto: '👨' },
  { id: 3, nombre: 'María González', foto: '👩' },
  { id: 4, nombre: 'Pedro Martínez', foto: '👨' },
  { id: 5, nombre: 'Laura Sánchez', foto: '👩' },
  { id: 6, nombre: 'Diego Torres', foto: '👨' },
  { id: 7, nombre: 'Sofia Ramírez', foto: '👩' },
  { id: 8, nombre: 'Miguel Ángel Castro', foto: '👨' }
];

let attendance = {
  1: [
    { studentId: 1, presente: true, justificacion: null },
    { studentId: 2, presente: false, justificacion: null },
    { studentId: 3, presente: false, justificacion: 'Tarde' },
    { studentId: 4, presente: true, justificacion: null },
    { studentId: 5, presente: false, justificacion: 'Justificado' },
    { studentId: 6, presente: true, justificacion: null },
    { studentId: 7, presente: true, justificacion: null },
    { studentId: 8, presente: false, justificacion: 'Falta' }
  ]
};

let nextSessionId = 5;

// API Routes

// Get all sessions
app.get('/api/sessions', (req, res) => {
  res.json(sessions);
});

// Get single session
app.get('/api/sessions/:id', (req, res) => {
  const session = sessions.find(s => s.id === parseInt(req.params.id));
  if (!session) {
    return res.status(404).json({ error: 'Sesión no encontrada' });
  }
  res.json(session);
});

// Create new session
app.post('/api/sessions', (req, res) => {
  const newSession = {
    id: nextSessionId++,
    ...req.body
  };
  sessions.unshift(newSession);
  
  // Initialize empty attendance for new session
  attendance[newSession.id] = students.map(student => ({
    studentId: student.id,
    presente: false,
    justificacion: null
  }));
  
  res.status(201).json(newSession);
});

// Update session
app.put('/api/sessions/:id', (req, res) => {
  const index = sessions.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Sesión no encontrada' });
  }
  
  sessions[index] = {
    ...sessions[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  
  res.json(sessions[index]);
});

// Delete session
app.delete('/api/sessions/:id', (req, res) => {
  const index = sessions.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Sesión no encontrada' });
  }
  
  sessions.splice(index, 1);
  delete attendance[req.params.id];
  
  res.status(204).send();
});

// Get students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Get attendance for a session
app.get('/api/sessions/:id/attendance', (req, res) => {
  const sessionId = parseInt(req.params.id);
  const sessionAttendance = attendance[sessionId];
  
  if (!sessionAttendance) {
    // Initialize if doesn't exist
    attendance[sessionId] = students.map(student => ({
      studentId: student.id,
      presente: false,
      justificacion: null
    }));
  }
  
  res.json(attendance[sessionId]);
});

// Save attendance for a session
app.post('/api/sessions/:id/attendance', (req, res) => {
  const sessionId = parseInt(req.params.id);
  attendance[sessionId] = req.body;
  res.json({ message: 'Asistencia guardada exitosamente' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SICFOR - Módulo de Asistencia (Grupo G)`);
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
});
