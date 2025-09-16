<?php

namespace App\Http\Middleware;

use App\Http\Helpers\TranslationHelper;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Obtener el idioma actual
        $currentLocale = App::getLocale();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // Mensajes flash para notificaciones
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],

            // Datos específicos para el Sistema de Convocatorias Docentes
            'app' => [
                'name' => config('app.name'),
                'locale' => $currentLocale,
                'timezone' => config('app.timezone'),
                'version' => '1.0.0',
            ],

            // Traducciones para el frontend
            'translations' => TranslationHelper::getTranslationsForFrontend($currentLocale),
            'convocatorias_translations' => TranslationHelper::getConvocatoriasTranslations($currentLocale),

            // Configuración regional para Perú
            'regional' => [
                'currency' => 'PEN',
                'currency_symbol' => 'S/',
                'date_format' => 'd/m/Y',
                'time_format' => 'H:i',
                'country' => 'Perú',
                'region' => 'Lambayeque',
                'city' => 'Chiclayo',
            ],

            // Configuración de la aplicación
            'config' => [
                'max_file_upload' => '10MB',
                'supported_file_types' => ['pdf', 'doc', 'docx', 'jpg', 'png'],
                'pagination_per_page' => 15,
            ],
        ];
    }
}
