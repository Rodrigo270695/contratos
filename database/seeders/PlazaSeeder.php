<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlazaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plazas = [
            // Plazas para Convocatoria UGEL Lambayeque (ID: 1)
            [
                'convocatoria_id' => 1,
                'institution_id' => 1, // I.E. San José
                'codigo_plaza' => 'LAM-2025-001',
                'cargo' => 'Profesor de Educación Primaria',
                'nivel' => 'primaria',
                'especialidad' => 'Educación Primaria',
                'jornada' => '30',
                'vacantes' => 2,
                'motivo_vacante' => 'Jubilación',
                'requisitos' => 'Título pedagógico en Educación Primaria, experiencia mínima 2 años',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'convocatoria_id' => 1,
                'institution_id' => 2, // I.E.I. Los Angelitos
                'codigo_plaza' => 'LAM-2025-002',
                'cargo' => 'Profesora de Educación Inicial',
                'nivel' => 'inicial',
                'especialidad' => 'Educación Inicial',
                'jornada' => '25',
                'vacantes' => 1,
                'motivo_vacante' => 'Licencia por maternidad',
                'requisitos' => 'Título pedagógico en Educación Inicial, certificado en primeros auxilios',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'convocatoria_id' => 1,
                'institution_id' => 3, // I.E. Juan Manuel Iturregui
                'codigo_plaza' => 'LAM-2025-003',
                'cargo' => 'Profesor de Matemática',
                'nivel' => 'secundaria',
                'especialidad' => 'Matemática',
                'jornada' => '40',
                'vacantes' => 1,
                'motivo_vacante' => 'Renuncia',
                'requisitos' => 'Título pedagógico en Matemática o afines, experiencia en secundaria',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'convocatoria_id' => 1,
                'institution_id' => 3,
                'codigo_plaza' => 'LAM-2025-004',
                'cargo' => 'Profesor de Comunicación',
                'nivel' => 'secundaria',
                'especialidad' => 'Comunicación',
                'jornada' => '30',
                'vacantes' => 1,
                'motivo_vacante' => 'Nueva creación',
                'requisitos' => 'Título pedagógico en Lengua y Literatura o Comunicación',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Plazas para Convocatoria UGEL Chiclayo (ID: 2)
            [
                'convocatoria_id' => 2,
                'institution_id' => 4, // I.E. María Auxiliadora
                'codigo_plaza' => 'CHIC-2025-001',
                'cargo' => 'Profesor de Ciencias Sociales',
                'nivel' => 'secundaria',
                'especialidad' => 'Ciencias Sociales',
                'jornada' => '40',
                'vacantes' => 1,
                'motivo_vacante' => 'Fallecimiento',
                'requisitos' => 'Título pedagógico en Historia, Geografía o Ciencias Sociales',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'convocatoria_id' => 2,
                'institution_id' => 5, // I.E. San Juan Bautista
                'codigo_plaza' => 'CHIC-2025-002',
                'cargo' => 'Profesor de Educación Primaria',
                'nivel' => 'primaria',
                'especialidad' => 'Educación Primaria',
                'jornada' => '30',
                'vacantes' => 2,
                'motivo_vacante' => 'Traslado',
                'requisitos' => 'Título pedagógico en Educación Primaria',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Plazas para Convocatoria UGEL Ferreñafe (ID: 3)
            [
                'convocatoria_id' => 3,
                'institution_id' => 9, // I.E. Nuestra Señora de la Merced
                'codigo_plaza' => 'FERR-2025-001',
                'cargo' => 'Profesor de Educación Física',
                'nivel' => 'secundaria',
                'especialidad' => 'Educación Física',
                'jornada' => '30',
                'vacantes' => 1,
                'motivo_vacante' => 'Licencia sin goce',
                'requisitos' => 'Título pedagógico en Educación Física, certificado médico',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'convocatoria_id' => 3,
                'institution_id' => 10, // I.E. Señor de la Justicia
                'codigo_plaza' => 'FERR-2025-002',
                'cargo' => 'Profesor de Educación Primaria',
                'nivel' => 'primaria',
                'especialidad' => 'Educación Primaria',
                'jornada' => '25',
                'vacantes' => 1,
                'motivo_vacante' => 'Jubilación',
                'requisitos' => 'Título pedagógico en Educación Primaria, experiencia rural',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('plazas')->insert($plazas);
    }
}
