<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
        'especialidad_principal',
        'experiencia_anos',
        'niveles_experiencia',
        'ubicacion_actual',
        'ubicaciones_interes',
        'disponibilidad_horaria',
        'tipo_contrato_preferido',
        'telefono',
        'sobre_mi',
        'score_perfil',
        'perfil_completo',
    ];

    protected $casts = [
        'niveles_experiencia' => 'array',
        'ubicaciones_interes' => 'array',
        'score_perfil' => 'decimal:2',
        'perfil_completo' => 'boolean',
    ];

    // Relación con el usuario
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Especialidades disponibles (para formularios)
    public static function getEspecialidades(): array
    {
        return [
            'educacion_inicial' => 'Educación Inicial',
            'educacion_primaria' => 'Educación Primaria',
            'matematica' => 'Matemática',
            'comunicacion' => 'Comunicación',
            'ciencias_sociales' => 'Ciencias Sociales',
            'ciencias_naturales' => 'Ciencias Naturales',
            'educacion_fisica' => 'Educación Física',
            'arte' => 'Arte',
            'ingles' => 'Inglés',
            'religion' => 'Religión',
            'educacion_para_el_trabajo' => 'Educación para el Trabajo',
        ];
    }

    // Niveles educativos disponibles
    public static function getNivelesEducativos(): array
    {
        return [
            'inicial' => 'Educación Inicial',
            'primaria' => 'Educación Primaria',
            'secundaria' => 'Educación Secundaria',
        ];
    }

    // Calcular score del perfil automáticamente
    public function calcularScorePerfil(): float
    {
        $score = 0;
        $campos_requeridos = [
            'especialidad_principal' => 25,
            'experiencia_anos' => 20,
            'niveles_experiencia' => 15,
            'ubicacion_actual' => 15,
            'disponibilidad_horaria' => 10,
            'tipo_contrato_preferido' => 5,
            'telefono' => 5,
            'sobre_mi' => 5,
        ];

        foreach ($campos_requeridos as $campo => $puntos) {
            if (!empty($this->$campo)) {
                if ($campo === 'niveles_experiencia' && is_array($this->$campo) && count($this->$campo) > 0) {
                    $score += $puntos;
                } elseif ($campo !== 'niveles_experiencia') {
                    $score += $puntos;
                }
            }
        }

        return $score;
    }

    // Verificar si el perfil está completo para IA
    public function esPerfilCompleto(): bool
    {
        return $this->calcularScorePerfil() >= 80; // 80% mínimo para considerarlo completo
    }

    // Actualizar scores automáticamente
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($profile) {
            $profile->score_perfil = $profile->calcularScorePerfil();
            $profile->perfil_completo = $profile->esPerfilCompleto();
        });
    }
}
