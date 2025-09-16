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
        Schema::create('plazas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('convocatoria_id')->constrained('convocatorias')->onDelete('cascade')->comment('ID de convocatoria');
            $table->foreignId('institution_id')->constrained('institutions')->onDelete('restrict')->comment('IE donde está la plaza');

            // Información de la plaza
            $table->string('codigo_plaza', 30)->unique()->comment('Código de la plaza');
            $table->string('cargo', 150)->comment('Nombre del cargo');
            $table->enum('nivel', ['inicial', 'primaria', 'secundaria'])->comment('Nivel educativo');
            $table->string('especialidad', 100)->nullable()->comment('Especialidad/área curricular');
            $table->enum('jornada', ['25', '30', '40'])->default('30')->comment('Horas de trabajo');

            // Detalles
            $table->integer('vacantes')->default(1)->comment('Número de vacantes');
            $table->string('motivo_vacante', 200)->comment('Motivo de la vacante');
            $table->text('requisitos')->nullable()->comment('Requisitos específicos');

            $table->enum('status', ['active', 'filled', 'cancelled'])->default('active');
            $table->timestamps();

            $table->index('convocatoria_id');
            $table->index('institution_id');
            $table->index('codigo_plaza');
            $table->index('nivel');
            $table->index('especialidad');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plazas');
    }
};
