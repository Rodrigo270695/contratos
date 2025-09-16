<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea un usuario administrador por defecto para acceder
     * al panel administrativo del Sistema de Convocatorias Docentes UGEL Chiclayo
     */
    public function run(): void
    {
        // Verificar si ya existe un administrador
        if (User::where('user_type', 'admin')->exists()) {
            $this->command->info('Ya existe un usuario administrador en el sistema.');
            return;
        }

        // Crear usuario administrador
        $admin = User::create([
            'first_name' => 'Administrador',
            'last_name' => 'UGEL Chiclayo',
            'dni' => '12345678', // DNI de prueba - CAMBIAR EN PRODUCCIÓN
            'email' => 'admin@ugel-chiclayo.gob.pe',
            'phone' => '987654321',
            'password' => Hash::make('admin123'), // Contraseña temporal - CAMBIAR EN PRODUCCIÓN
            'user_type' => 'admin',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Usuario administrador creado exitosamente:');
        $this->command->line('DNI: ' . $admin->dni);
        $this->command->line('Email: ' . $admin->email);
        $this->command->line('Contraseña: admin123');
        $this->command->warn('¡IMPORTANTE: Cambia la contraseña después del primer login!');

        // Crear algunos usuarios docentes de prueba
        $this->createDocentesSample();
    }

    /**
     * Crear usuarios docentes de muestra para testing
     */
    private function createDocentesSample(): void
    {
        $docentes = [
            [
                'first_name' => 'María Elena',
                'last_name' => 'García Rodríguez',
                'dni' => '11111111',
                'email' => 'maria.garcia@gmail.com',
                'phone' => '987111111',
                'speciality' => 'Educación Primaria'
            ],
            [
                'first_name' => 'Carlos Alberto',
                'last_name' => 'Mendoza Silva',
                'dni' => '22222222',
                'email' => 'carlos.mendoza@gmail.com',
                'phone' => '987222222',
                'speciality' => 'Matemáticas - Secundaria'
            ],
            [
                'first_name' => 'Ana Sofía',
                'last_name' => 'López Vásquez',
                'dni' => '33333333',
                'email' => 'ana.lopez@gmail.com',
                'phone' => '987333333',
                'speciality' => 'Comunicación - Secundaria'
            ]
        ];

        foreach ($docentes as $docenteData) {
            User::create([
                'first_name' => $docenteData['first_name'],
                'last_name' => $docenteData['last_name'],
                'dni' => $docenteData['dni'],
                'email' => $docenteData['email'],
                'phone' => $docenteData['phone'],
                'password' => Hash::make('docente123'), // Contraseña por defecto para testing
                'user_type' => 'docente',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Se crearon ' . count($docentes) . ' usuarios docentes de prueba.');
        $this->command->line('Contraseña para todos los docentes: docente123');
    }
}
