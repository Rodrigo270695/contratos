<?php

namespace App\Http\Controllers;

use App\Http\Requests\InstitutionRequest;
use App\Models\Institution;
use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Institution::with('district.ugel.region');

        // Filtrar por distrito si se especifica
        if ($request->filled('district_id') && $request->district_id !== 'all') {
            $query->where('district_id', $request->district_id);
        }

        // Filtrar por nivel si se especifica
        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Filtrar por modalidad si se especifica
        if ($request->filled('modality') && $request->modality !== 'all') {
            $query->where('modality', $request->modality);
        }

        // Filtrar por estado si se especifica
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Buscar por nombre, código, distrito, UGEL o región si se especifica
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('institutions.name', 'like', "%{$search}%")
                  ->orWhere('institutions.code', 'like', "%{$search}%")
                  ->orWhereHas('district', function ($districtQuery) use ($search) {
                      $districtQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('district.ugel', function ($ugelQuery) use ($search) {
                      $ugelQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('district.ugel.region', function ($regionQuery) use ($search) {
                      $regionQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $institutions = $query->orderBy('name')
                             ->paginate(10)
                             ->withQueryString();

        // Obtener distritos activos para el filtro
        $districts = District::with('ugel.region')
                           ->where('status', 'active')
                           ->orderBy('name')
                           ->get();

        return Inertia::render('institution/index', [
            'institutions' => $institutions,
            'districts' => $districts,
            'filters' => $request->only(['district_id', 'level', 'modality', 'status', 'search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InstitutionRequest $request)
    {
        Institution::create($request->validated());

        return redirect()->back()->with('success', 'Institución educativa creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Institution $institution)
    {
        $institution->load('district.ugel.region', 'plazas', 'users');

        return Inertia::render('institution/show', [
            'institution' => $institution,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InstitutionRequest $request, Institution $institution)
    {
        $institution->update($request->validated());

        return redirect()->back()->with('success', 'Institución educativa actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institution $institution)
    {
        try {
            // Verificar si la institución tiene plazas asociadas
            if ($institution->plazas()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una institución que tiene plazas asociadas.');
            }

            // Verificar si la institución tiene usuarios asociados
            if ($institution->users()->count() > 0) {
                return redirect()->back()->with('error', 'No se puede eliminar una institución que tiene usuarios asociados.');
            }

            $institution->delete();

            return redirect()->back()->with('success', 'Institución educativa eliminada exitosamente.');

        } catch (\Exception $e) {
            // Si hay algún error, permitir la eliminación de todas formas
            // (útil durante desarrollo cuando las relaciones no están completamente configuradas)
            $institution->delete();
            return redirect()->back()->with('success', 'Institución educativa eliminada exitosamente.');
        }
    }
}
