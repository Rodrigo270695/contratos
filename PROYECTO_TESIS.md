# Sistema de Convocatorias Docentes - UGEL Chiclayo

## 📋 Información General del Proyecto

### Descripción
Sistema web de gestión y consulta de convocatorias para plazas docentes en la UGEL (Unidad de Gestión Educativa Local) de Chiclayo, Perú. Este proyecto es desarrollado como **tesis universitaria** y combina funcionalidades administrativas con un sistema de recomendaciones basado en Inteligencia Artificial.

### Objetivo Principal
Crear una plataforma que facilite la gestión de convocatorias docentes y proporcione recomendaciones personalizadas a los postulantes mediante IA.

---

## 🎯 Funcionalidades Principales

### 1. Parte Administrativa
- **Gestión de Convocatorias**: Subir, editar, eliminar y administrar convocatorias de plazas docentes
- **Panel de Control**: Dashboard para administradores de UGEL
- **Gestión de Usuarios**: Administración de docentes registrados
- **Reportes y Estadísticas**: Análisis de postulaciones y convocatorias

### 2. Parte Informativa (Vista Pública)
- **Vista Welcome/Principal**: Página donde los docentes pueden consultar las convocatorias disponibles
- **Listado de Plazas**: Similar al formato mostrado en la imagen de referencia (convocatoriadetrabajo.com)
- **Filtros y Búsqueda**: Por región, nivel educativo, área, salario, etc.
- **Detalle de Convocatoria**: Información completa de cada plaza

### 3. Sistema de Recomendaciones con IA
- **Perfil del Docente**: Registro detallado del perfil profesional
- **Análisis de Historial**: Evaluación de postulaciones anteriores
- **Recomendaciones Personalizadas**: Sugerencias de plazas basadas en:
  - Especialización (Primaria, Secundaria, Inicial)
  - Área de conocimiento (Matemáticas, Comunicación, Ciencias, etc.)
  - Experiencia previa
  - Ubicación geográfica
  - Tipo de contrato preferido
  - Historial de postulaciones

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico Actual
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript + Inertia.js
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
- **Estilos**: Tailwind CSS 4.0
- **Componentes**: Radix UI
- **IA**: Por implementar (TensorFlow, Scikit-learn, o servicio cloud)

### Estado Actual del Proyecto
- ✅ Estructura base de Laravel configurada
- ✅ Sistema de autenticación completo
- ✅ UI moderna con componentes reutilizables
- ✅ Dashboard básico implementado
- ❌ **Pendiente**: Modelos y migraciones para convocatorias
- ❌ **Pendiente**: Sistema de gestión de plazas
- ❌ **Pendiente**: Implementación de IA
- ❌ **Pendiente**: Vista pública de convocatorias

---

## 📊 Estructura de Datos Propuesta

### Entidades Principales

#### 1. Convocatorias
```
- id
- titulo
- descripcion
- institucion (UGEL, Ministerio, Municipalidad, etc.)
- numero_convocatoria
- fecha_inicio
- fecha_fin
- salario
- ubicacion (región, provincia, distrito)
- tipo_contrato
- estado (activa, cerrada, suspendida)
- requisitos
- documentos_requeridos
- created_at, updated_at
```

#### 2. Plazas
```
- id
- convocatoria_id
- codigo_plaza
- cargo
- nivel_educativo (inicial, primaria, secundaria)
- area_conocimiento (matemáticas, comunicación, etc.)
- modalidad (presencial, virtual, semipresencial)
- jornada_laboral
- requisitos_especificos
- vacantes_disponibles
- estado
```

#### 3. Perfil Docente (extender tabla users)
```
- user_id
- dni
- telefono
- fecha_nacimiento
- nivel_educacion (título profesional, bachiller, etc.)
- especialidad_principal
- especialidades_secundarias (JSON)
- experiencia_anos
- certificaciones (JSON)
- ubicacion_preferida
- tipo_contrato_preferido
- disponibilidad_horaria
- cv_path
```

#### 4. Postulaciones
```
- id
- user_id
- plaza_id
- fecha_postulacion
- estado (pendiente, aceptada, rechazada)
- documentos_adjuntos (JSON)
- puntaje_obtenido
- observaciones
```

#### 5. Recomendaciones IA
```
- id
- user_id
- plaza_id
- score_recomendacion (0-100)
- factores_considerados (JSON)
- fecha_generada
- estado (mostrada, descartada, aplicada)
```

---

## 🤖 Sistema de Recomendaciones IA

### Algoritmo Propuesto
1. **Análisis del Perfil**: Procesamiento de datos del docente
2. **Matching de Competencias**: Comparación con requisitos de plazas
3. **Análisis de Historial**: Evaluación de postulaciones anteriores
4. **Scoring**: Cálculo de compatibilidad (0-100%)
5. **Ranking**: Ordenamiento por relevancia

### Factores de Recomendación
- **Especialización** (40%): Coincidencia área-perfil
- **Experiencia** (25%): Años y tipo de experiencia
- **Ubicación** (15%): Proximidad geográfica
- **Historial** (10%): Éxito en postulaciones previas
- **Disponibilidad** (10%): Horarios y modalidad

### Tecnologías IA a Considerar
- **Scikit-learn**: Para algoritmos de machine learning básicos
- **TensorFlow/PyTorch**: Para modelos más complejos
- **OpenAI API**: Para procesamiento de texto avanzado
- **Elasticsearch**: Para búsqueda semántica

---

## 🎨 Diseño de Interfaz

### Vista Pública (Docentes)
- **Homepage**: Listado de convocatorias con filtros
- **Detalle de Convocatoria**: Información completa y botón de postulación
- **Mi Perfil**: Gestión de datos personales y profesionales
- **Mis Postulaciones**: Historial y estado de aplicaciones
- **Recomendaciones**: Plazas sugeridas por IA

### Panel Administrativo (UGEL)
- **Dashboard**: Métricas y estadísticas generales
- **Gestión de Convocatorias**: CRUD completo
- **Gestión de Plazas**: Administración detallada
- **Reportes**: Análisis de postulaciones y tendencias
- **Usuarios**: Administración de docentes registrados

---

## 📈 Fases de Desarrollo

### Fase 1: Base de Datos y Modelos
- [ ] Crear migraciones para todas las entidades
- [ ] Implementar modelos Eloquent con relaciones
- [ ] Seeders con datos de prueba
- [ ] Validaciones y reglas de negocio

### Fase 2: Funcionalidad Básica
- [ ] CRUD de convocatorias (admin)
- [ ] Vista pública de convocatorias
- [ ] Sistema de registro y perfil de docentes
- [ ] Funcionalidad de postulación

### Fase 3: Sistema de Recomendaciones
- [ ] Implementar algoritmo básico de matching
- [ ] Integrar servicio de IA
- [ ] Dashboard de recomendaciones
- [ ] Métricas de efectividad

### Fase 4: Optimización y Despliegue
- [ ] Testing completo
- [ ] Optimización de rendimiento
- [ ] Documentación técnica
- [ ] Despliegue en producción

---

## 🎓 Aspectos de Tesis

### Objetivos Académicos
- Demostrar aplicación de tecnologías modernas en sector público
- Implementar sistema de IA para recomendaciones personalizadas
- Mejorar eficiencia en procesos de convocatorias docentes
- Análisis de datos para insights del sector educativo

### Métricas de Éxito
- Reducción de tiempo en búsqueda de plazas relevantes
- Aumento en tasa de postulaciones exitosas
- Mejora en satisfacción de usuarios (docentes y administradores)
- Optimización de procesos administrativos en UGEL

---

## 📝 Notas Importantes

### Contexto Peruano
- Adaptación a normativas del sector educativo peruano
- Integración con sistemas existentes de UGEL
- Consideración de realidades regionales (Chiclayo, Lambayeque)
- Cumplimiento de regulaciones de protección de datos

### Consideraciones Técnicas
- Escalabilidad para múltiples UGELs
- Seguridad en manejo de datos sensibles
- Accesibilidad para usuarios con diferentes niveles técnicos
- Optimización para conexiones de internet limitadas

---

## 🚀 Próximos Pasos Inmediatos

1. **Crear estructura de base de datos** con migraciones
2. **Implementar modelos Eloquent** con relaciones
3. **Desarrollar vista pública** de convocatorias
4. **Crear panel administrativo** básico
5. **Planificar integración de IA** para recomendaciones

---

*Documento creado: Septiembre 2025*
*Proyecto: Sistema de Convocatorias Docentes - UGEL Chiclayo*
*Tipo: Tesis Universitaria*
