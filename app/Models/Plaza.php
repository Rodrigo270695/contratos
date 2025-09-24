<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plaza extends Model
{
    use HasFactory;

    protected $fillable = [
        'convocatoria_id',
        'institution_id',
        'codigo_plaza',
        'cargo',
        'nivel',
        'especialidad',
        'jornada',
        'monto_pago',
        'vacantes',
        'motivo_vacante',
        'requisitos',
        'status',
    ];

    protected $casts = [
        'nivel' => 'string',
        'jornada' => 'string',
        'monto_pago' => 'decimal:2',
        'vacantes' => 'integer',
        'status' => 'string',
    ];

    /**
     * Una plaza pertenece a una convocatoria
     */
    public function convocatoria(): BelongsTo
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Una plaza pertenece a una institución
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Una plaza tiene muchas postulaciones
     */
    public function postulaciones(): HasMany
    {
        return $this->hasMany(Postulacion::class);
    }

    /**
     * Una plaza puede tener recomendaciones de IA
     */
    public function recomendaciones(): HasMany
    {
        return $this->hasMany(RecomendacionIa::class);
    }

    /**
     * Scope para plazas activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope por nivel educativo
     */
    public function scopeByLevel($query, $level)
    {
        return $query->where('nivel', $level);
    }

    /**
     * Scope por especialidad
     */
    public function scopeByEspecialidad($query, $especialidad)
    {
        return $query->where('especialidad', 'like', "%{$especialidad}%");
    }

    /**
     * Scope por jornada laboral
     */
    public function scopeByJornada($query, $jornada)
    {
        return $query->where('jornada', $jornada);
    }

    /**
     * Verificar si la plaza tiene vacantes disponibles
     */
    public function hasVacancies(): bool
    {
        return $this->vacantes > 0 && $this->status === 'active';
    }

    /**
     * Obtener el número de postulaciones actuales
     */
    public function getPostulacionesCount(): int
    {
        return $this->postulaciones()->where('status', '!=', 'retirado')->count();
    }
}
