<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar usuarios
        return auth()->user()?->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtener el ID del usuario de forma segura
        $userId = null;
        $usuario = $this->route('usuario');

        if ($usuario) {
            if (is_object($usuario) && property_exists($usuario, 'id')) {
                // Es un objeto User con propiedad id
                $userId = $usuario->id;
            } else {
                // Puede ser un string o número, intentar encontrar el usuario
                $user = \App\Models\User::find($usuario);
                if (!$user) {
                    // Si no se encuentra por ID, intentar por DNI
                    $user = \App\Models\User::where('dni', $usuario)->first();
                }
                $userId = $user ? $user->id : null;
            }
        }

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dni' => [
                'required',
                'string',
                'size:8',
                'regex:/^[0-9]{8}$/',
                Rule::unique('users', 'dni')->ignore($userId)
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId)
            ],
            'phone' => ['nullable', 'string', 'size:9', 'regex:/^[0-9]{9}$/'],
            'password' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:8',
                'confirmed'
            ],
            'user_type' => ['required', Rule::in(['admin', 'docente'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'pending'])],

            // Campos opcionales para docentes
            'education_level' => ['nullable', Rule::in(['technical', 'university', 'bachelor', 'licensed', 'masters', 'doctorate'])],
            'degree_specialty' => ['nullable', 'string', 'max:255'],
            'university' => ['nullable', 'string', 'max:255'],
            'years_experience' => ['nullable', Rule::in(['0', '1-2', '3-5', '6-10', '11-15', '16+'])],
            'preferred_level' => ['nullable', Rule::in(['initial', 'primary', 'secondary', 'technical', 'higher', 'any'])],
            'preferred_modality' => ['nullable', Rule::in(['in_person', 'virtual', 'hybrid', 'any'])],
            'travel_availability' => ['nullable', Rule::in(['yes', 'limited', 'no'])],
            'preferred_location' => ['nullable', 'string', 'max:255'],
            'interest_areas' => ['nullable', 'array'],
            'interest_areas.*' => ['string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'dni.required' => 'El DNI es obligatorio.',
            'dni.size' => 'El DNI debe tener exactamente 8 dígitos.',
            'dni.regex' => 'El DNI debe contener solo números.',
            'dni.unique' => 'Este DNI ya está registrado.',
            'email.unique' => 'Este email ya está registrado.',
            'phone.size' => 'El teléfono debe tener exactamente 9 dígitos.',
            'phone.regex' => 'El teléfono debe contener solo números.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
        ];
    }
}
