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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('dni', 8)->unique()->comment('Documento Nacional de Identidad - Peru');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('user_type', ['admin', 'docente'])->default('docente')->comment('User type in the system');
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending')->comment('User status');
            $table->string('phone', 9)->nullable()->comment('Mobile phone');

            // Campos para el Sistema de Recomendaciones de IA
            // Formación Académica
            $table->enum('education_level', ['technical', 'university', 'bachelor', 'licensed', 'masters', 'doctorate'])->nullable()->comment('Nivel educativo máximo alcanzado');
            $table->string('degree_specialty')->nullable()->comment('Especialidad del título profesional');
            $table->string('university')->nullable()->comment('Universidad o instituto de procedencia');

            // Experiencia Docente
            $table->enum('years_experience', ['0', '1-2', '3-5', '6-10', '11-15', '16+'])->nullable()->comment('Años de experiencia como docente');

            // Preferencias Laborales
            $table->enum('preferred_level', ['initial', 'primary', 'secondary', 'technical', 'higher', 'any'])->nullable()->comment('Nivel educativo donde prefiere enseñar');
            $table->enum('preferred_modality', ['in_person', 'virtual', 'hybrid', 'any'])->nullable()->comment('Modalidad de enseñanza preferida');
            $table->enum('travel_availability', ['yes', 'limited', 'no'])->nullable()->comment('Disponibilidad para trabajar fuera de su localidad');
            $table->string('preferred_location')->nullable()->comment('Ubicación geográfica donde prefiere trabajar');

            // Áreas Curriculares (JSON para múltiples selecciones)
            $table->json('interest_areas')->nullable()->comment('Áreas curriculares de especialización e interés');

            $table->rememberToken();
            $table->timestamps();

            // Indexes for optimized searches
            $table->index('dni');
            $table->index('user_type');
            $table->index('status');
            $table->index('education_level');
            $table->index('preferred_level');
            $table->index('preferred_modality');
            $table->index('travel_availability');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('dni', 8)->primary()->comment('DNI del usuario para reset de contraseña');
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
