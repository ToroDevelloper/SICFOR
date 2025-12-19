CREATE TABLE IF NOT EXISTS evaluaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);