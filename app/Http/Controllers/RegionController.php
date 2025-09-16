<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegionRequest;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $regions = Region::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            // Ordenar alfabéticamente por nombre
            ->orderBy('name', 'asc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('region/index', [
            'regions' => $regions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RegionRequest $request)
    {
        $validated = $request->validated();

        $region = Region::create($validated);

        return redirect()->back()->with('success', 'Región creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Region $region)
    {
        return response()->json([
            'region' => $region
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RegionRequest $request, Region $region)
    {
        $validated = $request->validated();

        $region->update($validated);

        return redirect()->back()->with('success', 'Región actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Region $region)
    {
        // Verificar si la región tiene UGELs asociadas
        if ($region->ugels()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar una región que tiene UGELs asociadas.');
        }

        $region->delete();

        return redirect()->back()->with('success', 'Región eliminada exitosamente.');
    }
}
