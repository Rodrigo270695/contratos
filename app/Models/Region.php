<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Una región tiene muchas UGELs
     */
    public function ugels(): HasMany
    {
        return $this->hasMany(Ugel::class);
    }

    /**
     * Scope para regiones activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
