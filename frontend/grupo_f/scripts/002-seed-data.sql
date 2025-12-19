-- Script para poblar la base de datos con datos de prueba
-- Módulo de Pagos y Estados de Cuenta - Grupo F
USE modulo_financiero;

-- Insertar usuario de prueba
INSERT INTO usuarios (id, nombre, email, password_hash, rol) VALUES
(1, 'Admin', 'admin@example.com', '$2b$10$placeholder_hash_here', 'administrador');

-- Insertar métodos de pago según requerimientos: Efectivo, Transferencia, Tarjeta
INSERT INTO metodos_pago (id, nombre, descripcion) VALUES
(1, 'Efectivo', 'Pago en efectivo'),
(2, 'Transferencia', 'Transferencia bancaria'),
(3, 'Tarjeta', 'Tarjeta de crédito o débito');

-- Insertar estado de cuenta inicial
INSERT INTO estados_cuenta (usuario_id, total_pagado, deuda_pendiente) VALUES
(1, 1500000.00, 2000000.00);

-- Insertar transacciones con nuevo modelo: Concepto, Estado (Pendiente/Aprobado/Rechazado)
INSERT INTO transacciones (usuario_id, fecha, monto, concepto, estado, metodo_pago_id, numero_operacion) VALUES
(1, CURDATE(), 500000.00, 'Matrícula 2024 - Primer Semestre', 'Aprobado', 2, 'OP2024001'),
(1, CURDATE(), 200000.00, 'Cuota mensualidad Enero', 'Aprobado', 3, 'OP2024002'),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 150000.00, 'Material didáctico', 'Pendiente', 1, 'OP2024003'),
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 350000.00, 'Inscripción curso extra', 'Pendiente', 2, 'OP2024004'),
(1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 100000.00, 'Carnet estudiantil', 'Rechazado', 1, 'OP2024005'),
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 300000.00, 'Cuota mensualidad Diciembre', 'Aprobado', 3, 'OP2024006');

-- Insertar recibos pendientes
INSERT INTO recibos_pendientes (usuario_id, descripcion, monto, fecha_vencimiento, estado) VALUES
(1, 'Cuota mensualidad Febrero', 200000.00, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'pendiente'),
(1, 'Seguro estudiantil', 80000.00, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'pendiente'),
(1, 'Laboratorios especiales', 120000.00, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'pendiente');
