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
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained('districts')->onDelete('restrict');
            $table->string('name', 200)->comment('Nombre de la IE');
            $table->string('code', 20)->unique()->comment('Código modular');
            $table->enum('level', ['inicial', 'primaria', 'secundaria'])->comment('Nivel educativo');
            $table->enum('modality', ['EBR', 'EBA', 'EBE'])->default('EBR')->comment('Modalidad');
            $table->text('address')->nullable()->comment('Dirección');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('district_id');
            $table->index('code');
            $table->index('level');
            $table->index('modality');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
