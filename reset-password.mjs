import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const email = 'juan.perez@sicfor.edu';
const newPassword = 'admin123';

async function resetPassword() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        const hash = await bcrypt.hash(newPassword, 10);
        console.log('Hash generado:', hash);
        
        await pool.query(
            'UPDATE usuarios SET contraseña = ? WHERE email = ?',
            [hash, email]
        );
        
        console.log(`✅ Contraseña actualizada para ${email}`);
        console.log(`Nueva contraseña: ${newPassword}`);
        
        // Verificar
        const [rows] = await pool.query('SELECT contraseña FROM usuarios WHERE email = ?', [email]);
        console.log('Nuevo hash en BD:', rows[0].contraseña);
        
        // Probar la verificación
        const isValid = await bcrypt.compare(newPassword, rows[0].contraseña);
        console.log('Verificación de contraseña:', isValid);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

resetPassword();
