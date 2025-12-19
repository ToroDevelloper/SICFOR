-- Script para crear la base de datos y tablas del Módulo de Pagos y Estados de Cuenta
-- Grupo F - Modelo de Datos Independiente

CREATE DATABASE IF NOT EXISTS modulo_financiero;
USE modulo_financiero;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuario', 'contador') DEFAULT 'usuario',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Actualizar tipos de metodos_pago para coincidir con el frontend
-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('Efectivo', 'Transferencia', 'Tarjeta') NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actualizar tipos de transacciones para coincidir con el frontend
-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    metodo_pago_id INT,
    numero_operacion VARCHAR(50) UNIQUE NOT NULL,
    comprobante_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) ON DELETE SET NULL
);

-- Tabla de saldos (para tracking del saldo pendiente)
CREATE TABLE IF NOT EXISTS saldos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    saldo_pendiente DECIMAL(15, 2) DEFAULT 0.00,
    saldo_disponible DECIMAL(15, 2) DEFAULT 0.00,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de recibos pendientes
CREATE TABLE IF NOT EXISTS recibos_pendientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    fecha_vencimiento DATE,
    estado ENUM('pendiente', 'pagado', 'vencido') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de estado de cuenta - agrupa transacciones por usuario
CREATE TABLE IF NOT EXISTS estados_cuenta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    total_pagado DECIMAL(15, 2) DEFAULT 0.00,
    deuda_pendiente DECIMAL(15, 2) DEFAULT 0.00,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX idx_transacciones_estado ON transacciones(estado);
CREATE INDEX idx_metodos_pago_usuario ON metodos_pago(usuario_id);
