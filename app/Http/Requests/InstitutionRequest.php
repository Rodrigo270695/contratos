<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class InstitutionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar instituciones
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $institutionId = $this->route('institution')?->id ?? null;

        return [
            'district_id' => [
                'required',
                'exists:districts,id',
                function ($attribute, $value, $fail) {
                    $district = \App\Models\District::find($value);
                    if (!$district || $district->status !== 'active') {
                        $fail('El distrito seleccionado no está activo.');
                    }
                },
            ],
            'name' => [
                'required',
                'string',
                'max:200',
                Rule::unique('institutions', 'name')->ignore($institutionId),
            ],
            'code' => [
                'required',
                'string',
                'max:20',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('institutions', 'code')->ignore($institutionId),
            ],
            'level' => ['required', Rule::in(['inicial', 'primaria', 'secundaria'])],
            'modality' => ['required', Rule::in(['EBR', 'EBA', 'EBE'])],
            'address' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'district_id.required' => 'El distrito es obligatorio.',
            'district_id.exists' => 'El distrito seleccionado no existe.',
            'name.required' => 'El nombre de la institución es obligatorio.',
            'name.max' => 'El nombre de la institución no puede exceder los 200 caracteres.',
            'name.unique' => 'Ya existe una institución con este nombre.',
            'code.required' => 'El código modular es obligatorio.',
            'code.max' => 'El código no puede exceder los 20 caracteres.',
            'code.regex' => 'El código debe contener solo letras mayúsculas, números y guiones.',
            'code.unique' => 'Ya existe una institución con este código modular.',
            'level.required' => 'El nivel educativo es obligatorio.',
            'level.in' => 'El nivel educativo debe ser inicial, primaria o secundaria.',
            'modality.required' => 'La modalidad es obligatoria.',
            'modality.in' => 'La modalidad debe ser EBR, EBA o EBE.',
            'address.max' => 'La dirección no puede exceder los 1000 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
