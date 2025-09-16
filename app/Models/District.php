<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    use HasFactory;

    protected $fillable = [
        'ugel_id',
        'name',
        'code',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Un distrito pertenece a una UGEL
     */
    public function ugel(): BelongsTo
    {
        return $this->belongsTo(Ugel::class);
    }

    /**
     * Un distrito tiene muchas instituciones
     */
    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }

    /**
     * Scope para distritos activos
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
