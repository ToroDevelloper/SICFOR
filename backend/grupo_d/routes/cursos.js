const express = require('express');
const router = express.Router();
const { conexion } = require('../conexion');

// Rutas API para Cursos e Inscripciones (Grupo D)

// Obtener todos los cursos
router.get('/cursos', (req, res) => {
    const sql = 'SELECT * FROM cursos'
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener cursos:', error)
            return res.status(500).json({ error: 'Error al obtener cursos' })
        }
        res.json(results)
    })
})

// Obtener un curso por ID
router.get('/cursos/:id', (req, res) => {
    const { id } = req.params
    const sql = 'SELECT * FROM cursos WHERE id = ?'
    conexion.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener curso:', error)
            return res.status(500).json({ error: 'Error al obtener curso' })
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' })
        }
        res.json(results[0])
    })
})

// Crear nuevo curso
router.post('/cursos', (req, res) => {
    const { titulo, descripcion, duracion, modalidad, unidades_formacion } = req.body
    const sql = 'INSERT INTO cursos (titulo, descripcion, duracion, modalidad, unidades_formacion) VALUES (?, ?, ?, ?, ?)'
    conexion.query(sql, [titulo, descripcion, duracion, modalidad, unidades_formacion], (error, result) => {
        if (error) {
            console.error('Error al crear curso:', error)
            return res.status(500).json({ error: 'Error al crear curso' })
        }
        res.json({ id: result.insertId, titulo, descripcion, duracion, modalidad, unidades_formacion })
    })
})

// Actualizar curso
router.put('/cursos/:id', (req, res) => {
    const { id } = req.params
    const { titulo, descripcion, duracion, modalidad, unidades_formacion } = req.body
    const sql = 'UPDATE cursos SET titulo = ?, descripcion = ?, duracion = ?, modalidad = ?, unidades_formacion = ? WHERE id = ?'
    conexion.query(sql, [titulo, descripcion, duracion, modalidad, unidades_formacion, id], (error, result) => {
        if (error) {
            console.error('Error al actualizar curso:', error)
            return res.status(500).json({ error: 'Error al actualizar curso' })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' })
        }
        res.json({ id, titulo, descripcion, duracion, modalidad, unidades_formacion })
    })
})

// Eliminar curso
router.delete('/cursos/:id', (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM cursos WHERE id = ?'
    conexion.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error al eliminar curso:', error)
            return res.status(500).json({ error: 'Error al eliminar curso' })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' })
        }
        res.json({ success: true })
    })
})

// --- Rutas de Estudiantes/Inscripciones relacionadas al Grupo D ---

// Obtener inscripciones
router.get('/estudiantes', (req, res) => {
    // Lista inscripciones con datos del estudiante y curso
    const sql = 'SELECT i.*, e.nombres, c.titulo FROM inscripciones i JOIN cursos c ON i.id_curso = c.id JOIN estudiantes e ON i.id_estudiante = e.id'
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener estudiantes:', error)
            return res.status(500).json({ error: 'Error al obtener estudiantes' })
        }
        res.json(results)
    })
})

// Listar estudiantes para select (simple)
router.get('/estudiantes/list', (req, res) => {
    const sql = 'SELECT id, nombres FROM estudiantes'
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener lista de estudiantes:', error)
            return res.status(500).json({ error: 'Error al obtener lista de estudiantes' })
        }
        res.json(results)
    })
})

// Inscribir estudiante
router.post('/estudiantes', (req, res) => {
    const { id_estudiante, id_curso } = req.body
    const sql = 'INSERT INTO inscripciones (id_estudiante, id_curso) VALUES (?, ?)'
    conexion.query(sql, [id_estudiante, id_curso], (error, result) => {
        if (error) {
            console.error('Error al inscribir estudiante:', error)
            return res.status(500).json({ error: 'Error al inscribir estudiante' })
        }
        res.json({ id: result.insertId, id_estudiante, id_curso })
    })
})

// Eliminar inscripción
router.delete('/estudiantes/:id', (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM inscripciones WHERE id = ?'
    conexion.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error al eliminar inscripción:', error)
            return res.status(500).json({ error: 'Error al eliminar inscripción' })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' })
        }
        res.json({ success: true })
    })
})

module.exports = router;