<?php

namespace App\Http\Controllers;

use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherProfileController extends Controller
{
    /**
     * Mostrar el perfil del docente autenticado
     */
    public function show()
    {
        // Verificar que el usuario sea docente
        if (Auth::user()->user_type !== 'docente') {
            return redirect()->route('dashboard')
                ->with('error', 'Solo los docentes pueden acceder a esta sección.');
        }

        $user = Auth::user();
        $profile = $user->teacherProfile;

        // Si no tiene perfil, crear uno vacío
        if (!$profile) {
            $profile = TeacherProfile::create([
                'user_id' => $user->id,
            ]);
        }

        return Inertia::render('teacher-profile/show', [
            'profile' => $profile,
            'user' => $user,
            'especialidades' => TeacherProfile::getEspecialidades(),
            'nivelesEducativos' => TeacherProfile::getNivelesEducativos(),
        ]);
    }

    /**
     * Actualizar el perfil del docente
     */
    public function update(Request $request)
    {
        // Verificar que el usuario sea docente
        if (Auth::user()->user_type !== 'docente') {
            return redirect()->route('dashboard')
                ->with('error', 'Solo los docentes pueden acceder a esta sección.');
        }

        $validated = $request->validate([
            'especialidad_principal' => 'nullable|in:' . implode(',', array_keys(TeacherProfile::getEspecialidades())),
            'experiencia_anos' => 'nullable|integer|min:0|max:50',
            'niveles_experiencia' => 'nullable|array',
            'niveles_experiencia.*' => 'in:' . implode(',', array_keys(TeacherProfile::getNivelesEducativos())),
            'ubicacion_actual' => 'nullable|string|max:100',
            'ubicaciones_interes' => 'nullable|array',
            'ubicaciones_interes.*' => 'string|max:100',
            'disponibilidad_horaria' => 'nullable|in:tiempo_completo,medio_tiempo,flexible',
            'tipo_contrato_preferido' => 'nullable|in:contratacion,nombramiento,ambos',
            'telefono' => 'nullable|string|max:15',
            'sobre_mi' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $profile = $user->teacherProfile;

        // Si no tiene perfil, crear uno
        if (!$profile) {
            $validated['user_id'] = $user->id;
            $profile = TeacherProfile::create($validated);
        } else {
            $profile->update($validated);
        }

        return redirect()->back()->with('success', 'Perfil actualizado correctamente. Score actual: ' . $profile->score_perfil . '%');
    }

    /**
     * Obtener estadísticas del perfil para el dashboard
     */
    public function getStats()
    {
        $user = Auth::user();

        if ($user->user_type !== 'docente') {
            return response()->json(['error' => 'Acceso denegado'], 403);
        }

        $profile = $user->teacherProfile;

        if (!$profile) {
            return response()->json([
                'score_perfil' => 0,
                'perfil_completo' => false,
                'campos_faltantes' => [
                    'especialidad_principal',
                    'experiencia_anos',
                    'niveles_experiencia',
                    'ubicacion_actual',
                    'disponibilidad_horaria',
                    'tipo_contrato_preferido',
                    'telefono',
                    'sobre_mi'
                ]
            ]);
        }

        $campos_faltantes = [];
        if (!$profile->especialidad_principal) $campos_faltantes[] = 'especialidad_principal';
        if (!$profile->experiencia_anos) $campos_faltantes[] = 'experiencia_anos';
        if (!$profile->niveles_experiencia || count($profile->niveles_experiencia) === 0) $campos_faltantes[] = 'niveles_experiencia';
        if (!$profile->ubicacion_actual) $campos_faltantes[] = 'ubicacion_actual';
        if (!$profile->disponibilidad_horaria) $campos_faltantes[] = 'disponibilidad_horaria';
        if (!$profile->tipo_contrato_preferido) $campos_faltantes[] = 'tipo_contrato_preferido';
        if (!$profile->telefono) $campos_faltantes[] = 'telefono';
        if (!$profile->sobre_mi) $campos_faltantes[] = 'sobre_mi';

        return response()->json([
            'score_perfil' => $profile->score_perfil,
            'perfil_completo' => $profile->perfil_completo,
            'campos_faltantes' => $campos_faltantes,
        ]);
    }
}
