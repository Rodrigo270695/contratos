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
        Schema::table('users', function (Blueprint $table) {
            // Agregar campos adicionales para el sistema de convocatorias
            $table->foreignId('institution_id')->nullable()->after('interest_areas')->constrained('institutions')->onDelete('set null')->comment('IE de trabajo del docente');
            $table->timestamp('last_login')->nullable()->after('institution_id')->comment('Último login');

            // Agregar índices para optimización (solo los nuevos campos)
            $table->index('institution_id');
            $table->index('last_login');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropIndex(['institution_id']);
            $table->dropIndex(['last_login']);

            $table->dropColumn([
                'institution_id',
                'last_login'
            ]);
        });
    }
};
