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
        Schema::create('evaluaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('postulacion_id')->constrained('postulaciones')->onDelete('cascade')->comment('ID de la postulación');

            // Puntajes por etapa (simplificado)
            $table->decimal('puntaje_prueba_nacional', 5, 2)->default(0)->comment('Puntaje prueba nacional');
            $table->decimal('puntaje_subprueba', 5, 2)->default(0)->comment('Puntaje subprueba');
            $table->decimal('puntaje_bonificacion', 5, 2)->default(0)->comment('Puntaje bonificación');
            $table->decimal('puntaje_total', 5, 2)->default(0)->comment('Puntaje total');

            // Estado
            $table->enum('estado_evaluacion', ['pendiente', 'en_proceso', 'completada'])->default('pendiente');
            $table->date('fecha_evaluacion')->nullable()->comment('Fecha de evaluación');

            $table->text('observaciones')->nullable()->comment('Observaciones del evaluador');
            $table->string('evaluado_por', 200)->nullable()->comment('Nombre del evaluador');

            $table->timestamps();

            $table->unique('postulacion_id', 'uk_postulacion_evaluacion');
            $table->index('postulacion_id');
            $table->index('estado_evaluacion');
            $table->index('fecha_evaluacion');
            $table->index('puntaje_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluaciones');
    }
};
