<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Verifica que solo usuarios administradores puedan acceder
     * a las rutas administrativas del sistema de convocatorias.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Verificar que sea administrador
        if (Auth::user()->user_type !== 'admin') {
            // Redirigir a la página principal con mensaje de error
            return redirect()->route('inicio')->with('error', 'Acceso denegado. Solo administradores pueden acceder al panel administrativo.');
        }

        return $next($request);
    }
}
