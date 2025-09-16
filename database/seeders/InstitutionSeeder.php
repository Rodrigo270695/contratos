<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutions = [
            // Instituciones en Lambayeque
            [
                'district_id' => 1, // Lambayeque
                'name' => 'I.E. San José',
                'code' => '14001',
                'level' => 'primaria',
                'modality' => 'EBR',
                'address' => 'Calle Lima 123, Lambayeque',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 1,
                'name' => 'I.E.I. Los Angelitos',
                'code' => '14002',
                'level' => 'inicial',
                'modality' => 'EBR',
                'address' => 'Jr. Tacna 456, Lambayeque',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 1,
                'name' => 'I.E. Juan Manuel Iturregui',
                'code' => '14003',
                'level' => 'secundaria',
                'modality' => 'EBR',
                'address' => 'Av. Bolognesi 789, Lambayeque',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Instituciones en Chiclayo
            [
                'district_id' => 4, // Chiclayo
                'name' => 'I.E. María Auxiliadora',
                'code' => '14004',
                'level' => 'secundaria',
                'modality' => 'EBR',
                'address' => 'Av. Bolognesi 456, Chiclayo',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 4,
                'name' => 'I.E. San Juan Bautista',
                'code' => '14005',
                'level' => 'primaria',
                'modality' => 'EBR',
                'address' => 'Jr. San José 321, Chiclayo',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 4,
                'name' => 'I.E.I. Rayitos de Sol',
                'code' => '14006',
                'level' => 'inicial',
                'modality' => 'EBR',
                'address' => 'Calle Los Ángeles 654, Chiclayo',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Instituciones en José Leonardo Ortiz
            [
                'district_id' => 5, // JLO
                'name' => 'I.E. Augusto B. Leguía',
                'code' => '14007',
                'level' => 'secundaria',
                'modality' => 'EBR',
                'address' => 'Av. Grau 987, José Leonardo Ortiz',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 5,
                'name' => 'I.E. Fe y Alegría',
                'code' => '14008',
                'level' => 'primaria',
                'modality' => 'EBR',
                'address' => 'Jr. Libertad 147, José Leonardo Ortiz',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Instituciones en Ferreñafe
            [
                'district_id' => 7, // Ferreñafe
                'name' => 'I.E. Nuestra Señora de la Merced',
                'code' => '14009',
                'level' => 'secundaria',
                'modality' => 'EBR',
                'address' => 'Plaza de Armas s/n, Ferreñafe',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'district_id' => 7,
                'name' => 'I.E. Señor de la Justicia',
                'code' => '14010',
                'level' => 'primaria',
                'modality' => 'EBR',
                'address' => 'Jr. Grau 258, Ferreñafe',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('institutions')->insert($institutions);
    }
}
