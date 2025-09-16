<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UgelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ugels = [
            [
                'region_id' => 1, // Lambayeque
                'name' => 'UGEL Lambayeque',
                'code' => 'UGEL-LAM',
                'address' => 'Av. Bolognesi 512, Lambayeque',
                'phone' => '074-282156',
                'email' => 'ugel.lambayeque@minedu.gob.pe',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'region_id' => 1, // Lambayeque
                'name' => 'UGEL Chiclayo',
                'code' => 'UGEL-CHIC',
                'address' => 'Av. Luis Gonzales 649, Chiclayo',
                'phone' => '074-205147',
                'email' => 'ugel.chiclayo@minedu.gob.pe',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'region_id' => 1, // Lambayeque
                'name' => 'UGEL Ferreñafe',
                'code' => 'UGEL-FERR',
                'address' => 'Jr. Grau 234, Ferreñafe',
                'phone' => '074-286543',
                'email' => 'ugel.ferrenafe@minedu.gob.pe',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('ugels')->insert($ugels);
    }
}
