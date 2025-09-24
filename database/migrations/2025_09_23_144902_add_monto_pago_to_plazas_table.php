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
        Schema::table('plazas', function (Blueprint $table) {
            $table->decimal('monto_pago', 8, 2)->nullable()->after('jornada')->comment('Monto de pago mensual en soles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plazas', function (Blueprint $table) {
            $table->dropColumn('monto_pago');
        });
    }
};
