<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UgelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar UGELs
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $ugelId = $this->route('ugel')?->id ?? null;

        return [
            'region_id' => [
                'required',
                'exists:regions,id',
                function ($attribute, $value, $fail) {
                    $region = \App\Models\Region::find($value);
                    if (!$region || $region->status !== 'active') {
                        $fail('La región seleccionada no está activa.');
                    }
                },
            ],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('ugels', 'name')->ignore($ugelId),
            ],
            'code' => [
                'required',
                'string',
                'max:15',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('ugels', 'code')->ignore($ugelId),
            ],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:15', 'regex:/^[\d\s\-\+\(\)]+$/'],
            'email' => ['nullable', 'email', 'max:100'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'region_id.required' => 'La región es obligatoria.',
            'region_id.exists' => 'La región seleccionada no existe.',
            'name.required' => 'El nombre de la UGEL es obligatorio.',
            'name.max' => 'El nombre de la UGEL no puede exceder los 150 caracteres.',
            'name.unique' => 'Ya existe una UGEL con este nombre.',
            'code.required' => 'El código de la UGEL es obligatorio.',
            'code.max' => 'El código no puede exceder los 15 caracteres.',
            'code.regex' => 'El código debe contener solo letras mayúsculas, números y guiones.',
            'code.unique' => 'Ya existe una UGEL con este código.',
            'address.max' => 'La dirección no puede exceder los 500 caracteres.',
            'phone.max' => 'El teléfono no puede exceder los 15 caracteres.',
            'phone.regex' => 'El formato del teléfono no es válido.',
            'email.email' => 'El formato del email no es válido.',
            'email.max' => 'El email no puede exceder los 100 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
