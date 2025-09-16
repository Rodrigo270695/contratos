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
        Schema::create('postulaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict')->comment('ID del docente postulante');
            $table->foreignId('plaza_id')->constrained('plazas')->onDelete('restrict')->comment('ID de la plaza');
            $table->foreignId('convocatoria_id')->constrained('convocatorias')->onDelete('restrict')->comment('ID de la convocatoria');

            // Datos de postulación
            $table->string('numero_postulacion', 50)->unique()->comment('Número único');
            $table->dateTime('fecha_postulacion')->comment('Fecha de postulación');
            $table->tinyInteger('orden_preferencia')->default(1)->comment('Orden de preferencia');

            // Evaluación
            $table->decimal('puntaje_final', 5, 2)->default(0)->comment('Puntaje total');
            $table->integer('posicion_merito')->nullable()->comment('Posición en orden de mérito');

            // Estado
            $table->enum('status', ['postulado', 'evaluado', 'seleccionado', 'no_seleccionado', 'retirado'])->default('postulado');
            $table->text('observaciones')->nullable()->comment('Observaciones');

            $table->timestamps();

            $table->unique(['user_id', 'plaza_id'], 'uk_user_plaza');
            $table->index('user_id');
            $table->index('plaza_id');
            $table->index('convocatoria_id');
            $table->index('numero_postulacion');
            $table->index('status');
            $table->index('posicion_merito');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postulaciones');
    }
};
