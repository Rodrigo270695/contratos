<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DistrictRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar distritos
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $districtId = $this->route('district')?->id ?? null;

        return [
            'ugel_id' => [
                'required',
                'exists:ugels,id',
                function ($attribute, $value, $fail) {
                    $ugel = \App\Models\Ugel::find($value);
                    if (!$ugel || $ugel->status !== 'active') {
                        $fail('La UGEL seleccionada no está activa.');
                    }
                },
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('districts', 'name')->ignore($districtId),
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('districts', 'code')->ignore($districtId),
            ],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'ugel_id.required' => 'La UGEL es obligatoria.',
            'ugel_id.exists' => 'La UGEL seleccionada no existe.',
            'name.required' => 'El nombre del distrito es obligatorio.',
            'name.max' => 'El nombre del distrito no puede exceder los 100 caracteres.',
            'name.unique' => 'Ya existe un distrito con este nombre.',
            'code.required' => 'El código del distrito es obligatorio.',
            'code.max' => 'El código no puede exceder los 10 caracteres.',
            'code.regex' => 'El código debe contener solo letras mayúsculas, números y guiones.',
            'code.unique' => 'Ya existe un distrito con este código.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
