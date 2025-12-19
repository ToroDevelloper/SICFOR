import { InstructorService } from '../services/instructorService.js';

export class InstructorController {
    constructor() {
        this.service = new InstructorService();
    }

    // GET /api/instructores - Obtener todos
    obtenerTodos = async (req, res) => {
        try {
            const instructores = await this.service.obtenerTodos();
            res.json(instructores);
        } catch (error) {
            console.error('Error al obtener instructores:', error);
            res.status(500).json({ error: 'Error al obtener instructores' });
        }
    };

    // GET /api/instructores/:id - Obtener por ID
    obtenerPorId = async (req, res) => {
        try {
            const { id } = req.params;
            const instructor = await this.service.obtenerPorId(id);
            res.json(instructor);
        } catch (error) {
            console.error('Error al obtener instructor:', error);
            if (error.message === 'Instructor no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error al obtener instructor' });
            }
        }
    };

    // POST /api/instructores - Crear instructor
    crear = async (req, res) => {
        try {
            const instructor = await this.service.crear(req.body);
            res.status(201).json(instructor);
        } catch (error) {
            console.error('Error al crear instructor:', error);
            res.status(500).json({ error: 'Error al crear instructor' });
        }
    };

    // PUT /api/instructores/:id - Actualizar instructor
    actualizar = async (req, res) => {
        try {
            const { id } = req.params;
            const instructor = await this.service.actualizar(id, req.body);
            res.json(instructor);
        } catch (error) {
            console.error('Error al actualizar instructor:', error);
            if (error.message === 'Instructor no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error al actualizar instructor' });
            }
        }
    };

    // PATCH /api/instructores/:id/estado - Cambiar estado del instructor
    cambiarEstado = async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            if (!estado) {
                return res.status(400).json({ error: 'El campo estado es requerido' });
            }
            
            const instructor = await this.service.cambiarEstado(id, estado);
            res.json(instructor);
        } catch (error) {
            console.error('Error al cambiar estado del instructor:', error);
            if (error.message === 'Instructor no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error al cambiar estado del instructor' });
            }
        }
    };
}
