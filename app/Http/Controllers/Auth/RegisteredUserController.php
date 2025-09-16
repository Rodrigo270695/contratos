<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            // Datos Personales
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dni' => 'required|digits:8|numeric|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|digits:9|numeric',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Formación Académica
            'education_level' => 'nullable|in:technical,university,bachelor,licensed,masters,doctorate',
            'degree_specialty' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',

            // Experiencia Docente
            'years_experience' => 'nullable|in:0,1-2,3-5,6-10,11-15,16+',

            // Preferencias Laborales
            'preferred_level' => 'nullable|in:initial,primary,secondary,technical,higher,any',
            'preferred_modality' => 'nullable|in:in_person,virtual,hybrid,any',
            'travel_availability' => 'nullable|in:yes,limited,no',
            'preferred_location' => 'nullable|string|max:255',

            // Áreas de Interés
            'interest_areas' => 'nullable|array',
            'interest_areas.*' => 'string|max:100',
        ]);

        $user = User::create([
            // Datos Personales
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'dni' => $request->dni,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'user_type' => 'docente', // Por defecto todos son docentes
            'status' => 'pending', // Requieren activación

            // Campos para Sistema de Recomendaciones IA
            'education_level' => $request->education_level,
            'degree_specialty' => $request->degree_specialty,
            'university' => $request->university,
            'years_experience' => $request->years_experience,
            'preferred_level' => $request->preferred_level,
            'preferred_modality' => $request->preferred_modality,
            'travel_availability' => $request->travel_availability,
            'preferred_location' => $request->preferred_location,
            'interest_areas' => $request->interest_areas ? json_encode($request->interest_areas) : null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Los docentes registrados van a la página principal para ver convocatorias
        return redirect()->intended(route('inicio', absolute: false));
    }
}
