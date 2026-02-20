-- --------------------------------------------------------
-- Host:                         34.27.58.232
-- Server version:               8.4.7-google - (Google)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for SICFOR
CREATE DATABASE IF NOT EXISTS `SICFOR` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SICFOR`;

-- Dumping structure for table SICFOR.actividad
CREATE TABLE IF NOT EXISTS `actividad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `descripcion` text NOT NULL,
  `tipo` enum('login','create','update','delete','access') NOT NULL,
  `modulo` varchar(50) DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `actividad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.actividad: ~15 rows (approximately)
INSERT INTO `actividad` (`id`, `usuario_id`, `descripcion`, `tipo`, `modulo`, `creado_en`) VALUES
	(1, 1, 'Inicio de sesión exitoso en el sistema', 'login', 'Sistema', '2025-12-14 21:11:17'),
	(2, 1, 'Nuevo usuario creado: María Rodríguez', 'create', 'Gestión Usuarios', '2025-12-14 21:11:17'),
	(3, 2, 'Actualizó su perfil personal', 'update', 'Mi Perfil', '2025-12-14 21:11:17'),
	(4, 2, 'Inicio de sesión exitoso', 'login', 'Sistema', '2025-12-14 21:11:17'),
	(5, 4, 'Acceso al catálogo de cursos', 'access', 'Catálogo Cursos', '2025-12-14 21:11:17'),
	(6, 1, 'Rol modificado para usuario Ana López', 'update', 'Gestión Roles', '2025-12-14 21:11:17'),
	(7, 3, 'Consulta de calificaciones personales', 'access', 'Calificaciones', '2025-12-14 21:11:17'),
	(8, 2, 'Material académico subido: "Introducción a Java"', 'create', 'Material Académico', '2025-12-14 21:11:17'),
	(9, 1, 'Configuración del sistema actualizada', 'update', 'Configuración', '2025-12-14 21:11:17'),
	(10, 4, 'Registro de pago procesado', 'create', 'Módulo Pagos', '2025-12-14 21:11:17'),
	(11, 2, 'Asistencia registrada para curso Java-101', 'create', 'Asistencia', '2025-12-14 21:11:17'),
	(12, 1, 'Backup del sistema creado', 'create', 'Sistema', '2025-12-14 21:11:17'),
	(13, 3, 'Descarga de certificado de curso', 'access', 'Certificados', '2025-12-14 21:11:17'),
	(14, 1, 'Permiso modificado para rol instructor', 'update', 'Gestión Roles', '2025-12-14 21:11:17'),
	(15, 4, 'Inscripción a nuevo curso completada', 'create', 'Registro Estudiantes', '2025-12-14 21:11:17');

-- Dumping structure for table SICFOR.archivos_adjuntos
CREATE TABLE IF NOT EXISTS `archivos_adjuntos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registro_id` int NOT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_almacenado` varchar(255) NOT NULL,
  `ruta_archivo` varchar(500) NOT NULL,
  `tipo_archivo` varchar(50) DEFAULT NULL,
  `tamaño_bytes` int DEFAULT NULL,
  `fecha_subida` datetime DEFAULT CURRENT_TIMESTAMP,
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_almacenado` (`nombre_almacenado`),
  KEY `registro_id` (`registro_id`),
  KEY `fecha_subida` (`fecha_subida`),
  CONSTRAINT `archivos_adjuntos_ibfk_1` FOREIGN KEY (`registro_id`) REFERENCES `registros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.archivos_adjuntos: ~0 rows (approximately)

-- Dumping structure for table SICFOR.areas_experiencia
CREATE TABLE IF NOT EXISTS `areas_experiencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_instructor` int DEFAULT NULL,
  `habilidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id_instructor` (`id_instructor`) USING BTREE,
  CONSTRAINT `areas_experiencia_ibfk_1` FOREIGN KEY (`id_instructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.areas_experiencia: ~6 rows (approximately)
INSERT INTO `areas_experiencia` (`id`, `id_instructor`, `habilidad`) VALUES
	(16, 3, 'UX/UI'),
	(19, 5, 'microservicios'),
	(20, 6, 'una'),
	(21, 10, 'microservicios'),
	(26, 2, 'Microservicios'),
	(27, 2, 'io');

-- Dumping structure for table SICFOR.auditoria
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tabla_afectada` varchar(100) DEFAULT NULL,
  `operacion` enum('INSERT','UPDATE','DELETE') DEFAULT NULL,
  `registro_id` int DEFAULT NULL,
  `cambios_json` json DEFAULT NULL,
  `fecha_operacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `tabla_afectada` (`tabla_afectada`),
  KEY `fecha_operacion` (`fecha_operacion`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.auditoria: ~0 rows (approximately)

-- Dumping structure for table SICFOR.calificaciones
CREATE TABLE IF NOT EXISTS `calificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_evaluacion` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `nota` decimal(4,2) DEFAULT '0.00',
  `observacion` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Calificado','Incompleto') DEFAULT 'Pendiente',
  `fecha_calificacion` timestamp NULL DEFAULT NULL,
  `retroalimentacion` text,
  `fecha_retroalimentacion` timestamp NULL DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_eval_est` (`id_evaluacion`,`id_estudiante`),
  KEY `idx_evaluacion` (`id_evaluacion`),
  KEY `idx_estudiante` (`id_estudiante`),
  CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calificaciones_chk_1` CHECK (((`nota` >= 0) and (`nota` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.calificaciones: ~42 rows (approximately)
INSERT INTO `calificaciones` (`id`, `id_evaluacion`, `id_estudiante`, `nota`, `observacion`, `estado`, `fecha_calificacion`, `retroalimentacion`, `fecha_retroalimentacion`, `creado_en`, `actualizado_en`) VALUES
	(3, 1, 23, 5.00, 'Impecable', 'Calificado', NULL, NULL, NULL, '2025-12-19 11:46:10', '2025-12-19 11:46:10'),
	(6, 2, 23, 4.20, 'Muy buen desempeño', 'Calificado', NULL, NULL, NULL, '2025-12-19 11:46:10', '2025-12-19 11:46:10'),
	(19, 6, 23, 4.50, 'exelente', 'Calificado', '2025-12-19 21:46:27', NULL, NULL, '2025-12-19 15:04:23', '2025-12-19 21:46:27'),
	(20, 6, 24, 4.50, '', 'Pendiente', '2025-12-19 21:46:27', NULL, NULL, '2025-12-19 15:04:23', '2025-12-19 21:46:27'),
	(30, 7, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:01:01', '2025-12-19 16:01:01'),
	(31, 7, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:01:01', '2025-12-19 16:01:01'),
	(34, 8, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:08:24', '2025-12-19 16:08:24'),
	(35, 8, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:08:24', '2025-12-19 16:08:24'),
	(38, 9, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:38:55', '2025-12-19 16:38:55'),
	(39, 9, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 16:38:55', '2025-12-19 16:38:55'),
	(42, 10, 23, 0.00, 'muy mal', 'Pendiente', '2025-12-19 21:23:11', NULL, NULL, '2025-12-19 20:47:08', '2025-12-19 21:23:11'),
	(43, 10, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 20:47:08', '2025-12-19 20:47:08'),
	(46, 11, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 20:51:39', '2025-12-19 20:51:39'),
	(47, 11, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 20:51:39', '2025-12-19 20:51:39'),
	(49, 12, 25, 0.00, '', 'Pendiente', '2025-12-19 21:51:09', NULL, NULL, '2025-12-19 21:44:24', '2025-12-19 21:51:09'),
	(51, 12, 23, 0.00, '', 'Pendiente', '2025-12-19 21:51:09', NULL, NULL, '2025-12-19 21:44:24', '2025-12-19 21:51:09'),
	(52, 12, 24, 0.00, '', 'Pendiente', '2025-12-19 21:51:10', NULL, NULL, '2025-12-19 21:44:24', '2025-12-19 21:51:10'),
	(53, 12, 26, 0.00, '', 'Pendiente', '2025-12-19 21:51:10', NULL, NULL, '2025-12-19 21:44:24', '2025-12-19 21:51:10'),
	(55, 13, 32, 4.00, '', 'Pendiente', '2025-12-19 22:55:56', NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:55:56'),
	(56, 13, 30, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(57, 13, 29, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(58, 13, 25, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(59, 13, 31, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(61, 13, 23, 0.00, '', 'Calificado', '2025-12-19 22:55:32', NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:55:32'),
	(62, 13, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(63, 13, 26, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 22:54:54', '2025-12-19 22:54:54'),
	(64, 14, 32, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(65, 14, 30, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(66, 14, 29, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(67, 14, 25, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(68, 14, 31, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(70, 14, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(71, 14, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(72, 14, 26, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:11:20', '2025-12-19 23:11:20'),
	(73, 15, 32, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(74, 15, 30, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(75, 15, 29, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(76, 15, 25, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(77, 15, 31, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(79, 15, 23, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(80, 15, 24, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13'),
	(81, 15, 26, 0.00, '', 'Pendiente', NULL, NULL, NULL, '2025-12-19 23:12:13', '2025-12-19 23:12:13');

-- Dumping structure for table SICFOR.cursos
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `duracion` int NOT NULL,
  `unidades_formacion` varchar(1000) DEFAULT NULL,
  `modalidad` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.cursos: ~5 rows (approximately)
INSERT INTO `cursos` (`id`, `titulo`, `descripcion`, `duracion`, `unidades_formacion`, `modalidad`) VALUES
	(1, 'Ecuaciones Diferenciales', 'sis', 2, 'Calculo Integral', 'Presencial'),
	(4, 'Electiva profesional', 'Diseño visual de aplicaciones', 12, 'Diseño de sistemas, Enfoque en colores', 'Presencial'),
	(9, 'Metodologia de investigacion', '...123', 10, 'Enfoque de investigacion', 'Virtual'),
	(14, 'hola', '...', 40, '5', 'Virtual'),
	(18, 'asdfg', 'a', 2, '2', 'Virtual');

-- Dumping structure for table SICFOR.estados_cuenta
CREATE TABLE IF NOT EXISTS `estados_cuenta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total_pagado` decimal(15,2) DEFAULT '0.00',
  `deuda_pendiente` decimal(15,2) DEFAULT '0.00',
  `ultima_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `estados_cuenta_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.estados_cuenta: ~0 rows (approximately)
INSERT INTO `estados_cuenta` (`id`, `usuario_id`, `total_pagado`, `deuda_pendiente`, `ultima_actualizacion`) VALUES
	(1, 1, 1500000.00, 2000000.00, '2025-12-19 20:41:00');

-- Dumping structure for table SICFOR.estudiantes
CREATE TABLE IF NOT EXISTS `estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fotografia` text,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo_documento` enum('CC','TI','CE','PASAPORTE') NOT NULL,
  `numero_identificacion` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `departamento_nacimiento` varchar(100) DEFAULT NULL,
  `municipio_nacimiento` varchar(100) DEFAULT NULL,
  `departamento_residencia` varchar(100) DEFAULT NULL,
  `municipio_residencia` varchar(100) DEFAULT NULL,
  `zona` enum('Rural','Urbana') DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_identificacion` (`numero_identificacion`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.estudiantes: ~9 rows (approximately)
INSERT INTO `estudiantes` (`id`, `fotografia`, `nombres`, `apellidos`, `tipo_documento`, `numero_identificacion`, `fecha_nacimiento`, `departamento_nacimiento`, `municipio_nacimiento`, `departamento_residencia`, `municipio_residencia`, `zona`, `direccion`, `email`, `celular`) VALUES
	(23, 'https://res.cloudinary.com/dsr10igcd/image/upload/v1766021105/sicfor/estudiantes/fjm5xmnowqq3yslxgxo9.jpg', 'Harold Jessid', 'Andrade Meneses', 'CC', '1130144150', '2004-01-25', 'Putumayo', 'Orito', 'Putumayo', 'Mocoa', 'Urbana', 'Enrique segoviano', 'menesesharoldyesid@gamil.com', '3105538610'),
	(24, 'https://res.cloudinary.com/dsr10igcd/image/upload/v1766172011/sicfor/estudiantes/tiqkoplh6fj9uuz25qaw.jpg', 'asdasdasd', 'sadasdasd', 'CC', '12341423', '2000-05-16', 'asdasd', 'asdasdasd', 'asdasd', 'asdasd', 'Rural', 'asdasdasdasd', 'GDFG@gmail.com', '12314123124'),
	(25, 'https://res.cloudinary.com/dsr10igcd/image/upload/v1766179262/sicfor/estudiantes/qbsuf7i61tuh4nlpayf8.jpg', 'JAMILTON sakd', 'jhskaj hjgjg', 'CC', '112322231', '2025-12-18', 'orito', 'mocoa', 'mocoa', 'asada', 'Urbana', 'barrio los alpek', 'djshasjkdga@gmail.com', '3223245586'),
	(26, NULL, 'alejandra', 'oliveira', 'TI', '3452167823', '2004-12-24', 'putumato', 'mocoa', 'mooca', 'putumayo', 'Urbana', 'san antonio', 'baobsua@gmail.com', '3125652417'),
	(29, 'https://res.cloudinary.com/dsr10igcd/image/upload/v1766180689/sicfor/estudiantes/jdmggoijir86w7p4cr1k.jpg', 'andres', 'Yesid', 'CC', '111111111', '2003-02-12', 'orito', 'mocoa', 'mocoa', 'asada', 'Rural', 'asdasdasdasd', 'aaaaaa@gmail.com', '33333333'),
	(30, 'https://res.cloudinary.com/dsr10igcd/image/upload/v1766180942/sicfor/estudiantes/dixumqxwsehiiduqzofu.jpg', 'qqqqq', 'qqqqq', 'TI', '11111111', '2003-12-12', 'orito', 'mocoa', 'asdasd', 'asada', 'Urbana', 'awjdjksdasd', 'aaa1aa@gmail.com', '222222222'),
	(31, NULL, 'aaaaaaa', 'Yesid', 'TI', '1123324062', '2003-03-13', NULL, NULL, NULL, NULL, NULL, NULL, 'asad@gmail.com', NULL),
	(32, NULL, 'a', 'd', 'CC', '0987654321', '2000-09-12', NULL, NULL, NULL, NULL, NULL, NULL, 'jhgjh@gmail.com', NULL);

-- Dumping structure for table SICFOR.evaluaciones
CREATE TABLE IF NOT EXISTS `evaluaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_evaluacion` varchar(20) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `fecha_limite` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `descripcion` text,
  `instrucciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `porcentaje` decimal(5,2) DEFAULT '0.00',
  `entrega_digital` tinyint(1) DEFAULT '0',
  `entregas_total` int DEFAULT '0',
  `entregas_completadas` int DEFAULT '0',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `habilitar_entrega_digital` tinyint(1) DEFAULT '0',
  `rubrica_url` varchar(500) DEFAULT NULL,
  `id_docente` int DEFAULT NULL,
  `estado_evaluacion` enum('Pendiente','Activo','Finalizado') DEFAULT 'Pendiente',
  `id_grupo` varchar(20) DEFAULT NULL COMMENT 'Grupo asociado (ej: GRUPO-H)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_evaluacion` (`id_evaluacion`),
  KEY `idx_estado` (`estado_evaluacion`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.evaluaciones: ~15 rows (approximately)
INSERT INTO `evaluaciones` (`id`, `id_evaluacion`, `nombre`, `tipo`, `fecha`, `fecha_limite`, `estado`, `descripcion`, `instrucciones`, `created_at`, `porcentaje`, `entrega_digital`, `entregas_total`, `entregas_completadas`, `fecha_creacion`, `habilitar_entrega_digital`, `rubrica_url`, `id_docente`, `estado_evaluacion`, `id_grupo`) VALUES
	(1, 'EV-001', 'Parcial Corte 1', 'Escrito', '2023-10-15', '2023-10-20', 'Finalizado', 'Evaluación teórica del primer corte', NULL, '2025-12-19 11:46:09', 30.00, 1, 0, 0, '2025-12-19 11:46:09', 0, NULL, NULL, 'Finalizado', NULL),
	(2, 'EV-002', 'Taller Práctico', 'Práctica', '2023-10-20', '2023-10-25', 'Active', 'Taller de aplicación práctica', NULL, '2025-12-19 11:46:09', 25.00, 1, 0, 0, '2025-12-19 11:46:09', 0, NULL, NULL, 'Activo', NULL),
	(3, 'EV-003', 'Quiz Rápido', 'Oral', '2023-10-22', '2023-10-22', 'Pendiente', 'Evaluación oral rápida', NULL, '2025-12-19 11:46:09', 10.00, 0, 0, 0, '2025-12-19 11:46:09', 0, NULL, NULL, 'Pendiente', NULL),
	(4, 'EV-H-01', 'Parcial 1', 'Escrito', '2024-05-01', '2024-05-05', 'Pendiente', 'Parcial teórico', NULL, '2025-12-19 13:01:53', 30.00, 1, 0, 0, '2025-12-19 13:01:53', 0, NULL, NULL, 'Activo', 'H'),
	(5, 'EV-H-02', 'Taller', 'Práctica', '2024-05-10', '2024-05-15', 'Pendiente', 'Taller aplicado', NULL, '2025-12-19 13:01:53', 20.00, 1, 0, 0, '2025-12-19 13:01:53', 0, NULL, NULL, 'Pendiente', 'H'),
	(6, 'EV-H-072243', 'Parcial Programacion Backend', 'Práctica', '2025-12-19', '2025-12-26', 'Pendiente', 'Individual', 'Instalar Nestjs', '2025-12-19 14:37:52', 60.00, 0, 0, 0, '2025-12-19 14:37:52', 1, NULL, NULL, 'Pendiente', 'H'),
	(7, 'EV-H-061074', 'DSI', 'Escrito', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', '', '2025-12-19 16:01:01', 20.00, 0, 0, 0, '2025-12-19 16:01:01', 1, NULL, NULL, 'Pendiente', 'H'),
	(8, 'EV-H-503658', 'D', 'Escrito', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'S', '2025-12-19 16:08:23', 20.00, 0, 0, 0, '2025-12-19 16:08:23', 1, NULL, NULL, 'Pendiente', 'H'),
	(9, 'EV-H-334675', 'D', 'Escrito', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'S', '2025-12-19 16:38:54', 20.00, 0, 0, 0, '2025-12-19 16:38:54', 0, NULL, NULL, 'Pendiente', 'H'),
	(10, 'EV-H-220674', 'Parcial De Redes y Comunicación II', 'Práctica', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'a', '2025-12-19 20:47:08', 60.00, 0, 0, 0, '2025-12-19 20:47:08', 1, NULL, NULL, 'Pendiente', 'H'),
	(11, 'EV-H-491480', 'Parcial De Redes y Comunicación I', 'Escrito', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'Individual', '2025-12-19 20:51:38', 60.00, 0, 0, 0, '2025-12-19 20:51:38', 1, NULL, NULL, 'Pendiente', 'H'),
	(12, 'EV-H-656479', 'parcial ', 'Práctica', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'es individual ', '2025-12-19 21:44:23', 20.00, 0, 0, 0, '2025-12-19 21:44:23', 0, '/uploads/rubricas/rubrica-1766180656433-581566428.pdf', NULL, 'Pendiente', 'H'),
	(13, 'EV-H-886945', 'PARCIAL DISEÑO3', 'Práctica', '2025-11-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'pueden usar IA', '2025-12-19 22:54:54', 60.00, 0, 0, 0, '2025-12-19 22:54:54', 1, '/uploads/rubricas/rubrica-1766184886908-362286281.pdf', NULL, 'Pendiente', 'H'),
	(14, 'EV-H-873112', 'Parcial de Diseño ', 'Escrito', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', 'Individual', '2025-12-19 23:11:20', 20.00, 0, 0, 0, '2025-12-19 23:11:20', 0, NULL, NULL, 'Pendiente', 'H'),
	(15, 'EV-H-925869', 'OOOOOOOOO', 'Práctica', '2025-12-19', NULL, 'Pendiente', 'Evaluación creada desde el sistema', '', '2025-12-19 23:12:13', 20.00, 0, 0, 0, '2025-12-19 23:12:13', 0, NULL, NULL, 'Pendiente', 'H');

-- Dumping structure for table SICFOR.formatos
CREATE TABLE IF NOT EXISTS `formatos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `campos_json` json NOT NULL,
  `requiere_evidencia` tinyint DEFAULT '0',
  `activo` tinyint DEFAULT '1',
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `nombre_2` (`nombre`),
  KEY `activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.formatos: ~6 rows (approximately)
INSERT INTO `formatos` (`id`, `nombre`, `descripcion`, `campos_json`, `requiere_evidencia`, `activo`, `creado_en`, `actualizado_en`) VALUES
	(1, 'Control de Inventario', 'Registro diario de existencias de productos en bodega', '{"campos": [{"tipo": "text", "nombre": "Producto", "requerido": true}, {"tipo": "number", "nombre": "Cantidad Inicial", "requerido": true}, {"tipo": "number", "nombre": "Entradas", "requerido": false}, {"tipo": "number", "nombre": "Salidas", "requerido": true}, {"tipo": "number", "nombre": "Cantidad Final", "requerido": true}, {"tipo": "textarea", "nombre": "Observaciones", "requerido": false}]}', 1, 1, '2025-12-06 06:40:26', '2025-12-06 06:40:26'),
	(2, 'Reporte de Cajas', 'Cierre y conciliación de cajas del día', '{"campos": [{"tipo": "number", "nombre": "Número de Caja", "requerido": true}, {"tipo": "number", "nombre": "Monto Inicial", "requerido": true}, {"tipo": "number", "nombre": "Ventas en Efectivo", "requerido": true}, {"tipo": "number", "nombre": "Devoluciones", "requerido": false}, {"tipo": "number", "nombre": "Monto Final", "requerido": true}, {"tipo": "number", "nombre": "Diferencia", "requerido": false}, {"tipo": "textarea", "nombre": "Observaciones", "requerido": false}]}', 0, 1, '2025-12-06 06:40:27', '2025-12-06 06:40:27'),
	(3, 'Control de Limpieza', 'Checklist de limpieza y sanitización del local', '{"campos": [{"tipo": "text", "nombre": "Área", "requerido": true}, {"tipo": "text", "nombre": "Limpio", "requerido": true}, {"tipo": "text", "nombre": "Desinfectado", "requerido": true}, {"tipo": "time", "nombre": "Hora de Limpieza", "requerido": true}, {"tipo": "text", "nombre": "Responsable", "requerido": true}, {"tipo": "textarea", "nombre": "Observaciones", "requerido": false}]}', 1, 1, '2025-12-06 06:40:27', '2025-12-06 06:40:27'),
	(4, 'Reporte de Incidencias', 'Registro de problemas, daños o quejas en el día', '{"campos": [{"tipo": "text", "nombre": "Tipo de Incidencia", "requerido": true}, {"tipo": "textarea", "nombre": "Descripción", "requerido": true}, {"tipo": "text", "nombre": "Ubicación", "requerido": true}, {"tipo": "text", "nombre": "Severidad", "requerido": true}, {"tipo": "textarea", "nombre": "Acción Tomada", "requerido": false}, {"tipo": "text", "nombre": "Reportado por", "requerido": true}]}', 1, 1, '2025-12-06 06:40:27', '2025-12-06 06:40:27'),
	(5, 'Control de Personal', 'Asistencia y puntualidad del personal', '{"campos": [{"tipo": "text", "nombre": "Empleado", "requerido": true}, {"tipo": "date", "nombre": "Fecha", "requerido": true}, {"tipo": "time", "nombre": "Hora Entrada", "requerido": true}, {"tipo": "time", "nombre": "Hora Salida", "requerido": false}, {"tipo": "number", "nombre": "Horas Trabajadas", "requerido": false}, {"tipo": "textarea", "nombre": "Novedades", "requerido": false}]}', 0, 1, '2025-12-06 06:40:27', '2025-12-06 06:40:27'),
	(6, 'Orden de Compra', 'Solicitud y registro de compras de suministros', '{"campos": [{"tipo": "text", "nombre": "Proveedor", "requerido": true}, {"tipo": "text", "nombre": "Producto", "requerido": true}, {"tipo": "number", "nombre": "Cantidad", "requerido": true}, {"tipo": "number", "nombre": "Valor Unitario", "requerido": true}, {"tipo": "number", "nombre": "Total", "requerido": true}, {"tipo": "date", "nombre": "Fecha Entrega", "requerido": false}, {"tipo": "textarea", "nombre": "Observaciones", "requerido": false}]}', 1, 1, '2025-12-06 06:40:27', '2025-12-06 06:40:27');

-- Dumping structure for table SICFOR.grupos
CREATE TABLE IF NOT EXISTS `grupos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL COMMENT 'Código del grupo (ej: GRUPO-H)',
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `id_docente` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `id_docente` (`id_docente`),
  CONSTRAINT `grupos_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.grupos: ~0 rows (approximately)

-- Dumping structure for table SICFOR.grupo_estudiantes
CREATE TABLE IF NOT EXISTS `grupo_estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_grupo` int NOT NULL,
  `id_estudiante` int NOT NULL,
  `fecha_inscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_grupo_estudiante` (`id_grupo`,`id_estudiante`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `grupo_estudiantes_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grupo_estudiantes_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.grupo_estudiantes: ~0 rows (approximately)

-- Dumping structure for table SICFOR.inscripciones
CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_inscripcion` datetime DEFAULT NULL,
  `id_estudiante` int DEFAULT NULL,
  `id_curso` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_curso_idx` (`id_curso`),
  KEY `id_estudiante_idx` (`id_estudiante`),
  CONSTRAINT `id_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`),
  CONSTRAINT `id_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.inscripciones: ~1 rows (approximately)
INSERT INTO `inscripciones` (`id`, `fecha_inscripcion`, `id_estudiante`, `id_curso`) VALUES
	(23, NULL, 25, 14);

-- Dumping structure for table SICFOR.instructores
CREATE TABLE IF NOT EXISTS `instructores` (
  `id_instructor` int NOT NULL AUTO_INCREMENT,
  `documento_identidad` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombres` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `titulo_academico` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `especialidad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `anos_experiencia` int DEFAULT '0',
  `resumen` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `linkedin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `foto_uri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hoja_vida_uri` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'activo',
  `tipo_documento` enum('C.C','NIT','PASAPORTE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_instructor`) USING BTREE,
  UNIQUE KEY `documento_identidad` (`documento_identidad`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.instructores: ~5 rows (approximately)
INSERT INTO `instructores` (`id_instructor`, `documento_identidad`, `nombres`, `apellidos`, `fecha_nacimiento`, `telefono`, `email`, `direccion`, `titulo_academico`, `especialidad`, `anos_experiencia`, `resumen`, `linkedin`, `foto_uri`, `hoja_vida_uri`, `estado`, `tipo_documento`) VALUES
	(2, '123445', 'Juan', 'Caicedo Arteaga', '2000-12-18', '31333412', 'testpost@gmail.com', 'Bogotá, Colombia', 'Ing', 'Dev', 4, 'aaa', 'http://test', 'https://ui-avatars.com/api/?name=Juan+Caicedo%20Arteaga&background=4a90e2&color=fff', '', 'activo', 'C.C'),
	(3, '12344a', 'Carla', 'Coral', '2000-12-12', '313334122', 'testpost2@gmail.com', 'Medellin, Colombia', 'Ingeniera', 'Frontend', 2, 'Es profesioal', 'http://test2', 'https://ui-avatars.com/api/?name=Carla+Coral&background=4a90e2&color=fff', '', 'activo', NULL),
	(5, '1121213123', 'david mauricio', 'zambrano guerrero', '2000-01-01', '+573229114571', 'dinoccuenta@gmail.com', 'mocoa, putumayo', 'ing sistemas', 'desarrollo backend', 1, 'Es dev', 'dinoccuenta.jijijija', 'https://ui-avatars.com/api/?name=david%20mauricio+zambrano%20guerrero&background=4a90e2&color=fff', '', 'activo', NULL),
	(6, '1123324066', 'JONIER ESNEIDER', 'RENDON CHAMORRO', '2000-02-12', '3224999772', 'rendonchamorro@gmail.com', 'barrio los alpes', 'ing', 'ing', 2, 'dio', '', 'https://ui-avatars.com/api/?name=JONIER%20ESNEIDER+RENDON%20CHAMORRO&background=4a90e2&color=fff', '', 'activo', NULL),
	(10, '1234567888', 'Johan', 'Arteaga <', '2025-12-19', '+573229114571', 'dinoccuenta111@gmail.com', 'mocoa, putumayo', 'ing sistemas', 'desarrollo backend', 1, '', 'dinoccuenta.jijijija', 'https://ui-avatars.com/api/?name=Johan+Arteaga%20%3C&background=4a90e2&color=fff', '', 'activo', NULL);

-- Dumping structure for table SICFOR.metodos_pago
CREATE TABLE IF NOT EXISTS `metodos_pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` enum('Efectivo','Transferencia','Tarjeta') NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.metodos_pago: ~3 rows (approximately)
INSERT INTO `metodos_pago` (`id`, `nombre`, `descripcion`, `activo`, `created_at`) VALUES
	(1, 'Efectivo', 'Pago en efectivo', 1, '2025-12-19 20:41:00'),
	(2, 'Transferencia', 'Transferencia bancaria', 1, '2025-12-19 20:41:00'),
	(3, 'Tarjeta', 'Tarjeta de crédito o débito', 1, '2025-12-19 20:41:00');

-- Dumping structure for table SICFOR.notificaciones
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('info','warning','success','error') DEFAULT 'info',
  `leida` tinyint(1) DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.notificaciones: ~0 rows (approximately)

-- Dumping structure for table SICFOR.permisos
CREATE TABLE IF NOT EXISTS `permisos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `modulo` varchar(50) NOT NULL,
  `permiso` varchar(100) NOT NULL,
  `descripcion` text,
  `permitido` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.permisos: ~18 rows (approximately)
INSERT INTO `permisos` (`id`, `rol_id`, `modulo`, `permiso`, `descripcion`, `permitido`) VALUES
	(1, 1, 'sistema', 'Acceso total al sistema', 'Acceso completo a todas las funcionalidades', 1),
	(2, 1, 'usuarios', 'Gestionar todos los usuarios', 'Crear, editar y eliminar usuarios', 1),
	(3, 1, 'configuracion', 'Configurar parámetros del sistema', 'Modificar configuración global', 1),
	(4, 1, 'roles', 'Crear y eliminar roles', 'Administrar roles y permisos', 1),
	(5, 1, 'reportes', 'Ver reportes completos', 'Acceso a reportes financieros y académicos', 1),
	(6, 1, 'backup', 'Gestionar copias de seguridad', 'Crear y restaurar backups', 1),
	(7, 2, 'estudiantes', 'Ver listado de estudiantes', 'Acceso a información de estudiantes', 1),
	(8, 2, 'asistencia', 'Registrar asistencia', 'Marcar asistencia de estudiantes', 1),
	(9, 2, 'calificaciones', 'Asignar calificaciones', 'Ingresar y modificar notas', 1),
	(10, 2, 'material', 'Subir material académico', 'Publicar contenido educativo', 1),
	(11, 2, 'usuarios', 'Gestionar otros usuarios', 'Modificar usuarios del sistema', 0),
	(12, 2, 'configuracion', 'Modificar configuración', 'Cambiar parámetros del sistema', 0),
	(13, 3, 'cursos', 'Ver cursos inscritos', 'Acceso a cursos matriculados', 1),
	(14, 3, 'calificaciones', 'Ver calificaciones propias', 'Consultar notas personales', 1),
	(15, 3, 'certificados', 'Descargar certificados', 'Obtener certificaciones', 1),
	(16, 3, 'material', 'Acceder a material académico', 'Ver contenido educativo', 1),
	(17, 3, 'usuarios', 'Modificar datos de otros', 'Editar información de terceros', 0),
	(18, 3, 'configuracion', 'Acceder a configuración', 'Ver parámetros del sistema', 0);

-- Dumping structure for table SICFOR.recibos_pendientes
CREATE TABLE IF NOT EXISTS `recibos_pendientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('pendiente','pagado','vencido') DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recibos_pendientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.recibos_pendientes: ~2 rows (approximately)
INSERT INTO `recibos_pendientes` (`id`, `usuario_id`, `descripcion`, `monto`, `fecha_vencimiento`, `estado`, `created_at`) VALUES
	(1, 1, 'Cuota mensualidad Febrero', 200000.00, '2026-01-03', 'pendiente', '2025-12-19 20:41:00'),
	(2, 1, 'Seguro estudiantil', 80000.00, '2025-12-24', 'pendiente', '2025-12-19 20:41:00');

-- Dumping structure for table SICFOR.recursos
CREATE TABLE IF NOT EXISTS `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('pdf','guias','videos','enlaces') COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_cloudinary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage_type` enum('local','cloudinary','url') COLLATE utf8mb4_unicode_ci DEFAULT 'url',
  `autor` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etiquetas` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_titulo` (`titulo`),
  KEY `idx_fecha` (`fecha_creacion`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table SICFOR.recursos: ~4 rows (approximately)
INSERT INTO `recursos` (`id`, `tipo`, `titulo`, `descripcion`, `url`, `url_cloudinary`, `public_id`, `storage_type`, `autor`, `etiquetas`, `fecha_creacion`, `fecha_actualizacion`) VALUES
	(38, 'pdf', 'encuesta ecoruta', '', 'https://gestion-academica.s3.us-east-1.amazonaws.com/pdf/1766185432767-informe-de-frontend-completo.docx', NULL, 'aws:pdf/1766185432767-informe-de-frontend-completo.docx', 'url', '', '', '2025-12-19 23:03:58', '2025-12-19 23:03:58'),
	(39, 'pdf', 'msljsvl', '', 'https://gestion-academica.s3.us-east-1.amazonaws.com/pdf/1766185452351-informe-de-frontend-completo.docx', NULL, 'aws:pdf/1766185452351-informe-de-frontend-completo.docx', 'url', '', '', '2025-12-19 23:04:17', '2025-12-19 23:04:17'),
	(40, 'pdf', 'lmlsc', '', 'https://gestion-academica.s3.us-east-1.amazonaws.com/pdf/1766185492651-informe-de-frontend-completo.docx', NULL, 'aws:pdf/1766185492651-informe-de-frontend-completo.docx', 'url', 'djafj', '', '2025-12-19 23:04:57', '2025-12-19 23:04:57'),
	(41, 'pdf', 'ksaakhvak', '', 'https://gestion-academica.s3.us-east-1.amazonaws.com/pdf/1766185928134-informe-de-frontend-completo.docx', NULL, 'aws:pdf/1766185928134-informe-de-frontend-completo.docx', 'url', 'ppp', '', '2025-12-19 23:12:13', '2025-12-19 23:12:13');

-- Dumping structure for table SICFOR.registros
CREATE TABLE IF NOT EXISTS `registros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `formato_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `contenido_json` json NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `observaciones` text,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `usuario_aprobador_id` int DEFAULT NULL,
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_aprobador_id` (`usuario_aprobador_id`),
  KEY `formato_id` (`formato_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `estado` (`estado`),
  KEY `fecha_registro` (`fecha_registro`),
  CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`formato_id`) REFERENCES `formatos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `registros_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `registros_ibfk_3` FOREIGN KEY (`usuario_aprobador_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.registros: ~14 rows (approximately)
INSERT INTO `registros` (`id`, `formato_id`, `usuario_id`, `contenido_json`, `estado`, `observaciones`, `fecha_registro`, `fecha_aprobacion`, `usuario_aprobador_id`, `creado_en`, `actualizado_en`) VALUES
	(1, 1, 1, '{"producto": "Café Americano", "observaciones": "Stock bajo, solicitar reorden", "cantidad_final": 55, "cantidad_inicial": 100, "cantidad_vendida": 45}', 'pendiente', NULL, '2025-12-06 06:49:38', NULL, NULL, '2025-12-06 06:49:38', '2025-12-06 06:49:38'),
	(2, 3, 2, '{"fecha": "2025-12-06", "notas": "Día normal de ventas", "turno": "Mañana", "alimentos": 45, "total_ventas": 850.5, "bebidas_frias": 80, "bebidas_calientes": 150}', 'aprobado', NULL, '2025-12-06 06:49:39', NULL, NULL, '2025-12-06 06:49:39', '2025-12-06 06:49:39'),
	(3, 5, 1, '{"fecha": "2025-12-06", "piso_limpio": "Sí", "mesas_limpias": "Sí", "baños_limpios": "Sí", "equipo_funcionando": "Sí", "problemas_reportados": "Ninguno"}', 'aprobado', NULL, '2025-12-06 06:49:39', NULL, 3, '2025-12-06 06:49:39', '2025-12-06 06:49:39'),
	(4, 6, 2, '{"fecha": "2025-12-06", "comentarios": "Excelente servicio del personal", "tiempo_espera": 5, "atencion_calidad": "Muy Buena", "reclamos_recibidos": 1, "clientes_satisfechos": 95}', 'pendiente', NULL, '2025-12-06 06:49:39', NULL, NULL, '2025-12-06 06:49:39', '2025-12-06 06:49:39'),
	(5, 2, 3, '{"fecha": "2025-12-06", "notas": "Arqueo correcto", "gastos": 300, "diferencia": 0, "saldo_final": 1400, "total_ventas": 1200, "saldo_inicial": 500}', 'aprobado', NULL, '2025-12-06 06:49:39', NULL, 1, '2025-12-06 06:49:39', '2025-12-06 06:49:39'),
	(6, 1, 2, '{"producto": "Pasteles", "observaciones": "Considerar producción adicional", "cantidad_final": 15, "cantidad_inicial": 50, "cantidad_vendida": 35}', 'rechazado', 'Faltan datos completos', '2025-12-06 06:49:40', NULL, NULL, '2025-12-06 06:49:40', '2025-12-06 06:49:40'),
	(7, 3, 1, '{"fecha": "2025-12-05", "notas": "Día anterior exitoso", "turno": "Tarde", "alimentos": 60, "total_ventas": 950.75, "bebidas_frias": 100, "bebidas_calientes": 120}', 'aprobado', NULL, '2025-12-06 06:49:40', NULL, 2, '2025-12-06 06:49:40', '2025-12-06 06:49:40'),
	(8, 1, 1, '{"producto": "Café Americano", "observaciones": "Stock bajo, solicitar reorden", "cantidad_final": 55, "cantidad_inicial": 100, "cantidad_vendida": 45}', 'pendiente', NULL, '2025-12-06 06:49:52', NULL, NULL, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(9, 3, 2, '{"fecha": "2025-12-06", "notas": "Día normal de ventas", "turno": "Mañana", "alimentos": 45, "total_ventas": 850.5, "bebidas_frias": 80, "bebidas_calientes": 150}', 'aprobado', NULL, '2025-12-06 06:49:52', NULL, NULL, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(10, 5, 1, '{"fecha": "2025-12-06", "piso_limpio": "Sí", "mesas_limpias": "Sí", "baños_limpios": "Sí", "equipo_funcionando": "Sí", "problemas_reportados": "Ninguno"}', 'aprobado', NULL, '2025-12-06 06:49:52', NULL, 3, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(11, 6, 2, '{"fecha": "2025-12-06", "comentarios": "Excelente servicio del personal", "tiempo_espera": 5, "atencion_calidad": "Muy Buena", "reclamos_recibidos": 1, "clientes_satisfechos": 95}', 'pendiente', NULL, '2025-12-06 06:49:52', NULL, NULL, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(12, 2, 3, '{"fecha": "2025-12-06", "notas": "Arqueo correcto", "gastos": 300, "diferencia": 0, "saldo_final": 1400, "total_ventas": 1200, "saldo_inicial": 500}', 'aprobado', NULL, '2025-12-06 06:49:52', NULL, 1, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(13, 1, 2, '{"producto": "Pasteles", "observaciones": "Considerar producción adicional", "cantidad_final": 15, "cantidad_inicial": 50, "cantidad_vendida": 35}', 'rechazado', 'Faltan datos completos', '2025-12-06 06:49:52', NULL, NULL, '2025-12-06 06:49:52', '2025-12-06 06:49:52'),
	(14, 3, 1, '{"fecha": "2025-12-05", "notas": "Día anterior exitoso", "turno": "Tarde", "alimentos": 60, "total_ventas": 950.75, "bebidas_frias": 100, "bebidas_calientes": 120}', 'aprobado', NULL, '2025-12-06 06:49:52', NULL, 2, '2025-12-06 06:49:52', '2025-12-06 06:49:52');

-- Dumping structure for table SICFOR.reportes_evaluaciones
CREATE TABLE IF NOT EXISTS `reportes_evaluaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_grupo` varchar(10) DEFAULT 'H',
  `tipo_reporte` enum('Simple','Rendimiento','Distribucion') NOT NULL,
  `periodo` varchar(20) DEFAULT NULL,
  `datos_json` json DEFAULT NULL,
  `fecha_generacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `creado_por` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_grupo` (`id_grupo`),
  KEY `idx_periodo` (`periodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.reportes_evaluaciones: ~0 rows (approximately)

-- Dumping structure for table SICFOR.respuestas
CREATE TABLE IF NOT EXISTS `respuestas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `autor` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` datetime NOT NULL,
  `es_agente` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_respuestas_ticket` (`ticket_id`),
  CONSTRAINT `fk_respuestas_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.respuestas: ~28 rows (approximately)
INSERT INTO `respuestas` (`id`, `ticket_id`, `autor`, `mensaje`, `fecha`, `es_agente`) VALUES
	(6, 1, 'Fabian Andres', 'asjkds', '2025-12-18 15:04:49', 0),
	(7, 7, 'Fabian Andres', 'a', '2025-12-18 15:51:34', 0),
	(8, 5, 'Fabian Andres', 'a', '2025-12-18 15:54:48', 0),
	(9, 1, 'Fabian Andres', 'ayudame', '2025-12-18 15:55:01', 0),
	(10, 1, 'Fabian Andres', 'recordame oe', '2025-12-18 15:55:45', 0),
	(11, 5, 'Fabian Andres', 'e', '2025-12-18 15:56:13', 0),
	(12, 8, 'Fabian Andres', 'siso perro', '2025-12-18 16:02:59', 0),
	(13, 7, 'Fabian Andres', 'a', '2025-12-18 16:07:17', 0),
	(14, 7, 'Fabian Andres', 'a', '2025-12-18 16:27:47', 0),
	(15, 5, 'Fabian Andres', 'a', '2025-12-18 16:31:12', 0),
	(16, 5, 'Fabian Andres', 'a', '2025-12-18 16:41:33', 0),
	(17, 5, 'Fabian Andres', 'asdfg', '2025-12-18 17:05:39', 0),
	(18, 5, 'Fabian Andres', 'xd pero que', '2025-12-18 17:05:56', 0),
	(19, 1, 'Fabian Andres', 'asfdg', '2025-12-18 17:26:07', 0),
	(20, 1, 'Fabian Andres', 'asfhg', '2025-12-18 17:28:41', 0),
	(21, 1, 'Fabian Andres', 'holas', '2025-12-18 17:28:50', 0),
	(22, 1, 'Soporte', 'juega', '2025-12-18 17:31:00', 1),
	(23, 8, 'Soporte', 'asumadre', '2025-12-18 17:37:15', 1),
	(24, 12, 'Soporte', 'Estamos procesando tu solicitud con el área de licencias', '2025-12-19 06:28:06', 1),
	(25, 13, 'Soporte', 'Impresora reiniciada y drivers actualizados', '2025-12-19 06:28:06', 1),
	(26, 14, 'Soporte', 'ya deberia cargar sin problema', '2025-12-19 01:32:30', 1),
	(27, 16, 'Soporte', 'Estamos procesando tu solicitud con el área de licencias', '2025-12-19 13:09:30', 1),
	(28, 17, 'Soporte', 'Impresora reiniciada y drivers actualizados', '2025-12-19 13:09:31', 1),
	(29, 20, 'Soporte', 'traigalo a la oficina de sistemas/mantenimiento para poder hacerle su respectiva observación', '2026-01-14 20:37:29', 1),
	(30, 21, 'Soporte', 'No lo se, pareces veneco', '2026-01-14 20:42:23', 1),
	(31, 21, 'Soporte', 'xD\nayuda ctm', '2026-01-30 19:18:35', 1),
	(32, 21, 'Fabian Andres  ', 'ayudame', '2026-01-30 19:18:46', 0),
	(33, 21, 'Soporte', 'ps muerase a', '2026-01-31 01:02:43', 1);

-- Dumping structure for table SICFOR.retroalimentacion
CREATE TABLE IF NOT EXISTS `retroalimentacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_calificacion` int NOT NULL,
  `comentario` text NOT NULL,
  `fecha_comentario` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` enum('Docente','Sistema','Auto') DEFAULT 'Docente',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_calificacion` (`id_calificacion`),
  CONSTRAINT `retroalimentacion_ibfk_1` FOREIGN KEY (`id_calificacion`) REFERENCES `calificaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.retroalimentacion: ~4 rows (approximately)
INSERT INTO `retroalimentacion` (`id`, `id_calificacion`, `comentario`, `fecha_comentario`, `tipo`, `creado_en`) VALUES
	(3, 19, 'estas muy mal', '2025-12-19 21:27:55', 'Docente', '2025-12-19 21:27:55'),
	(4, 51, 'exelente ', '2025-12-19 21:47:37', 'Docente', '2025-12-19 21:47:37'),
	(5, 19, 'ole', '2025-12-19 22:19:40', 'Docente', '2025-12-19 22:19:40'),
	(6, 58, 'exelente ', '2025-12-19 22:56:23', 'Docente', '2025-12-19 22:56:23');

-- Dumping structure for table SICFOR.retroalimentacion_historial
CREATE TABLE IF NOT EXISTS `retroalimentacion_historial` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_calificacion` int NOT NULL,
  `comentario` text NOT NULL,
  `autor` varchar(100) NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_calificacion` (`id_calificacion`),
  KEY `idx_fecha` (`fecha`),
  CONSTRAINT `retroalimentacion_historial_ibfk_1` FOREIGN KEY (`id_calificacion`) REFERENCES `calificaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.retroalimentacion_historial: ~0 rows (approximately)

-- Dumping structure for table SICFOR.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `es_sistema` tinyint(1) DEFAULT '0',
  `usuarios_asignados` int DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `es_sistema`, `usuarios_asignados`, `creado_en`, `actualizado_en`) VALUES
	(1, 'admin', 'Control total sobre la configuración, seguridad y todos los datos del sistema.', 1, 0, '2025-12-14 21:10:45', '2025-12-14 21:10:45'),
	(2, 'instructor', 'Gestión de estudiantes, calificaciones, asistencia y material académico.', 1, 0, '2025-12-14 21:10:45', '2025-12-14 21:10:45'),
	(3, 'student', 'Acceso a cursos inscritos, calificaciones propias y material académico.', 1, 0, '2025-12-14 21:10:45', '2025-12-14 21:10:45'),
	(4, 'Técnico', 'Técnico de soporte - puede ver todos los tickets', 1, 0, '2025-12-19 00:18:35', '2025-12-19 00:18:35');

-- Dumping structure for table SICFOR.sesiones
CREATE TABLE IF NOT EXISTS `sesiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `expira_en` timestamp NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.sesiones: ~0 rows (approximately)

-- Dumping structure for table SICFOR.tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `prioridad` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.tickets: ~18 rows (approximately)
INSERT INTO `tickets` (`id`, `asunto`, `descripcion`, `categoria`, `prioridad`, `estado`, `fecha_creacion`, `fecha_cierre`, `usuario_id`) VALUES
	(1, 'no entra a mi cuenta', 'no abre mi cuena', 'Técnico', 'Baja', 'Abierto', '2025-12-18 09:52:06', NULL, 1),
	(5, 'asa', 'axdas', 'Técnico', 'Baja', 'Cerrado', '2025-12-18 14:37:16', '2025-12-18 17:07:10', 1),
	(7, 'ayuda', 'ayudapor favor me muero', 'Técnico', 'Baja', 'Cerrado', '2025-12-18 15:51:01', '2025-12-18 16:28:56', 1),
	(8, 'ayuda', 'aaaaaaaaaaaaaa', 'Administrativo', 'Baja', 'Abierto', '2025-12-18 16:02:43', NULL, 1),
	(9, 'zorras', 'siso esto funciona', 'Técnico', 'Baja', 'Abierto', '2025-12-18 18:33:17', NULL, 101),
	(10, 'ayuda', 'pero una ayuda oe\n', 'Técnico', 'Baja', 'Abierto', '2025-12-18 19:29:47', NULL, 101),
	(11, 'Sistema lento en módulo contabilidad', 'El módulo de contabilidad tarda mucho en cargar las pantallas principales', 'Técnico', 'Alta', 'Abierto', '2025-12-19 06:28:05', NULL, 2),
	(12, 'Solicitud de licencia de software', 'Necesito licencia de AutoCAD 2024 para proyecto de infraestructura', 'Software', 'Media', 'En proceso', '2025-12-19 06:28:06', NULL, 3),
	(13, 'Error al imprimir reportes', 'La impresora HP del área no responde desde el sistema', 'Hardware', 'Baja', 'Cerrado', '2025-12-19 06:28:06', NULL, 4),
	(14, 'Acceso denegado a módulo de nómina', 'No puedo entrar al módulo de nómina desde esta mañana', 'Administrativo', 'Urgente', 'Abierto', '2025-12-19 06:28:07', NULL, 2),
	(15, 'Sistema lento en módulo contabilidad', 'El módulo de contabilidad tarda mucho en cargar las pantallas principales', 'Técnico', 'Alta', 'Abierto', '2025-12-19 13:09:30', NULL, 2),
	(16, 'Solicitud de licencia de software', 'Necesito licencia de AutoCAD 2024 para proyecto de infraestructura', 'Software', 'Media', 'En proceso', '2025-12-19 13:09:30', NULL, 3),
	(17, 'Error al imprimir reportes', 'La impresora HP del área no responde desde el sistema', 'Hardware', 'Baja', 'Abierto', '2025-12-19 13:09:30', NULL, 4),
	(18, 'Acceso denegado a módulo de nómina', 'No puedo entrar al módulo de nómina desde esta mañana', 'Administrativo', 'Urgente', 'Abierto', '2025-12-19 13:09:31', NULL, 2),
	(19, 'ayuda', 'necesito ayuda en el ', 'Técnico', 'prioridad', 'Abierto', '2025-12-19 17:20:23', NULL, 1),
	(20, 'ayuda', 'mi computadora al encender y usarla durante mas de 2 horas se empieza a sobrecalentar bastante y se apaga', 'Hardware', 'Media', 'Abierto', '2026-01-14 20:32:46', NULL, 1),
	(21, 'No tengo Fé', 'me duele el estomago', 'Administrativo', 'Media', 'Abierto', '2026-01-14 20:41:25', NULL, 1),
	(23, 'ayudenme', 'no me puedo matricular a pesar de que se haya pagado', 'Académico', 'Media', 'Abierto', '2026-01-31 01:20:51', NULL, 1);

-- Dumping structure for table SICFOR.ticket_historial
CREATE TABLE IF NOT EXISTS `ticket_historial` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `estado_anterior` varchar(20) DEFAULT NULL,
  `estado_nuevo` varchar(20) DEFAULT NULL,
  `descripcion` text,
  `usuario` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_historial_ticket` (`ticket_id`),
  CONSTRAINT `fk_historial_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.ticket_historial: ~54 rows (approximately)
INSERT INTO `ticket_historial` (`id`, `ticket_id`, `accion`, `estado_anterior`, `estado_nuevo`, `descripcion`, `usuario`, `fecha`) VALUES
	(1, 5, 'Editado', 'Abierto', 'Abierto', 'Datos actualizados', 'Usuario', '2025-12-18 16:56:45'),
	(2, 5, 'Editado', 'Abierto', 'Abierto', 'Datos actualizados', 'Usuario', '2025-12-18 17:05:26'),
	(3, 5, 'Respuesta agregada', NULL, NULL, 'Fabian Andres: "asdfg"', 'Fabian Andres', '2025-12-18 17:05:39'),
	(4, 5, 'Respuesta agregada', NULL, NULL, 'Fabian Andres: "xd pero que"', 'Fabian Andres', '2025-12-18 17:05:56'),
	(5, 5, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2025-12-18 17:06:48'),
	(6, 5, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2025-12-18 17:06:58'),
	(7, 5, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2025-12-18 17:07:10'),
	(8, 8, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2025-12-18 17:07:46'),
	(9, 8, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2025-12-18 17:24:35'),
	(10, 1, 'Respuesta agregada', NULL, NULL, 'Fabian Andres: "asfdg"', 'Fabian Andres', '2025-12-18 17:26:07'),
	(11, 1, 'Respuesta agregada', NULL, NULL, 'Fabian Andres: "asfhg"', 'Fabian Andres', '2025-12-18 17:28:41'),
	(12, 1, 'Respuesta agregada', NULL, NULL, 'Fabian Andres: "holas"', 'Fabian Andres', '2025-12-18 17:28:50'),
	(13, 1, 'Respuesta editada', NULL, NULL, 'Comentario de Fabian Andres fue editado', 'Fabian Andres', '2025-12-18 17:30:29'),
	(14, 1, 'Respuesta agregada', NULL, NULL, 'Soporte: "juega"', 'Soporte', '2025-12-18 17:31:00'),
	(15, 1, 'Respuesta editada', NULL, NULL, 'Comentario de Fabian Andres fue editado', 'Fabian Andres', '2025-12-18 17:32:23'),
	(16, 1, 'Respuesta editada', NULL, NULL, 'Comentario de Fabian Andres fue editado', 'Fabian Andres', '2025-12-18 17:36:19'),
	(17, 8, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2025-12-18 17:37:01'),
	(18, 8, 'Respuesta agregada', NULL, NULL, 'Soporte: "asumadre"', 'Soporte', '2025-12-18 17:37:15'),
	(19, 9, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-18 18:33:17'),
	(20, 9, 'Editado', 'Abierto', 'Abierto', 'Datos actualizados', 'Usuario', '2025-12-18 18:33:53'),
	(21, 10, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-18 19:29:47'),
	(22, 11, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 06:28:06'),
	(23, 12, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 06:28:06'),
	(24, 12, 'Respuesta agregada', NULL, NULL, 'Soporte: "Estamos procesando tu solicitud..."', 'Soporte', '2025-12-19 06:28:06'),
	(25, 13, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 06:28:06'),
	(26, 13, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Soporte', '2025-12-19 06:28:06'),
	(27, 14, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 06:28:07'),
	(28, 14, 'Respuesta agregada', NULL, NULL, 'Soporte: "ya deberia cargar sin problema"', 'Soporte', '2025-12-19 01:32:30'),
	(29, 15, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 13:09:30'),
	(30, 16, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 13:09:30'),
	(31, 16, 'Respuesta agregada', NULL, NULL, 'Soporte: "Estamos procesando tu solicitud..."', 'Soporte', '2025-12-19 13:09:30'),
	(32, 17, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 13:09:30'),
	(33, 17, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Soporte', '2025-12-19 13:09:31'),
	(34, 18, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 13:09:31'),
	(35, 19, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2025-12-19 17:20:23'),
	(36, 19, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2025-12-19 17:30:16'),
	(37, 19, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2025-12-19 17:30:19'),
	(38, 17, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2025-12-19 17:42:34'),
	(39, 20, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2026-01-14 20:32:46'),
	(40, 20, 'Respuesta agregada', NULL, NULL, 'Soporte: "traigalo a la oficina de sistemas/mantenimiento pa..."', 'Soporte', '2026-01-14 20:37:29'),
	(41, 20, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2026-01-14 20:38:18'),
	(42, 21, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2026-01-14 20:41:25'),
	(43, 21, 'Respuesta agregada', NULL, NULL, 'Soporte: "No lo se, pareces veneco"', 'Soporte', '2026-01-14 20:42:23'),
	(44, 21, 'Cerrado', 'Abierto', 'Cerrado', NULL, 'Usuario', '2026-01-14 20:54:28'),
	(45, 21, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2026-01-14 20:55:06'),
	(46, 21, 'Respuesta agregada', NULL, NULL, 'Soporte: "xD\nayuda ctm"', 'Soporte', '2026-01-30 19:18:35'),
	(47, 21, 'Respuesta agregada', NULL, NULL, 'Fabian Andres  : "ayudame"', 'Fabian Andres  ', '2026-01-30 19:18:46'),
	(49, 20, 'Reabierto', 'Cerrado', 'Abierto', NULL, 'Usuario', '2026-01-31 01:02:25'),
	(50, 21, 'Editado', 'Abierto', 'Abierto', 'Datos actualizados', 'Usuario', '2026-01-31 01:02:32'),
	(51, 21, 'Respuesta agregada', NULL, NULL, 'Soporte: "ps muerase"', 'Soporte', '2026-01-31 01:02:43'),
	(52, 21, 'Respuesta editada', NULL, NULL, 'Comentario de Soporte fue editado', 'Soporte', '2026-01-31 01:02:59'),
	(53, 21, 'Respuesta editada', NULL, NULL, 'Comentario de Soporte fue editado', 'Soporte', '2026-01-31 01:03:08'),
	(54, 21, 'Editado', 'Abierto', 'Abierto', 'Datos actualizados', 'Usuario', '2026-01-31 01:03:26'),
	(55, 23, 'Creado', NULL, 'Abierto', NULL, 'Sistema', '2026-01-31 01:20:51');

-- Dumping structure for table SICFOR.transacciones
CREATE TABLE IF NOT EXISTS `transacciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fecha` date NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `estado` enum('Pendiente','Aprobado','Rechazado') DEFAULT 'Pendiente',
  `metodo_pago_id` int DEFAULT NULL,
  `numero_operacion` varchar(50) NOT NULL,
  `comprobante_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_operacion` (`numero_operacion`),
  KEY `metodo_pago_id` (`metodo_pago_id`),
  KEY `idx_transacciones_usuario` (`usuario_id`),
  KEY `idx_transacciones_fecha` (`fecha`),
  KEY `idx_transacciones_estado` (`estado`),
  CONSTRAINT `transacciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transacciones_ibfk_2` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.transacciones: ~3 rows (approximately)
INSERT INTO `transacciones` (`id`, `usuario_id`, `fecha`, `monto`, `concepto`, `estado`, `metodo_pago_id`, `numero_operacion`, `comprobante_url`, `created_at`, `updated_at`) VALUES
	(1, 1, '2025-12-19', 500000.00, 'Matrícula 2024 - Primer Semestre', 'Aprobado', 2, 'OP2024001', NULL, '2025-12-19 20:41:00', '2025-12-19 20:41:00'),
	(2, 1, '2025-12-19', 200000.00, 'Cuota mensualidad Enero', 'Aprobado', 3, 'OP2024002', NULL, '2025-12-19 20:41:00', '2025-12-19 20:41:00'),
	(3, 1, '2025-12-18', 150000.00, 'Material didáctico', 'Pendiente', 1, 'OP2024003', NULL, '2025-12-19 20:41:00', '2025-12-19 20:41:00');

-- Dumping structure for table SICFOR.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','instructor','student','supervisor','empleado') NOT NULL,
  `activo` tinyint DEFAULT '1',
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `documento_identidad` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` enum('active','inactive') NOT NULL DEFAULT 'active',
  `foto_url` varchar(255) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `reset_code` varchar(10) DEFAULT NULL,
  `reset_expira` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `documento_identidad` (`documento_identidad`),
  KEY `email_2` (`email`),
  KEY `rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.usuarios: ~5 rows (approximately)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `contraseña`, `rol`, `activo`, `creado_en`, `actualizado_en`, `documento_identidad`, `telefono`, `estado`, `foto_url`, `departamento`, `ubicacion`, `fecha_registro`, `ultimo_acceso`, `reset_code`, `reset_expira`) VALUES
	(1, 'Juan Pérez Gómez', 'juan.perez@sicfor.edu', '$2b$10$bsTbV9YRvowWtOL4EIpKguO5XxZ0aMkiZ7ys0PeDRU0o9AeeS5Qoa', 'admin', 1, '2025-12-18 12:55:33', '2025-12-19 19:08:52', '1234567-8', '+57 311 223 3445', 'active', NULL, 'Administración', 'Sibundoy, Putumayo', '2025-12-18 12:55:33', '2025-12-18 15:02:14', NULL, NULL),
	(2, 'Ana Arango', 'ana.lopez@sicfor.edu', '$2b$10$bsTbV9YRvowWtOL4EIpKguO5XxZ0aMkiZ7ys0PeDRU0o9AeeS5Qoa', 'instructor', 1, '2025-12-18 12:55:33', '2025-12-19 03:14:33', '9876543-2', '+57 310 445 5667', 'active', NULL, 'Docencia', 'Mocoa, Putumayo', '2025-12-18 12:55:33', '2025-12-18 14:49:29', NULL, NULL),
	(3, 'Luis Gómez Torres', 'luis.gomez@sicfor.edu', '$2b$10$bsTbV9YRvowWtOL4EIpKguO5XxZ0aMkiZ7ys0PeDRU0o9AeeS5Qoa', 'student', 1, '2025-12-18 12:55:33', '2025-12-18 12:55:33', '5551234-5', '+57 312 887 7889', 'inactive', NULL, 'Estudiantes', 'Pasto, Nariño', '2025-12-18 12:55:33', NULL, NULL, NULL),
	(4, 'María', 'maria.rodriguez@sicfor.edu', '$2b$10$bsTbV9YRvowWtOL4EIpKguO5XxZ0aMkiZ7ys0PeDRU0o9AeeS5Qoa', 'student', 1, '2025-12-18 12:55:33', '2025-12-19 03:06:20', '7778889-1', '+57 315 889 9001', 'active', NULL, 'Estudiantes', 'Ipiales, Nariño', '2025-12-18 12:55:33', '2025-12-18 14:48:42', NULL, NULL),
	(5, 'Camilo Zambrano', 'zambranokevin888@gmail.com', '$2b$10$U8L8TdipToqr7HdcbuAri..5M0KzDuwvdaeQEZ3J.FFhea77sbm4.', 'student', 1, '2025-12-19 02:21:14', '2025-12-19 20:29:04', '18203847', '+573203286076', 'active', '', 'EST. Sistemas', 'Villagarzon', '2025-12-19 02:21:14', NULL, '743273', '2025-12-19 15:44:07'),
	(6, 'juaan pepe', 'juan.safd@gmail.com', '$2b$10$a0nUuwkAtGjbd97GCxFqK.IiYVEnvpHgwSD7RPNA2TofqvwJ3KLeC', 'student', 1, '2025-12-19 22:55:35', '2025-12-19 22:55:35', '122143432', '+573203286076', 'active', '', 'EST. Sistemas', 'Villagarzon', '2025-12-19 22:55:35', NULL, NULL, NULL);

-- Dumping structure for table SICFOR.usuario_rol
CREATE TABLE IF NOT EXISTS `usuario_rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `rol_id` int NOT NULL,
  `creado_en` datetime NOT NULL,
  `actualizado_en` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_usuario_rol` (`usuario_id`,`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table SICFOR.usuario_rol: ~0 rows (approximately)
INSERT INTO `usuario_rol` (`id`, `usuario_id`, `rol_id`, `creado_en`, `actualizado_en`) VALUES
	(1, 3, 4, '2025-12-19 13:09:44', '2025-12-19 13:09:44');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
