<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('dni', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->user_type, function ($query, $userType) {
                $query->where('user_type', $userType);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            // Ordenar primero por tipo de usuario (admin primero), luego alfabéticamente
            ->orderByRaw("CASE WHEN user_type = 'admin' THEN 1 ELSE 2 END")
            ->orderBy('first_name', 'asc')
            ->orderBy('last_name', 'asc')
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('usuario/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'user_type', 'status']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $validated = $request->validated();

        // Forzar que solo se puedan crear administradores
        $validated['user_type'] = 'admin';

        // Hash password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Convert interest_areas to JSON if provided
        if (isset($validated['interest_areas'])) {
            $validated['interest_areas'] = json_encode($validated['interest_areas']);
        }

        $user = User::create($validated);

        return redirect()->back()->with('success', 'Usuario administrador creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $validated = $request->validated();

        // Forzar que solo se mantengan como administradores
        $validated['user_type'] = 'admin';

        // Hash password if provided
        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Convert interest_areas to JSON if provided
        if (isset($validated['interest_areas'])) {
            $validated['interest_areas'] = json_encode($validated['interest_areas']);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Usuario administrador actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevenir que el admin se elimine a sí mismo
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado exitosamente.');
    }
}
