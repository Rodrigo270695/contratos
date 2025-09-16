<?php

namespace App\Http\Helpers;

use Illuminate\Support\Facades\Lang;

/**
 * Helper para manejar traducciones en el Sistema de Convocatorias Docentes
 * UGEL Chiclayo
 */
class TranslationHelper
{
    /**
     * Obtiene todas las traducciones para el frontend
     *
     * @param string $locale
     * @return array
     */
    public static function getTranslationsForFrontend(string $locale = 'es'): array
    {
        $translations = [];

        // Archivos de traducción a incluir
        $translationFiles = [
            'auth',
            'validation',
            'app'
        ];

        foreach ($translationFiles as $file) {
            $translations[$file] = Lang::get($file, [], $locale);
        }

        return $translations;
    }

    /**
     * Obtiene traducciones específicas para el sistema de convocatorias
     *
     * @param string $locale
     * @return array
     */
    public static function getConvocatoriasTranslations(string $locale = 'es'): array
    {
        return [
            // Navegación principal
            'nav' => [
                'inicio' => __('app.home', [], $locale),
                'convocatorias' => __('app.convocatorias', [], $locale),
                'mi_cuenta' => __('app.mi_perfil', [], $locale),
                'admin' => __('app.administrador', [], $locale),
                'cerrar_sesion' => __('app.logout', [], $locale),
            ],

            // Estados de convocatorias
            'estados' => [
                'activa' => __('app.active', [], $locale),
                'cerrada' => 'Cerrada',
                'proximamente' => 'Próximamente',
                'suspendida' => 'Suspendida',
            ],

            // Filtros
            'filtros' => [
                'todas_regiones' => __('app.todas_las_regiones', [], $locale),
                'todos_niveles' => __('app.todos_los_niveles', [], $locale),
                'todas_areas' => __('app.todas_las_areas', [], $locale),
                'ordenar_fecha' => 'Ordenar por fecha',
                'ordenar_salario' => 'Ordenar por salario',
            ],

            // Mensajes del sistema
            'mensajes' => [
                'cargando' => __('app.loading', [], $locale),
                'sin_resultados' => __('app.no_results', [], $locale),
                'error_servidor' => 'Error del servidor',
                'operacion_exitosa' => __('app.operation_success', [], $locale),
                'confirmar_accion' => '¿Estás seguro?',
            ],

            // Específicos del contexto peruano
            'peru' => [
                'regiones' => [
                    'lambayeque' => 'Lambayeque',
                    'la_libertad' => 'La Libertad',
                    'piura' => 'Piura',
                    'cajamarca' => 'Cajamarca',
                    'amazonas' => 'Amazonas',
                ],
                'moneda' => __('app.currency_symbol', [], $locale),
                'ugel_chiclayo' => 'UGEL Chiclayo',
            ]
        ];
    }

    /**
     * Formatea números en formato peruano
     *
     * @param float $number
     * @param string $locale
     * @return string
     */
    public static function formatCurrency(float $number, string $locale = 'es'): string
    {
        $symbol = __('app.currency_symbol', [], $locale);
        return $symbol . ' ' . number_format($number, 2, '.', ',');
    }

    /**
     * Formatea fechas en español
     *
     * @param \DateTime|string $date
     * @param string $format
     * @return string
     */
    public static function formatDate($date, string $format = 'd/m/Y'): string
    {
        if (is_string($date)) {
            $date = new \DateTime($date);
        }

        // Configurar nombres de meses en español
        $months = [
            1 => 'enero', 2 => 'febrero', 3 => 'marzo', 4 => 'abril',
            5 => 'mayo', 6 => 'junio', 7 => 'julio', 8 => 'agosto',
            9 => 'septiembre', 10 => 'octubre', 11 => 'noviembre', 12 => 'diciembre'
        ];

        $days = [
            1 => 'lunes', 2 => 'martes', 3 => 'miércoles', 4 => 'jueves',
            5 => 'viernes', 6 => 'sábado', 0 => 'domingo'
        ];

        $formatted = $date->format($format);

        // Reemplazar nombres en inglés por español si es necesario
        if (strpos($format, 'F') !== false) {
            $monthName = $months[(int)$date->format('n')];
            $formatted = str_replace($date->format('F'), $monthName, $formatted);
        }

        return $formatted;
    }
}
