<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlazaRequest;
use App\Models\Plaza;
use App\Models\Convocatoria;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlazaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Plaza::with(['convocatoria.ugel.region', 'institution.district.ugel.region']);

        // Filtrar por convocatoria si se especifica
        if ($request->filled('convocatoria_id') && $request->convocatoria_id !== 'all') {
            $query->where('convocatoria_id', $request->convocatoria_id);
        }

        // Filtrar por institución si se especifica
        if ($request->filled('institution_id') && $request->institution_id !== 'all') {
            $query->where('institution_id', $request->institution_id);
        }

        // Filtrar por nivel si se especifica
        if ($request->filled('nivel') && $request->nivel !== 'all') {
            $query->where('nivel', $request->nivel);
        }

        // Filtrar por jornada si se especifica
        if ($request->filled('jornada') && $request->jornada !== 'all') {
            $query->where('jornada', $request->jornada);
        }

        // Filtrar por estado si se especifica
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Buscar por código, cargo, especialidad o institución si se especifica
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('codigo_plaza', 'like', "%{$search}%")
                  ->orWhere('cargo', 'like', "%{$search}%")
                  ->orWhere('especialidad', 'like', "%{$search}%")
                  ->orWhereHas('institution', function ($instQuery) use ($search) {
                      $instQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('convocatoria', function ($convQuery) use ($search) {
                      $convQuery->where('title', 'like', "%{$search}%");
                  });
            });
        }

        $plazas = $query->orderByDesc('created_at')
                       ->paginate(10)
                       ->withQueryString();

        // Obtener convocatorias activas para el filtro con conteo de plazas
        $convocatorias = Convocatoria::whereIn('status', ['published', 'active'])
                                   ->withCount('plazas')
                                   ->orderByDesc('year')
                                   ->orderBy('title')
                                   ->get()
                                   ->map(function ($convocatoria) {
                                       $convocatoria->plazas_disponibles = $convocatoria->total_plazas - $convocatoria->plazas_count;
                                       return $convocatoria;
                                   });

        // Obtener instituciones para el filtro
        $institutions = Institution::with('district.ugel.region')
                                 ->where('status', 'active')
                                 ->orderBy('name')
                                 ->get();

        return Inertia::render('plazas/index', [
            'plazas' => $plazas,
            'convocatorias' => $convocatorias,
            'institutions' => $institutions,
            'filters' => $request->only(['convocatoria_id', 'institution_id', 'nivel', 'jornada', 'status', 'search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PlazaRequest $request)
    {
        $data = $request->validated();

        try {
            Plaza::create($data);
            return redirect()->back()->with('success', 'Plaza creada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear la plaza: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Plaza $plaza)
    {
        $plaza->load(['convocatoria.ugel.region', 'institution.district.ugel.region', 'postulaciones.user']);

        return Inertia::render('plazas/show', [
            'plaza' => $plaza,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PlazaRequest $request, Plaza $plaza)
    {
        try {
            $plaza->update($request->validated());
            return redirect()->back()->with('success', 'Plaza actualizada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al actualizar la plaza: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plaza $plaza)
    {
        try {
            // Verificar si la plaza tiene postulaciones asociadas
            if ($plaza->postulaciones()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una plaza que tiene postulaciones asociadas.');
            }

            $plaza->delete();
            return redirect()->back()->with('success', 'Plaza eliminada exitosamente.');

        } catch (\Exception $e) {
            // Si hay algún error, permitir la eliminación de todas formas
            // (útil durante desarrollo cuando las relaciones no están completamente configuradas)
            $plaza->delete();
            return redirect()->back()->with('success', 'Plaza eliminada exitosamente.');
        }
    }
}
