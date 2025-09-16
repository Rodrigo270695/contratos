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
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ugel_id')->constrained('ugels')->onDelete('restrict');
            $table->string('name', 100)->comment('Nombre del distrito');
            $table->string('code', 10)->unique()->comment('Código único');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('ugel_id');
            $table->index('code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('districts');
    }
};
