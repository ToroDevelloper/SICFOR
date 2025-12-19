import { conexion } from '../conexcionDb.js';

export class InstructorRepository {
    // Obtener todos los instructores con sus áreas de experiencia
    async obtenerTodos() {
        const consulta = `
            SELECT
                i.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', a.id,
                        'habilidad', a.habilidad
                    )
                ) AS habilidades
            FROM instructores i
            LEFT JOIN areas_experiencia a
                ON a.id_instructor = i.id_instructor
            GROUP BY i.id_instructor;
        `;
        const [instructores] = await conexion.query(consulta);
        return instructores;
    }

    // Obtener instructor por ID
    async obtenerPorId(id) {
        const consulta = `
            SELECT
                i.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', a.id,
                        'habilidad', a.habilidad
                    )
                ) AS habilidades
            FROM instructores i
            LEFT JOIN areas_experiencia a
                ON a.id_instructor = i.id_instructor
            WHERE i.id_instructor = ?
            GROUP BY i.id_instructor;
        `;
        const [instructores] = await conexion.query(consulta, [id]);
        return instructores[0];
    }

    // Crear instructor
    async crear(instructor) {
        const consulta = `
            INSERT INTO instructores (
                documento_identidad, nombres, apellidos, fecha_nacimiento,
                telefono, email, direccion, titulo_academico, especialidad,
                anos_experiencia, resumen, linkedin, foto_uri, hoja_vida_uri, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            instructor.documento_identidad,
            instructor.nombres,
            instructor.apellidos,
            instructor.fecha_nacimiento,
            instructor.telefono,
            instructor.email,
            instructor.direccion,
            instructor.titulo_academico,
            instructor.especialidad,
            instructor.anos_experiencia,
            instructor.resumen,
            instructor.linkedin,
            instructor.foto_uri,
            instructor.hoja_vida_uri,
            instructor.estado
        ];
        const [resultado] = await conexion.query(consulta, valores);
        return resultado.insertId;
    }

    // Actualizar instructor
    async actualizar(id, instructor) {
        const consulta = `
            UPDATE instructores SET
                documento_identidad = ?,
                nombres = ?,
                apellidos = ?,
                fecha_nacimiento = ?,
                telefono = ?,
                email = ?,
                direccion = ?,
                titulo_academico = ?,
                especialidad = ?,
                anos_experiencia = ?,
                resumen = ?,
                linkedin = ?,
                foto_uri = ?,
                hoja_vida_uri = ?,
                estado = ?
            WHERE id_instructor = ?
        `;
        const valores = [
            instructor.documento_identidad,
            instructor.nombres,
            instructor.apellidos,
            instructor.fecha_nacimiento,
            instructor.telefono,
            instructor.email,
            instructor.direccion,
            instructor.titulo_academico,
            instructor.especialidad,
            instructor.anos_experiencia,
            instructor.resumen,
            instructor.linkedin,
            instructor.foto_uri,
            instructor.hoja_vida_uri,
            instructor.estado,
            id
        ];
        const [resultado] = await conexion.query(consulta, valores);
        return resultado.affectedRows;
    }

    // Cambiar estado del instructor
    async cambiarEstado(id, estado) {
        const consulta = 'UPDATE instructores SET estado = ? WHERE id_instructor = ?';
        const [resultado] = await conexion.query(consulta, [estado, id]);
        return resultado.affectedRows;
    }
}
