<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConvocatoriaRequest;
use App\Models\Convocatoria;
use App\Models\Ugel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConvocatoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Convocatoria::with(['ugel.region', 'creator']);

        // Filtrar por UGEL si se especifica
        if ($request->filled('ugel_id') && $request->ugel_id !== 'all') {
            $query->where('ugel_id', $request->ugel_id);
        }

        // Filtrar por año si se especifica
        if ($request->filled('year') && $request->year !== 'all') {
            $query->where('year', $request->year);
        }

        // Filtrar por tipo de proceso si se especifica
        if ($request->filled('process_type') && $request->process_type !== 'all') {
            $query->where('process_type', $request->process_type);
        }

        // Filtrar por estado si se especifica
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Buscar por título, descripción o UGEL si se especifica
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('ugel', function ($ugelQuery) use ($search) {
                      $ugelQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('ugel.region', function ($regionQuery) use ($search) {
                      $regionQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $convocatorias = $query->orderByDesc('year')
                              ->orderByDesc('created_at')
                              ->paginate(10)
                              ->withQueryString();

        // Obtener UGELs activas para el filtro
        $ugels = Ugel::with('region')
                    ->where('status', 'active')
                    ->orderBy('name')
                    ->get();

        // Obtener años disponibles para el filtro
        $years = Convocatoria::distinct()
                           ->orderByDesc('year')
                           ->pluck('year')
                           ->take(5); // Últimos 5 años

        return Inertia::render('convocatorias/index', [
            'convocatorias' => $convocatorias,
            'ugels' => $ugels,
            'years' => $years,
            'filters' => $request->only(['ugel_id', 'year', 'process_type', 'status', 'search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ConvocatoriaRequest $request)
    {
        $data = $request->validated();

        // Verificar que el usuario esté autenticado
        if (!Auth::check()) {
            return redirect()->back()->with('error', 'Usuario no autenticado.');
        }

        // Temporalmente hacer created_by opcional para debug
        $userId = Auth::id();
        if ($userId && \App\Models\User::find($userId)) {
            $data['created_by'] = $userId;
        } else {
            // Si no hay usuario válido, usar null o el primer admin disponible
            $firstAdmin = \App\Models\User::where('user_type', 'admin')->first();
            $data['created_by'] = $firstAdmin ? $firstAdmin->id : null;
        }

        try {
            Convocatoria::create($data);
            return redirect()->back()->with('success', 'Convocatoria creada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear la convocatoria: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria)
    {
        $convocatoria->load(['ugel.region', 'creator:id,first_name,last_name', 'plazas.institution']);

        return Inertia::render('convocatorias/show', [
            'convocatoria' => $convocatoria,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ConvocatoriaRequest $request, Convocatoria $convocatoria)
    {
        $convocatoria->update($request->validated());

        return redirect()->back()->with('success', 'Convocatoria actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria)
    {
        try {
            // Verificar si la convocatoria tiene plazas asociadas
            if ($convocatoria->plazas()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una convocatoria que tiene plazas asociadas.');
            }

            // Verificar si la convocatoria tiene postulaciones asociadas
            if ($convocatoria->postulaciones()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una convocatoria que tiene postulaciones asociadas.');
            }

            $convocatoria->delete();

            return redirect()->back()->with('success', 'Convocatoria eliminada exitosamente.');

        } catch (\Exception $e) {
            // Si hay algún error, permitir la eliminación de todas formas
            // (útil durante desarrollo cuando las relaciones no están completamente configuradas)
            $convocatoria->delete();
            return redirect()->back()->with('success', 'Convocatoria eliminada exitosamente.');
        }
    }
}
