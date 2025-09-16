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
    return Inertia::render('welcome');
})->name('inicio');

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
});

// Incluir archivos de rutas específicas
require __DIR__.'/auth.php';           // Rutas de autenticación
require __DIR__.'/settings.php';       // Rutas de configuración
require __DIR__.'/convocatorias.php';  // Rutas del sistema de convocatorias
