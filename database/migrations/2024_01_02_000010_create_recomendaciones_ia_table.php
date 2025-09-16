<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recomendaciones_ia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('ID del usuario');
            $table->foreignId('plaza_id')->constrained('plazas')->onDelete('cascade')->comment('ID de la plaza recomendada');

            // Métricas de recomendación
            $table->decimal('puntuacion_compatibilidad', 3, 2)->comment('Puntuación 0-1');
            $table->enum('nivel_confianza', ['baja', 'media', 'alta'])->comment('Nivel de confianza');

            // Factores principales
            $table->boolean('coincidencia_especialidad')->default(false)->comment('Coincide especialidad');
            $table->boolean('coincidencia_nivel')->default(false)->comment('Coincide nivel educativo');
            $table->decimal('distancia_km', 5, 2)->nullable()->comment('Distancia en km');
            $table->boolean('experiencia_compatible')->default(false)->comment('Experiencia compatible');

            // Estado
            $table->enum('estado', ['pendiente', 'vista', 'aplicada', 'descartada'])->default('pendiente');
            $table->timestamp('fecha_generacion')->useCurrent();
            $table->timestamp('fecha_expiracion')->nullable()->comment('Fecha de expiración');

            $table->timestamps();

            $table->index('user_id');
            $table->index('plaza_id');
            $table->index(['puntuacion_compatibilidad', 'nivel_confianza'], 'recomendaciones_ia_score_confidence_idx');
            $table->index('estado');
            $table->index('fecha_expiracion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recomendaciones_ia');
    }
};
