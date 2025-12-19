import { conexion } from '../conexcionDb.js';

export class AreaExperienciaRepository {
    // Crear área de experiencia
    async crear(area) {
        const consulta = `
            INSERT INTO areas_experiencia (id_instructor, habilidad)
            VALUES (?, ?)
        `;
        const valores = [area.id_instructor, area.habilidad];
        const [resultado] = await conexion.query(consulta, valores);
        return resultado.insertId;
    }

    // Eliminar todas las áreas de un instructor
    async eliminarPorInstructor(idInstructor) {
        const consulta = 'DELETE FROM areas_experiencia WHERE id_instructor = ?';
        const [resultado] = await conexion.query(consulta, [idInstructor]);
        return resultado.affectedRows;
    }
}
