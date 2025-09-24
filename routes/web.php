<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Web - Sistema de Convocatorias Docentes UGEL Chiclayo
|--------------------------------------------------------------------------
|
| Aquí se registran las rutas web para la aplicación. Estas rutas son
| cargadas por el RouteServiceProvider y todas serán asignadas al
| grupo de middleware "web".
|
*/

// Página principal - Vista de convocatorias públicas
Route::get('/', function () {
    // Obtener convocatorias activas y publicadas
    $convocatorias = \App\Models\Convocatoria::whereIn('status', ['published', 'active'])
        ->with(['ugel.region', 'creator'])
        ->withCount('plazas')
        ->orderByDesc('created_at')
        ->limit(6)
        ->get()
        ->map(function ($convocatoria) {
            // Calcular el total real de vacantes de las plazas creadas
            $totalVacantesReales = \App\Models\Plaza::where('convocatoria_id', $convocatoria->id)
                ->where('status', 'active')
                ->sum('vacantes');

            $convocatoria->total_vacantes_reales = $totalVacantesReales;
            return $convocatoria;
        });

    // Estadísticas generales
    $estadisticas = [
        'convocatorias_activas' => \App\Models\Convocatoria::whereIn('status', ['published', 'active'])->count(),
        'total_vacantes_creadas' => \App\Models\Plaza::whereHas('convocatoria', function ($query) {
            $query->whereIn('status', ['published', 'active']);
        })->where('status', 'active')->sum('vacantes'),
        'ugels_participantes' => \App\Models\Convocatoria::whereIn('status', ['published', 'active'])
            ->distinct('ugel_id')
            ->count('ugel_id'),
    ];

    return Inertia::render('welcome', [
        'convocatorias' => $convocatorias,
        'estadisticas' => $estadisticas,
    ]);
})->name('inicio');

// Vista pública de convocatoria específica
Route::get('/convocatoria/{convocatoria}', function (\App\Models\Convocatoria $convocatoria) {
    // Solo mostrar convocatorias publicadas o activas
    if (!in_array($convocatoria->status, ['published', 'active'])) {
        abort(404);
    }

    // Cargar convocatoria con relaciones
    $convocatoria->load(['ugel.region', 'creator']);

    // Obtener plazas de la convocatoria con sus relaciones
    $plazas = \App\Models\Plaza::where('convocatoria_id', $convocatoria->id)
        ->where('status', 'active')
        ->with(['institution.district.ugel.region'])
        ->orderBy('codigo_plaza')
        ->get()
        ->map(function ($plaza) {
            // Calcular postulaciones para esta plaza
            $plaza->total_postulaciones = \App\Models\Postulacion::where('plaza_id', $plaza->id)
                ->whereIn('status', ['postulado', 'evaluado'])
                ->count();

            $plaza->vacantes_ocupadas = \App\Models\Postulacion::where('plaza_id', $plaza->id)
                ->where('status', 'seleccionado')
                ->count();

            $plaza->vacantes_disponibles = max(0, $plaza->vacantes - $plaza->vacantes_ocupadas);

            return $plaza;
        });

    return Inertia::render('convocatoria-publica', [
        'convocatoria' => $convocatoria,
        'plazas' => $plazas,
    ]);
})->name('convocatoria.publica');

// Redirección de compatibilidad
Route::get('/home', function () {
    return redirect()->route('inicio');
})->name('home');


// Dashboard administrativo (solo para administradores)
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Gestión de usuarios
    Route::resource('usuarios', App\Http\Controllers\UserController::class)->except(['create', 'edit']);

    // Gestión de regiones
    Route::resource('regiones', App\Http\Controllers\RegionController::class)->except(['create', 'edit']);

    // Gestión de UGELs
    Route::resource('ugels', App\Http\Controllers\UgelController::class)->except(['create', 'edit']);

    // Gestión de distritos
    Route::resource('districts', App\Http\Controllers\DistrictController::class)->except(['create', 'edit']);

    // Gestión de instituciones educativas
    Route::resource('institutions', App\Http\Controllers\InstitutionController::class)->except(['create', 'edit']);

    // Gestión de convocatorias
    Route::resource('convocatorias', App\Http\Controllers\ConvocatoriaController::class)->except(['create', 'edit']);

    // Gestión de plazas
    Route::resource('plazas', App\Http\Controllers\PlazaController::class)->except(['create', 'edit']);
});

// Rutas para docentes autenticados
Route::middleware(['auth', 'verified'])->group(function () {
    // Perfil de docente para sistema de IA
    Route::get('/mi-perfil-docente', [App\Http\Controllers\TeacherProfileController::class, 'show'])->name('teacher-profile.show');
    Route::post('/mi-perfil-docente', [App\Http\Controllers\TeacherProfileController::class, 'update'])->name('teacher-profile.update');
    Route::get('/api/teacher-profile/stats', [App\Http\Controllers\TeacherProfileController::class, 'getStats'])->name('teacher-profile.stats');
});

// Incluir archivos de rutas específicas
require __DIR__.'/auth.php';           // Rutas de autenticación
require __DIR__.'/settings.php';       // Rutas de configuración
require __DIR__.'/convocatorias.php';  // Rutas del sistema de convocatorias
