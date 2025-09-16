<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'user_id',
        'tipo',
        'titulo',
        'mensaje',
        'leida',
        'fecha_leida',
    ];

    protected $casts = [
        'tipo' => 'string',
        'leida' => 'boolean',
        'fecha_leida' => 'datetime',
    ];

    /**
     * Una notificación pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para notificaciones no leídas
     */
    public function scopeUnread($query)
    {
        return $query->where('leida', false);
    }

    /**
     * Scope para notificaciones leídas
     */
    public function scopeRead($query)
    {
        return $query->where('leida', true);
    }

    /**
     * Scope por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('tipo', $type);
    }

    /**
     * Scope ordenado por fecha (más recientes primero)
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Marcar como leída
     */
    public function markAsRead(): bool
    {
        return $this->update([
            'leida' => true,
            'fecha_leida' => now(),
        ]);
    }

    /**
     * Marcar como no leída
     */
    public function markAsUnread(): bool
    {
        return $this->update([
            'leida' => false,
            'fecha_leida' => null,
        ]);
    }

    /**
     * Verificar si está leída
     */
    public function isRead(): bool
    {
        return $this->leida;
    }

    /**
     * Obtener el ícono según el tipo
     */
    public function getIcon(): string
    {
        return match ($this->tipo) {
            'success' => 'check-circle',
            'warning' => 'exclamation-triangle',
            'error' => 'x-circle',
            default => 'information-circle',
        };
    }

    /**
     * Obtener la clase CSS según el tipo
     */
    public function getCssClass(): string
    {
        return match ($this->tipo) {
            'success' => 'text-green-600 bg-green-50',
            'warning' => 'text-yellow-600 bg-yellow-50',
            'error' => 'text-red-600 bg-red-50',
            default => 'text-blue-600 bg-blue-50',
        };
    }
}
