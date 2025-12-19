import { InstructorRepository } from '../repositories/instructorRepository.js';
import { AreaExperienciaRepository } from '../repositories/areaExperienciaRepository.js';

export class InstructorService {
    constructor() {
        this.instructorRepo = new InstructorRepository();
        this.areaRepo = new AreaExperienciaRepository();
    }

    // Obtener todos los instructores
    async obtenerTodos() {
        return await this.instructorRepo.obtenerTodos();
    }

    // Obtener instructor por ID
    async obtenerPorId(id) {
        const instructor = await this.instructorRepo.obtenerPorId(id);

        // formateo de fecha de nacimiento a formato ISO (YYYY-MM-DD)
        if (instructor && instructor.fecha_nacimiento) {
            const fecha = new Date(instructor.fecha_nacimiento);
            instructor.fecha_nacimiento = fecha.toISOString().split('T')[0];
        }

        if (!instructor) {
            throw new Error('Instructor no encontrado');
        }
        return instructor;
    }

    // Crear instructor con áreas de experiencia
    async crear(datosInstructor) {
        // Crear instructor
        const idInstructor = await this.instructorRepo.crear(datosInstructor);

        // Crear áreas de experiencia si existen
        if (datosInstructor.habilidades && Array.isArray(datosInstructor.habilidades)) {
            for (const habilidad of datosInstructor.habilidades) {
                await this.areaRepo.crear({
                    id_instructor: idInstructor,
                    habilidad: habilidad
                });
            }
        }

        // Retornar el instructor completo creado
        return await this.obtenerPorId(idInstructor);
    }

    // Actualizar instructor
    async actualizar(id, datosInstructor) {
        // Verificar que el instructor existe
        await this.obtenerPorId(id);

        // Actualizar datos del instructor
        await this.instructorRepo.actualizar(id, datosInstructor);

        // Actualizar habilidades si se proporcionan
        if (datosInstructor.habilidades && Array.isArray(datosInstructor.habilidades)) {
            // Eliminar habilidades existentes
            await this.areaRepo.eliminarPorInstructor(id);

            // Crear nuevas habilidades
            for (const habilidad of datosInstructor.habilidades) {
                await this.areaRepo.crear({
                    id_instructor: id,
                    habilidad: habilidad
                });
            }
        }

        // Retornar el instructor actualizado
        return await this.obtenerPorId(id);
    }

    // Cambiar estado del instructor
    async cambiarEstado(id, estado) {
        // Verificar que el instructor existe
        await this.obtenerPorId(id);

        // Cambiar el estado
        const actualizados = await this.instructorRepo.cambiarEstado(id, estado);
        
        if (actualizados === 0) {
            throw new Error('No se pudo actualizar el estado');
        }

        // Retornar el instructor actualizado
        return await this.obtenerPorId(id);
    }
}
