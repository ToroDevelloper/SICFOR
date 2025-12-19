import { Router } from 'express';
import { InstructorController } from '../controllers/instructorController.js';

const router = Router();
const controller = new InstructorController();

// Rutas para instructores
router.get('/:id', controller.obtenerPorId);     // GET /api/instructores/1
router.get('/', controller.obtenerTodos);        // GET /api/instructores
router.post('/', controller.crear);              // POST /api/instructores
router.put('/:id', controller.actualizar);       // PUT /api/instructores/1
router.patch('/:id/estado', controller.cambiarEstado); // PATCH /api/instructores/1/estado

export default router;
