<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Documento extends Model
{
    use HasFactory;

    protected $fillable = [
        'postulacion_id',
        'tipo_documento',
        'nombre_original',
        'nombre_archivo',
        'ruta_archivo',
        'tamaño_archivo',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'tipo_documento' => 'string',
        'tamaño_archivo' => 'integer',
        'estado' => 'string',
    ];

    /**
     * Un documento pertenece a una postulación
     */
    public function postulacion(): BelongsTo
    {
        return $this->belongsTo(Postulacion::class);
    }

    /**
     * Scope para documentos aprobados
     */
    public function scopeApproved($query)
    {
        return $query->where('estado', 'aprobado');
    }

    /**
     * Scope para documentos rechazados
     */
    public function scopeRejected($query)
    {
        return $query->where('estado', 'rechazado');
    }

    /**
     * Scope por tipo de documento
     */
    public function scopeByType($query, $type)
    {
        return $query->where('tipo_documento', $type);
    }

    /**
     * Obtener la URL del archivo
     */
    public function getFileUrl(): string
    {
        return Storage::url($this->ruta_archivo);
    }

    /**
     * Obtener el tamaño del archivo en formato legible
     */
    public function getReadableFileSize(): string
    {
        $bytes = $this->tamaño_archivo;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Verificar si el documento está aprobado
     */
    public function isApproved(): bool
    {
        return $this->estado === 'aprobado';
    }

    /**
     * Verificar si el documento está rechazado
     */
    public function isRejected(): bool
    {
        return $this->estado === 'rechazado';
    }

    /**
     * Verificar si el archivo existe en el storage
     */
    public function fileExists(): bool
    {
        return Storage::exists($this->ruta_archivo);
    }

    /**
     * Eliminar el archivo del storage
     */
    public function deleteFile(): bool
    {
        if ($this->fileExists()) {
            return Storage::delete($this->ruta_archivo);
        }
        return true;
    }
}
