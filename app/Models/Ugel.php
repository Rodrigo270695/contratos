<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Ugel extends Model
{
    use HasFactory;

    protected $fillable = [
        'region_id',
        'name',
        'code',
        'address',
        'phone',
        'email',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Una UGEL pertenece a una región
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    /**
     * Una UGEL tiene muchos distritos
     */
    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    /**
     * Una UGEL tiene muchas instituciones a través de los distritos
     */
    public function institutions(): HasManyThrough
    {
        return $this->hasManyThrough(Institution::class, District::class);
    }

    /**
     * Una UGEL tiene muchas convocatorias
     */
    public function convocatorias(): HasMany
    {
        return $this->hasMany(Convocatoria::class);
    }

    /**
     * Scope para UGELs activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
