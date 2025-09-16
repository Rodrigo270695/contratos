-- =====================================================
-- SISTEMA DE CONVOCATORIAS DOCENTES UGEL LAMBAYEQUE
-- Base de Datos Simplificada para Proyecto de Tesis
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- =====================================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- =====================================================

-- Tabla: Regiones (simplificada)
CREATE TABLE regions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Nombre de la región',
    code VARCHAR(10) UNIQUE NOT NULL COMMENT 'Código único',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: UGELs
CREATE TABLE ugels (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    region_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL COMMENT 'Nombre de la UGEL',
    code VARCHAR(15) UNIQUE NOT NULL COMMENT 'Código único',
    address TEXT COMMENT 'Dirección',
    phone VARCHAR(15) COMMENT 'Teléfono',
    email VARCHAR(100) COMMENT 'Email',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT,
    INDEX idx_ugels_region (region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Distritos
CREATE TABLE districts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ugel_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'Nombre del distrito',
    code VARCHAR(10) UNIQUE NOT NULL COMMENT 'Código único',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ugel_id) REFERENCES ugels(id) ON DELETE RESTRICT,
    INDEX idx_districts_ugel (ugel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Instituciones Educativas
CREATE TABLE institutions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    district_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL COMMENT 'Nombre de la IE',
    code VARCHAR(20) UNIQUE NOT NULL COMMENT 'Código modular',
    level ENUM('inicial', 'primaria', 'secundaria') NOT NULL COMMENT 'Nivel educativo',
    modality ENUM('EBR', 'EBA', 'EBE') NOT NULL DEFAULT 'EBR' COMMENT 'Modalidad',
    address TEXT COMMENT 'Dirección',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE RESTRICT,
    INDEX idx_institutions_district (district_id),
    INDEX idx_institutions_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Convocatorias
CREATE TABLE convocatorias (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL COMMENT 'Título de la convocatoria',
    description TEXT COMMENT 'Descripción',
    year YEAR NOT NULL COMMENT 'Año',
    process_type ENUM('contratacion', 'nombramiento') NOT NULL COMMENT 'Tipo de proceso',
    ugel_id BIGINT UNSIGNED NOT NULL COMMENT 'UGEL responsable',

    -- Fechas importantes
    start_date DATE NOT NULL COMMENT 'Fecha de inicio',
    end_date DATE NOT NULL COMMENT 'Fecha de fin',
    registration_start DATETIME NOT NULL COMMENT 'Inicio inscripciones',
    registration_end DATETIME NOT NULL COMMENT 'Fin inscripciones',

    -- Estado
    status ENUM('draft', 'published', 'active', 'closed', 'cancelled') DEFAULT 'draft',
    total_plazas INT DEFAULT 0 COMMENT 'Total de plazas',

    created_by BIGINT UNSIGNED NOT NULL COMMENT 'Creado por',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ugel_id) REFERENCES ugels(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_convocatorias_ugel (ugel_id),
    INDEX idx_convocatorias_year (year),
    INDEX idx_convocatorias_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Plazas
CREATE TABLE plazas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    convocatoria_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de convocatoria',
    institution_id BIGINT UNSIGNED NOT NULL COMMENT 'IE donde está la plaza',

    -- Información de la plaza
    codigo_plaza VARCHAR(30) UNIQUE NOT NULL COMMENT 'Código de la plaza',
    cargo VARCHAR(150) NOT NULL COMMENT 'Nombre del cargo',
    nivel ENUM('inicial', 'primaria', 'secundaria') NOT NULL COMMENT 'Nivel educativo',
    especialidad VARCHAR(100) COMMENT 'Especialidad/área curricular',
    jornada ENUM('25', '30', '40') DEFAULT '30' COMMENT 'Horas de trabajo',

    -- Detalles
    vacantes INT DEFAULT 1 COMMENT 'Número de vacantes',
    motivo_vacante VARCHAR(200) NOT NULL COMMENT 'Motivo de la vacante',
    requisitos TEXT COMMENT 'Requisitos específicos',

    status ENUM('active', 'filled', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE RESTRICT,
    INDEX idx_plazas_convocatoria (convocatoria_id),
    INDEX idx_plazas_institution (institution_id),
    INDEX idx_plazas_nivel (nivel),
    INDEX idx_plazas_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Postulaciones
CREATE TABLE postulaciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'ID del docente postulante',
    plaza_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de la plaza',
    convocatoria_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de la convocatoria',

    -- Datos de postulación
    numero_postulacion VARCHAR(50) UNIQUE NOT NULL COMMENT 'Número único',
    fecha_postulacion DATETIME NOT NULL COMMENT 'Fecha de postulación',
    orden_preferencia TINYINT DEFAULT 1 COMMENT 'Orden de preferencia',

    -- Evaluación
    puntaje_final DECIMAL(5,2) DEFAULT 0 COMMENT 'Puntaje total',
    posicion_merito INT COMMENT 'Posición en orden de mérito',

    -- Estado
    status ENUM('postulado', 'evaluado', 'seleccionado', 'no_seleccionado', 'retirado') DEFAULT 'postulado',
    observaciones TEXT COMMENT 'Observaciones',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (plaza_id) REFERENCES plazas(id) ON DELETE RESTRICT,
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_user_plaza (user_id, plaza_id),
    INDEX idx_postulaciones_user (user_id),
    INDEX idx_postulaciones_plaza (plaza_id),
    INDEX idx_postulaciones_convocatoria (convocatoria_id),
    INDEX idx_postulaciones_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Evaluaciones (simplificada)
CREATE TABLE evaluaciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de la postulación',

    -- Puntajes por etapa (simplificado)
    puntaje_prueba_nacional DECIMAL(5,2) DEFAULT 0 COMMENT 'Puntaje prueba nacional',
    puntaje_subprueba DECIMAL(5,2) DEFAULT 0 COMMENT 'Puntaje subprueba',
    puntaje_bonificacion DECIMAL(5,2) DEFAULT 0 COMMENT 'Puntaje bonificación',
    puntaje_total DECIMAL(5,2) DEFAULT 0 COMMENT 'Puntaje total',

    -- Estado
    estado_evaluacion ENUM('pendiente', 'en_proceso', 'completada') DEFAULT 'pendiente',
    fecha_evaluacion DATE COMMENT 'Fecha de evaluación',

    observaciones TEXT COMMENT 'Observaciones del evaluador',
    evaluado_por VARCHAR(200) COMMENT 'Nombre del evaluador',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE CASCADE,
    UNIQUE KEY uk_postulacion_evaluacion (postulacion_id),
    INDEX idx_evaluaciones_postulacion (postulacion_id),
    INDEX idx_evaluaciones_estado (estado_evaluacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Documentos (simplificada)
CREATE TABLE documentos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    postulacion_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de la postulación',

    -- Información del documento
    tipo_documento ENUM('dni', 'cv', 'titulo', 'certificados', 'otros') NOT NULL COMMENT 'Tipo de documento',
    nombre_original VARCHAR(255) NOT NULL COMMENT 'Nombre original',
    nombre_archivo VARCHAR(255) NOT NULL COMMENT 'Nombre del archivo almacenado',
    ruta_archivo VARCHAR(500) NOT NULL COMMENT 'Ruta del archivo',
    tamaño_archivo INT NOT NULL COMMENT 'Tamaño en bytes',

    -- Estado
    estado ENUM('subido', 'revisado', 'aprobado', 'rechazado') DEFAULT 'subido',
    observaciones TEXT COMMENT 'Observaciones del revisor',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (postulacion_id) REFERENCES postulaciones(id) ON DELETE CASCADE,
    INDEX idx_documentos_postulacion (postulacion_id),
    INDEX idx_documentos_tipo (tipo_documento),
    INDEX idx_documentos_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Recomendaciones IA (simplificada)
CREATE TABLE recomendaciones_ia (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'ID del usuario',
    plaza_id BIGINT UNSIGNED NOT NULL COMMENT 'ID de la plaza recomendada',

    -- Métricas de recomendación
    puntuacion_compatibilidad DECIMAL(3,2) NOT NULL COMMENT 'Puntuación 0-1',
    nivel_confianza ENUM('baja', 'media', 'alta') NOT NULL COMMENT 'Nivel de confianza',

    -- Factores principales
    coincidencia_especialidad BOOLEAN DEFAULT FALSE COMMENT 'Coincide especialidad',
    coincidencia_nivel BOOLEAN DEFAULT FALSE COMMENT 'Coincide nivel educativo',
    distancia_km DECIMAL(5,2) COMMENT 'Distancia en km',
    experiencia_compatible BOOLEAN DEFAULT FALSE COMMENT 'Experiencia compatible',

    -- Estado
    estado ENUM('pendiente', 'vista', 'aplicada', 'descartada') DEFAULT 'pendiente',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL COMMENT 'Fecha de expiración',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plaza_id) REFERENCES plazas(id) ON DELETE CASCADE,
    INDEX idx_recomendaciones_user (user_id),
    INDEX idx_recomendaciones_puntuacion (puntuacion_compatibilidad DESC),
    INDEX idx_recomendaciones_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Notificaciones (simplificada)
CREATE TABLE notificaciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'ID del usuario destinatario',

    -- Contenido
    tipo ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
    titulo VARCHAR(200) NOT NULL COMMENT 'Título de la notificación',
    mensaje TEXT NOT NULL COMMENT 'Mensaje',

    -- Estado
    leida BOOLEAN DEFAULT FALSE COMMENT 'Si fue leída',
    fecha_leida TIMESTAMP NULL COMMENT 'Fecha de lectura',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notificaciones_user (user_id),
    INDEX idx_notificaciones_leida (leida),
    INDEX idx_notificaciones_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar región Lambayeque
INSERT INTO regions (name, code) VALUES ('Lambayeque', 'LAM');

-- Insertar UGEL Lambayeque
INSERT INTO ugels (region_id, name, code, address, phone, email)
SELECT id, 'UGEL Lambayeque', 'UGEL-LAM', 'Av. Bolognesi 512, Lambayeque', '074-282156', 'ugel.lambayeque@minedu.gob.pe'
FROM regions WHERE code = 'LAM';

-- Insertar algunos distritos principales
INSERT INTO districts (ugel_id, name, code)
SELECT id, 'Lambayeque', 'LAMB'
FROM ugels WHERE code = 'UGEL-LAM';

INSERT INTO districts (ugel_id, name, code)
SELECT id, 'Chiclayo', 'CHIC'
FROM ugels WHERE code = 'UGEL-LAM';

INSERT INTO districts (ugel_id, name, code)
SELECT id, 'Ferreñafe', 'FERR'
FROM ugels WHERE code = 'UGEL-LAM';

-- Insertar algunas instituciones educativas de ejemplo
INSERT INTO institutions (district_id, name, code, level, modality, address)
SELECT d.id, 'I.E. San José', '14001', 'primaria', 'EBR', 'Calle Lima 123'
FROM districts d WHERE d.code = 'LAMB';

INSERT INTO institutions (district_id, name, code, level, modality, address)
SELECT d.id, 'I.E. María Auxiliadora', '14002', 'secundaria', 'EBR', 'Av. Bolognesi 456'
FROM districts d WHERE d.code = 'CHIC';

INSERT INTO institutions (district_id, name, code, level, modality, address)
SELECT d.id, 'I.E. Los Angelitos', '14003', 'inicial', 'EBR', 'Jr. Tacna 789'
FROM districts d WHERE d.code = 'FERR';

-- =====================================================
-- MODIFICACIONES A LA TABLA USERS EXISTENTE
-- =====================================================

-- Agregar campos faltantes si no existen
ALTER TABLE users
ADD COLUMN IF NOT EXISTS institution_id BIGINT UNSIGNED NULL COMMENT 'IE de trabajo del docente' AFTER interest_areas,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL COMMENT 'Último login' AFTER institution_id;

-- Agregar foreign key para institución
ALTER TABLE users
ADD CONSTRAINT fk_users_institution
FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL;

-- Agregar índices
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_institution (institution_id);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_user_type (user_type);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_status (status);

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- RESUMEN DEL ESQUEMA SIMPLIFICADO
-- =====================================================

/*
TABLAS CREADAS (11 tablas principales):

1. ESTRUCTURA ORGANIZACIONAL (4 tablas):
   - regions: Regiones del Perú
   - ugels: Unidades de Gestión Educativa Local
   - districts: Distritos por UGEL
   - institutions: Instituciones Educativas

2. PROCESO DE CONVOCATORIAS (3 tablas):
   - convocatorias: Procesos de convocatoria
   - plazas: Plazas específicas por convocatoria
   - postulaciones: Postulaciones de docentes

3. EVALUACIÓN Y DOCUMENTOS (2 tablas):
   - evaluaciones: Evaluaciones simplificadas
   - documentos: Documentos subidos

4. SISTEMA INTELIGENTE (2 tablas):
   - recomendaciones_ia: Recomendaciones del sistema IA
   - notificaciones: Notificaciones a usuarios

CARACTERÍSTICAS:
- ✅ Normalización 3FN
- ✅ Foreign Keys y constraints
- ✅ Índices optimizados
- ✅ Datos iniciales incluidos
- ✅ Compatible con tabla users existente
- ✅ Enfocado en funcionalidad de tesis
- ✅ Fácil de entender y mantener

TOTAL: 11 tablas + extensión de users
COMPLEJIDAD: Media - apropiada para tesis
FUNCIONALIDAD: Completa para demostrar el sistema
*/
