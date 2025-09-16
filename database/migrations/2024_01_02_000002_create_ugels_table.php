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
        Schema::create('ugels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained('regions')->onDelete('restrict');
            $table->string('name', 150)->comment('Nombre de la UGEL');
            $table->string('code', 15)->unique()->comment('Código único');
            $table->text('address')->nullable()->comment('Dirección');
            $table->string('phone', 15)->nullable()->comment('Teléfono');
            $table->string('email', 100)->nullable()->comment('Email');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('region_id');
            $table->index('code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ugels');
    }
};
