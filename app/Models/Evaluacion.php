<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluacion extends Model
{
    use HasFactory;

    protected $table = 'evaluaciones';

    protected $fillable = [
        'postulacion_id',
        'puntaje_prueba_nacional',
        'puntaje_subprueba',
        'puntaje_bonificacion',
        'puntaje_total',
        'estado_evaluacion',
        'fecha_evaluacion',
        'observaciones',
        'evaluado_por',
    ];

    protected $casts = [
        'puntaje_prueba_nacional' => 'decimal:2',
        'puntaje_subprueba' => 'decimal:2',
        'puntaje_bonificacion' => 'decimal:2',
        'puntaje_total' => 'decimal:2',
        'fecha_evaluacion' => 'date',
        'estado_evaluacion' => 'string',
    ];

    /**
     * Una evaluación pertenece a una postulación
     */
    public function postulacion(): BelongsTo
    {
        return $this->belongsTo(Postulacion::class);
    }

    /**
     * Scope para evaluaciones completadas
     */
    public function scopeCompleted($query)
    {
        return $query->where('estado_evaluacion', 'completada');
    }

    /**
     * Scope para evaluaciones pendientes
     */
    public function scopePending($query)
    {
        return $query->where('estado_evaluacion', 'pendiente');
    }

    /**
     * Scope ordenado por puntaje total
     */
    public function scopeOrderByScore($query, $direction = 'desc')
    {
        return $query->orderBy('puntaje_total', $direction);
    }

    /**
     * Calcular el puntaje total automáticamente
     */
    public function calculateTotalScore(): float
    {
        return $this->puntaje_prueba_nacional + $this->puntaje_subprueba + $this->puntaje_bonificacion;
    }

    /**
     * Verificar si la evaluación está completada
     */
    public function isCompleted(): bool
    {
        return $this->estado_evaluacion === 'completada';
    }

    /**
     * Obtener el porcentaje de puntaje (asumiendo 100 como máximo)
     */
    public function getScorePercentage(): float
    {
        return min(100, ($this->puntaje_total / 100) * 100);
    }
}
