<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'district_id',
        'name',
        'code',
        'level',
        'modality',
        'address',
        'status',
    ];

    protected $casts = [
        'level' => 'string',
        'modality' => 'string',
        'status' => 'string',
    ];

    /**
     * Una institución pertenece a un distrito
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Una institución tiene muchas plazas
     */
    public function plazas(): HasMany
    {
        return $this->hasMany(Plaza::class);
    }

    /**
     * Una institución puede tener muchos usuarios (docentes que trabajan ahí)
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope para instituciones activas
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
        return $query->where('level', $level);
    }

    /**
     * Scope por modalidad
     */
    public function scopeByModality($query, $modality)
    {
        return $query->where('modality', $modality);
    }
}
