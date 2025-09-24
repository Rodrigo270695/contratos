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
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('ID del docente');

            // 🎯 INFORMACIÓN CLAVE PARA IA (según tu tesis)

            // 1. Especialización (40% del algoritmo)
            $table->enum('especialidad_principal', [
                'educacion_inicial',
                'educacion_primaria',
                'matematica',
                'comunicacion',
                'ciencias_sociales',
                'ciencias_naturales',
                'educacion_fisica',
                'arte',
                'ingles',
                'religion',
                'educacion_para_el_trabajo'
            ])->nullable()->comment('Especialidad principal del docente');

            // 2. Experiencia (25% del algoritmo)
            $table->integer('experiencia_anos')->default(0)->comment('Años de experiencia docente');
            $table->json('niveles_experiencia')->nullable()->comment('Niveles donde ha trabajado [inicial, primaria, secundaria]');

            // 3. Ubicación (15% del algoritmo)
            $table->string('ubicacion_actual', 100)->nullable()->comment('Ubicación actual del docente');
            $table->json('ubicaciones_interes')->nullable()->comment('Ubicaciones donde estaría dispuesto a trabajar');

            // 4. Disponibilidad (10% del algoritmo)
            $table->enum('disponibilidad_horaria', ['tiempo_completo', 'medio_tiempo', 'flexible'])
                ->default('tiempo_completo')->comment('Disponibilidad horaria');
            $table->enum('tipo_contrato_preferido', ['contratacion', 'nombramiento', 'ambos'])
                ->default('ambos')->comment('Tipo de contrato preferido');

            // 5. Información adicional básica
            $table->string('telefono', 15)->nullable()->comment('Teléfono de contacto');
            $table->text('sobre_mi')->nullable()->comment('Descripción personal y profesional');

            // 6. Para el sistema de IA
            $table->decimal('score_perfil', 5, 2)->default(0)->comment('Score de completitud del perfil (0-100)');
            $table->boolean('perfil_completo')->default(false)->comment('Si el perfil está completo para recomendaciones');

            $table->timestamps();

            // Índices para optimizar búsquedas de IA
            $table->index(['user_id']);
            $table->index(['especialidad_principal', 'experiencia_anos']);
            $table->index(['ubicacion_actual']);
            $table->index(['perfil_completo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
