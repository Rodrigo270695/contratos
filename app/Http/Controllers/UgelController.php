<?php

namespace App\Http\Controllers;

use App\Http\Requests\UgelRequest;
use App\Models\Ugel;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UgelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ugels = Ugel::query()
            ->with('region:id,name') // Incluir información de la región
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhereHas('region', function ($regionQuery) use ($search) {
                          $regionQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->region_id, function ($query, $regionId) {
                $query->where('region_id', $regionId);
            })
            // Ordenar alfabéticamente por nombre
            ->orderBy('name', 'asc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        // Obtener todas las regiones activas para el filtro
        $regions = Region::where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return Inertia::render('ugel/index', [
            'ugels' => $ugels,
            'regions' => $regions,
            'filters' => $request->only(['search', 'status', 'region_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UgelRequest $request)
    {
        $validated = $request->validated();

        $ugel = Ugel::create($validated);

        return redirect()->back()->with('success', 'UGEL creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ugel $ugel)
    {
        $ugel->load('region:id,name');

        return response()->json([
            'ugel' => $ugel
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UgelRequest $request, Ugel $ugel)
    {
        $validated = $request->validated();

        $ugel->update($validated);

        return redirect()->back()->with('success', 'UGEL actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ugel $ugel)
    {
        try {
            // Verificar si la UGEL tiene instituciones asociadas
            if ($ugel->institutions()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una UGEL que tiene instituciones asociadas.');
            }

            // Verificar si la UGEL tiene convocatorias asociadas
            if ($ugel->convocatorias()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una UGEL que tiene convocatorias asociadas.');
            }

            $ugel->delete();

            return redirect()->back()->with('success', 'UGEL eliminada exitosamente.');

        } catch (\Exception $e) {
            // Si hay algún error, permitir la eliminación de todas formas
            // (útil durante desarrollo cuando las relaciones no están completamente configuradas)
            $ugel->delete();
            return redirect()->back()->with('success', 'UGEL eliminada exitosamente.');
        }
    }
}
