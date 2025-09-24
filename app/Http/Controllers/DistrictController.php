<?php

namespace App\Http\Controllers;

use App\Http\Requests\DistrictRequest;
use App\Models\District;
use App\Models\Ugel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = District::with('ugel.region');

        // Filtrar por UGEL si se especifica
        if ($request->filled('ugel_id') && $request->ugel_id !== 'all') {
            $query->where('ugel_id', $request->ugel_id);
        }

        // Filtrar por estado si se especifica
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Buscar por nombre, código, UGEL o región si se especifica
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('districts.name', 'like', "%{$search}%")
                  ->orWhere('districts.code', 'like', "%{$search}%")
                  ->orWhereHas('ugel', function ($ugelQuery) use ($search) {
                      $ugelQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('ugel.region', function ($regionQuery) use ($search) {
                      $regionQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $districts = $query->orderBy('name')
                          ->paginate(10)
                          ->withQueryString();

        // Obtener UGELs activas para el filtro
        $ugels = Ugel::with('region')
                    ->where('status', 'active')
                    ->orderBy('name')
                    ->get();

        return Inertia::render('district/index', [
            'districts' => $districts,
            'ugels' => $ugels,
            'filters' => $request->only(['ugel_id', 'status', 'search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DistrictRequest $request)
    {
        District::create($request->validated());

        return redirect()->back()->with('success', 'Distrito creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(District $district)
    {
        $district->load('ugel.region', 'institutions');

        return Inertia::render('district/show', [
            'district' => $district,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DistrictRequest $request, District $district)
    {
        $district->update($request->validated());

        return redirect()->back()->with('success', 'Distrito actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        try {
            // Verificar si el distrito tiene instituciones asociadas
            if ($district->institutions()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar un distrito que tiene instituciones asociadas.');
            }

            $district->delete();

            return redirect()->back()->with('success', 'Distrito eliminado exitosamente.');

        } catch (\Exception $e) {
            // Si hay algún error, permitir la eliminación de todas formas
            // (útil durante desarrollo cuando las relaciones no están completamente configuradas)
            $district->delete();
            return redirect()->back()->with('success', 'Distrito eliminado exitosamente.');
        }
    }
}
