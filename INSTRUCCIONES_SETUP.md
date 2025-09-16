# 🚀 Instrucciones de Setup - Sistema de Convocatorias Docentes UGEL Chiclayo

## 📋 Configuración Inicial

### 1. Ejecutar Migraciones y Seeders

```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders (crea usuarios de prueba)
php artisan db:seed
```

### 2. Usuarios Creados Automáticamente

#### 👨‍💼 **Usuario Administrador**
- **DNI:** `12345678`
- **Contraseña:** `admin123`
- **Email:** `admin@ugel-chiclayo.gob.pe`
- **Acceso:** Panel administrativo completo

#### 👨‍🏫 **Usuarios Docentes de Prueba**

1. **María Elena García Rodríguez**
   - **DNI:** `11111111`
   - **Contraseña:** `docente123`
   - **Especialidad:** Educación Primaria

2. **Carlos Alberto Mendoza Silva**
   - **DNI:** `22222222`
   - **Contraseña:** `docente123`
   - **Especialidad:** Matemáticas - Secundaria

3. **Ana Sofía López Vásquez**
   - **DNI:** `33333333`
   - **Contraseña:** `docente123`
   - **Especialidad:** Comunicación - Secundaria

## 🔐 Acceso al Sistema

### Login Administrador
1. Ir a `/login`
2. Ingresar DNI: `12345678`
3. Ingresar contraseña: `admin123`
4. Será redirigido al panel administrativo

### Login Docente
1. Ir a `/login`
2. Usar cualquier DNI de los docentes de prueba
3. Contraseña: `docente123`
4. Será redirigido al dashboard de docente

## ⚠️ Importante para Producción

### Cambiar credenciales por defecto:
- [ ] Cambiar DNI del administrador
- [ ] Cambiar contraseña del administrador
- [ ] Eliminar usuarios docentes de prueba
- [ ] Configurar email real para notificaciones

### Comandos para limpiar datos de prueba:
```bash
# Eliminar usuarios de prueba (mantener solo admin)
php artisan tinker
User::where('user_type', 'docente')->delete();
```

## 🎯 Próximos Pasos

1. **Crear migraciones para convocatorias y plazas**
2. **Implementar CRUD de convocatorias en el panel admin**
3. **Desarrollar vista pública de convocatorias**
4. **Integrar sistema de recomendaciones IA**

## 🔧 Comandos Útiles

```bash
# Resetear base de datos y seeders
php artisan migrate:fresh --seed

# Solo ejecutar seeders
php artisan db:seed

# Ejecutar seeder específico
php artisan db:seed --class=AdminUserSeeder

# Verificar usuarios creados
php artisan tinker
User::all(['dni', 'first_name', 'last_name', 'user_type', 'status']);
```

---

**Sistema desarrollado para UGEL Chiclayo - Tesis Universitaria**
