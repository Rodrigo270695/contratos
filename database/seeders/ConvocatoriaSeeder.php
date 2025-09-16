<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConvocatoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $convocatorias = [
            [
                'title' => 'Contratación Docente 2025 - UGEL Lambayeque',
                'description' => 'Proceso de contratación docente para instituciones educativas públicas de la UGEL Lambayeque para el año escolar 2025.',
                'year' => 2025,
                'process_type' => 'contratacion',
                'ugel_id' => 1, // UGEL Lambayeque
                'start_date' => '2025-01-15',
                'end_date' => '2025-03-30',
                'registration_start' => '2025-01-15 08:00:00',
                'registration_end' => '2025-02-15 18:00:00',
                'status' => 'published',
                'total_plazas' => 45,
                'created_by' => 1, // Asumiendo que existe un admin con ID 1
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Nombramiento Docente 2025 - UGEL Chiclayo',
                'description' => 'Concurso público de ingreso a la carrera pública magisterial para el nombramiento de profesores en instituciones educativas públicas.',
                'year' => 2025,
                'process_type' => 'nombramiento',
                'ugel_id' => 2, // UGEL Chiclayo
                'start_date' => '2025-02-01',
                'end_date' => '2025-05-30',
                'registration_start' => '2025-02-01 08:00:00',
                'registration_end' => '2025-03-01 18:00:00',
                'status' => 'draft',
                'total_plazas' => 25,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Contratación Docente 2025 - UGEL Ferreñafe',
                'description' => 'Proceso de contratación de docentes para cubrir plazas vacantes en instituciones educativas de educación básica regular.',
                'year' => 2025,
                'process_type' => 'contratacion',
                'ugel_id' => 3, // UGEL Ferreñafe
                'start_date' => '2025-01-20',
                'end_date' => '2025-04-15',
                'registration_start' => '2025-01-20 08:00:00',
                'registration_end' => '2025-02-20 18:00:00',
                'status' => 'active',
                'total_plazas' => 18,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('convocatorias')->insert($convocatorias);
    }
}
