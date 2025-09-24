<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'dni',
        'email',
        'password',
        'user_type',
        'status',
        'phone',
        // Campos para Sistema de Recomendaciones IA
        'education_level',
        'degree_specialty',
        'university',
        'years_experience',
        'preferred_level',
        'preferred_modality',
        'travel_availability',
        'preferred_location',
        'interest_areas',
        'institution_id',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'user_type' => 'string',
            'status' => 'string',
            'interest_areas' => 'array', // Cast JSON to array
            'last_login' => 'datetime',
        ];
    }

    /**
     * Especifica que el campo de autenticación es DNI en lugar de email
     *
     * @return string
     */
    public function getAuthIdentifierName(): string
    {
        return 'dni';
    }

    /**
     * Especifica que para rutas se use el ID, no el DNI
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'id';
    }

    /**
     * Métodos helper para roles
     */
    public function isAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    public function isDocente(): bool
    {
        return $this->user_type === 'docente';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Scope para filtrar por tipo de usuario
     */
    public function scopeAdmins($query)
    {
        return $query->where('user_type', 'admin');
    }

    public function scopeDocentes($query)
    {
        return $query->where('user_type', 'docente');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Accessor para obtener el nombre completo
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Accessor para formatear el DNI
     */
    public function getFormattedDniAttribute(): string
    {
        return $this->dni;
    }

    /**
     * Mutator para asegurar que el DNI se guarde limpio
     */
    public function setDniAttribute($value): void
    {
        // Remover espacios y caracteres no numéricos
        $this->attributes['dni'] = preg_replace('/[^0-9]/', '', $value);
    }

    /**
     * Validar si el DNI es válido (8 dígitos)
     */
    public function isValidDni(): bool
    {
        return strlen($this->dni) === 8 && is_numeric($this->dni);
    }

    // =====================================================
    // RELACIONES CON EL SISTEMA DE CONVOCATORIAS
    // =====================================================

    /**
     * Un usuario (docente) puede trabajar en una institución
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Un usuario puede tener muchas postulaciones
     */
    public function postulaciones(): HasMany
    {
        return $this->hasMany(Postulacion::class);
    }

    /**
     * Un usuario puede tener muchas recomendaciones de IA
     */
    public function recomendaciones(): HasMany
    {
        return $this->hasMany(RecomendacionIa::class);
    }

    /**
     * Un usuario puede tener muchas notificaciones
     */
    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class);
    }

    /**
     * Un usuario puede haber creado convocatorias (si es admin)
     */
    public function convocatoriasCreadas(): HasMany
    {
        return $this->hasMany(Convocatoria::class, 'created_by');
    }

    /**
     * Un docente tiene un perfil detallado para el sistema de IA
     */
    public function teacherProfile(): HasOne
    {
        return $this->hasOne(TeacherProfile::class);
    }

    // =====================================================
    // MÉTODOS HELPER PARA EL SISTEMA DE CONVOCATORIAS
    // =====================================================

    /**
     * Obtener postulaciones activas del usuario
     */
    public function getActivePostulaciones()
    {
        return $this->postulaciones()->active();
    }

    /**
     * Obtener recomendaciones pendientes
     */
    public function getPendingRecommendations()
    {
        return $this->recomendaciones()->pending()->notExpired();
    }

    /**
     * Obtener notificaciones no leídas
     */
    public function getUnreadNotifications()
    {
        return $this->notificaciones()->unread();
    }

    /**
     * Contar notificaciones no leídas
     */
    public function getUnreadNotificationsCount(): int
    {
        return $this->notificaciones()->unread()->count();
    }

    /**
     * Verificar si el usuario puede postular a una plaza
     */
    public function canApplyToPlaza(Plaza $plaza): bool
    {
        if (!$this->isDocente() || !$this->isActive()) {
            return false;
        }

        // Verificar si ya postuló a esta plaza
        $existingApplication = $this->postulaciones()
            ->where('plaza_id', $plaza->id)
            ->where('status', '!=', 'retirado')
            ->exists();

        return !$existingApplication && $plaza->hasVacancies();
    }

    /**
     * Actualizar último login
     */
    public function updateLastLogin(): bool
    {
        return $this->update(['last_login' => now()]);
    }
}
