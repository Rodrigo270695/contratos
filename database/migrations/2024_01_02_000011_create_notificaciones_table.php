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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('ID del usuario destinatario');

            // Contenido
            $table->enum('tipo', ['info', 'success', 'warning', 'error'])->default('info');
            $table->string('titulo', 200)->comment('Título de la notificación');
            $table->text('mensaje')->comment('Mensaje');

            // Estado
            $table->boolean('leida')->default(false)->comment('Si fue leída');
            $table->timestamp('fecha_leida')->nullable()->comment('Fecha de lectura');

            $table->timestamps();

            $table->index('user_id');
            $table->index('leida');
            $table->index('tipo');
            $table->index('created_at');
            $table->index(['user_id', 'leida']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
