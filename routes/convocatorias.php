<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas de Convocatorias
|--------------------------------------------------------------------------
|
| Aquí se definen las rutas relacionadas con el sistema de convocatorias
| docentes. Incluye tanto rutas públicas como administrativas.
|
*/

// Rutas públicas para docentes
Route::prefix('convocatorias-publicas')->name('convocatorias.')->group(function () {

    // Vista principal de convocatorias (página pública)
    Route::get('/', function () {
        return Inertia::render('convocatorias/index');
    })->name('public.index');

    // Detalle de una convocatoria específica
    Route::get('/{convocatoria}', function ($convocatoria) {
        return Inertia::render('convocatorias/detalle', [
            'convocatoria_id' => $convocatoria
        ]);
    })->name('detalle');

    // Plazas de una convocatoria
    Route::get('/{convocatoria}/plazas', function ($convocatoria) {
        return Inertia::render('convocatorias/plazas', [
            'convocatoria_id' => $convocatoria
        ]);
    })->name('plazas');

    // Detalle de una plaza específica
    Route::get('/{convocatoria}/plazas/{plaza}', function ($convocatoria, $plaza) {
        return Inertia::render('convocatorias/plaza-detalle', [
            'convocatoria_id' => $convocatoria,
            'plaza_id' => $plaza
        ]);
    })->name('plaza.detalle');
});

// Rutas para docentes autenticados
Route::middleware(['auth', 'verified'])->group(function () {

    // Panel del docente
    Route::prefix('mi-cuenta')->name('docente.')->group(function () {

        // Dashboard del docente
        Route::get('/', function () {
            return Inertia::render('docente/dashboard');
        })->name('dashboard');

        // Perfil del docente
        Route::get('/perfil', function () {
            return Inertia::render('docente/perfil');
        })->name('perfil');

        // Mis postulaciones
        Route::get('/postulaciones', function () {
            return Inertia::render('docente/postulaciones');
        })->name('postulaciones');

        // Recomendaciones de IA
        Route::get('/recomendaciones', function () {
            return Inertia::render('docente/recomendaciones');
        })->name('recomendaciones');

        // Postular a una plaza
        Route::post('/postular/{plaza}', function ($plaza) {
            // Lógica de postulación
        })->name('postular');

        // Cancelar postulación
        Route::delete('/postulaciones/{postulacion}', function ($postulacion) {
            // Lógica para cancelar postulación
        })->name('cancelar-postulacion');
    });
});

// Rutas administrativas (solo para administradores de UGEL)
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard administrativo
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Gestión de convocatorias
    Route::prefix('convocatorias')->name('convocatorias.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/convocatorias/index');
        })->name('index');

        Route::get('/crear', function () {
            return Inertia::render('admin/convocatorias/crear');
        })->name('crear');

        Route::post('/', function () {
            // Lógica para crear convocatoria
        })->name('store');

        Route::get('/{convocatoria}/editar', function ($convocatoria) {
            return Inertia::render('admin/convocatorias/editar', [
                'convocatoria_id' => $convocatoria
            ]);
        })->name('editar');

        Route::put('/{convocatoria}', function ($convocatoria) {
            // Lógica para actualizar convocatoria
        })->name('update');

        Route::delete('/{convocatoria}', function ($convocatoria) {
            // Lógica para eliminar convocatoria
        })->name('destroy');

        // Gestión de plazas dentro de una convocatoria
        Route::prefix('{convocatoria}/plazas')->name('plazas.')->group(function () {
            Route::get('/', function ($convocatoria) {
                return Inertia::render('admin/plazas/index', [
                    'convocatoria_id' => $convocatoria
                ]);
            })->name('index');

            Route::get('/crear', function ($convocatoria) {
                return Inertia::render('admin/plazas/crear', [
                    'convocatoria_id' => $convocatoria
                ]);
            })->name('crear');

            Route::post('/', function ($convocatoria) {
                // Lógica para crear plaza
            })->name('store');

            Route::get('/{plaza}/editar', function ($convocatoria, $plaza) {
                return Inertia::render('admin/plazas/editar', [
                    'convocatoria_id' => $convocatoria,
                    'plaza_id' => $plaza
                ]);
            })->name('editar');

            Route::put('/{plaza}', function ($convocatoria, $plaza) {
                // Lógica para actualizar plaza
            })->name('update');

            Route::delete('/{plaza}', function ($convocatoria, $plaza) {
                // Lógica para eliminar plaza
            })->name('destroy');
        });
    });

    // Gestión de postulaciones
    Route::prefix('postulaciones')->name('postulaciones.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/postulaciones/index');
        })->name('index');

        Route::get('/{postulacion}', function ($postulacion) {
            return Inertia::render('admin/postulaciones/detalle', [
                'postulacion_id' => $postulacion
            ]);
        })->name('detalle');

        Route::put('/{postulacion}/aprobar', function ($postulacion) {
            // Lógica para aprobar postulación
        })->name('aprobar');

        Route::put('/{postulacion}/rechazar', function ($postulacion) {
            // Lógica para rechazar postulación
        })->name('rechazar');
    });

    // Gestión de docentes
    Route::prefix('docentes')->name('docentes.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/docentes/index');
        })->name('index');

        Route::get('/{docente}', function ($docente) {
            return Inertia::render('admin/docentes/detalle', [
                'docente_id' => $docente
            ]);
        })->name('detalle');

        Route::put('/{docente}/activar', function ($docente) {
            // Lógica para activar docente
        })->name('activar');

        Route::put('/{docente}/desactivar', function ($docente) {
            // Lógica para desactivar docente
        })->name('desactivar');
    });

    // Reportes y estadísticas
    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/reportes/index');
        })->name('index');

        Route::get('/convocatorias', function () {
            return Inertia::render('admin/reportes/convocatorias');
        })->name('convocatorias');

        Route::get('/postulaciones', function () {
            return Inertia::render('admin/reportes/postulaciones');
        })->name('postulaciones');

        Route::get('/docentes', function () {
            return Inertia::render('admin/reportes/docentes');
        })->name('docentes');
    });

    // Configuración del sistema
    Route::prefix('configuracion')->name('configuracion.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/configuracion/index');
        })->name('index');

        Route::get('/usuarios', function () {
            return Inertia::render('admin/configuracion/usuarios');
        })->name('usuarios');

        Route::get('/sistema', function () {
            return Inertia::render('admin/configuracion/sistema');
        })->name('sistema');
    });
});
