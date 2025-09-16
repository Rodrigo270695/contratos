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
        Schema::create('convocatorias', function (Blueprint $table) {
            $table->id();
            $table->string('title', 300)->comment('Título de la convocatoria');
            $table->text('description')->nullable()->comment('Descripción');
            $table->year('year')->comment('Año');
            $table->enum('process_type', ['contratacion', 'nombramiento'])->comment('Tipo de proceso');
            $table->foreignId('ugel_id')->constrained('ugels')->onDelete('restrict')->comment('UGEL responsable');

            // Fechas importantes
            $table->date('start_date')->comment('Fecha de inicio');
            $table->date('end_date')->comment('Fecha de fin');
            $table->dateTime('registration_start')->comment('Inicio inscripciones');
            $table->dateTime('registration_end')->comment('Fin inscripciones');

            // Estado
            $table->enum('status', ['draft', 'published', 'active', 'closed', 'cancelled'])->default('draft');
            $table->integer('total_plazas')->default(0)->comment('Total de plazas');

            $table->foreignId('created_by')->constrained('users')->onDelete('restrict')->comment('Creado por');
            $table->timestamps();

            $table->index('ugel_id');
            $table->index('year');
            $table->index('status');
            $table->index('process_type');
            $table->index(['registration_start', 'registration_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convocatorias');
    }
};
