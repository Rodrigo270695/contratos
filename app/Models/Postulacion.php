<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Postulacion extends Model
{
    use HasFactory;

    protected $table = 'postulaciones';

    protected $fillable = [
        'user_id',
        'plaza_id',
        'convocatoria_id',
        'numero_postulacion',
        'fecha_postulacion',
        'orden_preferencia',
        'puntaje_final',
        'posicion_merito',
        'status',
        'observaciones',
    ];

    protected $casts = [
        'fecha_postulacion' => 'datetime',
        'orden_preferencia' => 'integer',
        'puntaje_final' => 'decimal:2',
        'posicion_merito' => 'integer',
        'status' => 'string',
    ];

    /**
     * Una postulación pertenece a un usuario (docente)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Una postulación es para una plaza específica
     */
    public function plaza(): BelongsTo
    {
        return $this->belongsTo(Plaza::class);
    }

    /**
     * Una postulación pertenece a una convocatoria
     */
    public function convocatoria(): BelongsTo
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Una postulación tiene una evaluación
     */
    public function evaluacion(): HasOne
    {
        return $this->hasOne(Evaluacion::class);
    }

    /**
     * Una postulación tiene muchos documentos
     */
    public function documentos(): HasMany
    {
        return $this->hasMany(Documento::class);
    }

    /**
     * Scope para postulaciones activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'retirado');
    }

    /**
     * Scope por estado
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope para postulaciones seleccionadas
     */
    public function scopeSelected($query)
    {
        return $query->where('status', 'seleccionado');
    }

    /**
     * Scope ordenado por mérito
     */
    public function scopeOrderByMerit($query)
    {
        return $query->orderBy('posicion_merito', 'asc');
    }

    /**
     * Verificar si la postulación fue seleccionada
     */
    public function isSelected(): bool
    {
        return $this->status === 'seleccionado';
    }

    /**
     * Verificar si la postulación está evaluada
     */
    public function isEvaluated(): bool
    {
        return in_array($this->status, ['evaluado', 'seleccionado', 'no_seleccionado']);
    }
}
