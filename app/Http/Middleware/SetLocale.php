<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * Configura automáticamente el idioma español para la aplicación
     * del Sistema de Convocatorias Docentes UGEL Chiclayo.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Idiomas soportados
        $supportedLocales = ['es', 'en'];

        // Obtener idioma preferido del usuario
        $locale = $this->getPreferredLocale($request, $supportedLocales);

        // Configurar el idioma de la aplicación
        App::setLocale($locale);

        // Configurar el idioma para Carbon (fechas)
        if ($locale === 'es') {
            \Carbon\Carbon::setLocale('es');
        }

        // Guardar el idioma en la sesión para futuras peticiones
        Session::put('locale', $locale);

        return $next($request);
    }

    /**
     * Determina el idioma preferido del usuario
     *
     * @param Request $request
     * @param array $supportedLocales
     * @return string
     */
    private function getPreferredLocale(Request $request, array $supportedLocales): string
    {
        // 1. Verificar si hay un idioma en la URL (parámetro 'lang')
        if ($request->has('lang') && in_array($request->get('lang'), $supportedLocales)) {
            return $request->get('lang');
        }

        // 2. Verificar si hay un idioma guardado en la sesión
        if (Session::has('locale') && in_array(Session::get('locale'), $supportedLocales)) {
            return Session::get('locale');
        }

        // 3. Verificar las preferencias del navegador
        $browserLocale = $request->getPreferredLanguage($supportedLocales);
        if ($browserLocale && in_array($browserLocale, $supportedLocales)) {
            return $browserLocale;
        }

        // 4. Para el sistema de UGEL Chiclayo, por defecto usar español
        return 'es';
    }
}
