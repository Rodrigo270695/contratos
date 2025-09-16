<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeders en orden de dependencias
        $this->call([
            // Primero crear usuarios admin (requerido para convocatorias)
            AdminUserSeeder::class,

            // Datos base del sistema
            RegionSeeder::class,
            UgelSeeder::class,
            DistrictSeeder::class,
            InstitutionSeeder::class,

            // Datos de convocatorias (requiere que exista al menos un usuario admin)
            ConvocatoriaSeeder::class,
            PlazaSeeder::class,
        ]);
    }
}
