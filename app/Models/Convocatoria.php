<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Convocatoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'year',
        'process_type',
        'ugel_id',
        'start_date',
        'end_date',
        'registration_start',
        'registration_end',
        'status',
        'total_plazas',
        'created_by',
    ];

    protected $casts = [
        'year' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'process_type' => 'string',
        'status' => 'string',
        'total_plazas' => 'integer',
    ];

    /**
     * Una convocatoria pertenece a una UGEL
     */
    public function ugel(): BelongsTo
    {
        return $this->belongsTo(Ugel::class);
    }

    /**
     * Una convocatoria fue creada por un usuario
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Una convocatoria tiene muchas plazas
     */
    public function plazas(): HasMany
    {
        return $this->hasMany(Plaza::class);
    }

    /**
     * Una convocatoria tiene muchas postulaciones
     */
    public function postulaciones(): HasMany
    {
        return $this->hasMany(Postulacion::class);
    }

    /**
     * Scope para convocatorias activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope para convocatorias publicadas
     */
    public function scopePublished($query)
    {
        return $query->whereIn('status', ['published', 'active']);
    }

    /**
     * Scope por año
     */
    public function scopeByYear($query, $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope por tipo de proceso
     */
    public function scopeByProcessType($query, $type)
    {
        return $query->where('process_type', $type);
    }

    /**
     * Verificar si está en periodo de inscripción
     */
    public function isRegistrationOpen(): bool
    {
        $now = now();
        return $now >= $this->registration_start && $now <= $this->registration_end;
    }
}
