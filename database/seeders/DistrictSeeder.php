<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = [
            // Distritos de UGEL Lambayeque
            [
                'ugel_id' => 1, // UGEL Lambayeque
                'name' => 'Lambayeque',
                'code' => 'LAMB',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ugel_id' => 1,
                'name' => 'Mórrope',
                'code' => 'MORR',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ugel_id' => 1,
                'name' => 'Olmos',
                'code' => 'OLMO',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Distritos de UGEL Chiclayo
            [
                'ugel_id' => 2, // UGEL Chiclayo
                'name' => 'Chiclayo',
                'code' => 'CHIC',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ugel_id' => 2,
                'name' => 'José Leonardo Ortiz',
                'code' => 'JLO',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ugel_id' => 2,
                'name' => 'La Victoria',
                'code' => 'VICT',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Distritos de UGEL Ferreñafe
            [
                'ugel_id' => 3, // UGEL Ferreñafe
                'name' => 'Ferreñafe',
                'code' => 'FERR',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ugel_id' => 3,
                'name' => 'Pueblo Nuevo',
                'code' => 'PNUE',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('districts')->insert($districts);
    }
}
