<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecomendacionIa extends Model
{
    use HasFactory;

    protected $table = 'recomendaciones_ia';

    protected $fillable = [
        'user_id',
        'plaza_id',
        'puntuacion_compatibilidad',
        'nivel_confianza',
        'coincidencia_especialidad',
        'coincidencia_nivel',
        'distancia_km',
        'experiencia_compatible',
        'estado',
        'fecha_generacion',
        'fecha_expiracion',
    ];

    protected $casts = [
        'puntuacion_compatibilidad' => 'decimal:2',
        'nivel_confianza' => 'string',
        'coincidencia_especialidad' => 'boolean',
        'coincidencia_nivel' => 'boolean',
        'distancia_km' => 'decimal:2',
        'experiencia_compatible' => 'boolean',
        'estado' => 'string',
        'fecha_generacion' => 'datetime',
        'fecha_expiracion' => 'datetime',
    ];

    /**
     * Una recomendación pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Una recomendación es para una plaza específica
     */
    public function plaza(): BelongsTo
    {
        return $this->belongsTo(Plaza::class);
    }

    /**
     * Scope para recomendaciones pendientes
     */
    public function scopePending($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para recomendaciones vistas
     */
    public function scopeViewed($query)
    {
        return $query->where('estado', 'vista');
    }

    /**
     * Scope ordenado por compatibilidad
     */
    public function scopeOrderByCompatibility($query, $direction = 'desc')
    {
        return $query->orderBy('puntuacion_compatibilidad', $direction);
    }

    /**
     * Scope por nivel de confianza
     */
    public function scopeByConfidence($query, $confidence)
    {
        return $query->where('nivel_confianza', $confidence);
    }

    /**
     * Scope para recomendaciones no expiradas
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('fecha_expiracion')
              ->orWhere('fecha_expiracion', '>', now());
        });
    }

    /**
     * Verificar si la recomendación ha expirado
     */
    public function isExpired(): bool
    {
        return $this->fecha_expiracion && $this->fecha_expiracion < now();
    }

    /**
     * Obtener el porcentaje de compatibilidad
     */
    public function getCompatibilityPercentage(): int
    {
        return (int) ($this->puntuacion_compatibilidad * 100);
    }

    /**
     * Marcar como vista
     */
    public function markAsViewed(): bool
    {
        return $this->update(['estado' => 'vista']);
    }

    /**
     * Marcar como aplicada
     */
    public function markAsApplied(): bool
    {
        return $this->update(['estado' => 'aplicada']);
    }

    /**
     * Marcar como descartada
     */
    public function markAsDiscarded(): bool
    {
        return $this->update(['estado' => 'descartada']);
    }

    /**
     * Obtener factores de recomendación como array
     */
    public function getFactors(): array
    {
        return [
            'especialidad' => $this->coincidencia_especialidad,
            'nivel' => $this->coincidencia_nivel,
            'distancia' => $this->distancia_km,
            'experiencia' => $this->experiencia_compatible,
        ];
    }
}
