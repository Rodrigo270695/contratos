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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('postulacion_id')->constrained('postulaciones')->onDelete('cascade')->comment('ID de la postulación');

            // Información del documento
            $table->enum('tipo_documento', ['dni', 'cv', 'titulo', 'certificados', 'otros'])->comment('Tipo de documento');
            $table->string('nombre_original', 255)->comment('Nombre original');
            $table->string('nombre_archivo', 255)->comment('Nombre del archivo almacenado');
            $table->string('ruta_archivo', 500)->comment('Ruta del archivo');
            $table->integer('tamaño_archivo')->comment('Tamaño en bytes');

            // Estado
            $table->enum('estado', ['subido', 'revisado', 'aprobado', 'rechazado'])->default('subido');
            $table->text('observaciones')->nullable()->comment('Observaciones del revisor');

            $table->timestamps();

            $table->index('postulacion_id');
            $table->index('tipo_documento');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
