<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RegionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar regiones
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtener el ID de la región de forma segura
        $regionId = null;
        $region = $this->route('regione'); // Laravel pluraliza automáticamente

        if ($region) {
            if (is_object($region) && property_exists($region, 'id')) {
                // Es un objeto Region con propiedad id
                $regionId = $region->id;
            } else {
                // Puede ser un string o número, intentar encontrar la región
                $regionModel = \App\Models\Region::find($region);
                if (!$regionModel) {
                    // Si no se encuentra por ID, intentar por código
                    $regionModel = \App\Models\Region::where('code', $region)->first();
                }
                $regionId = $regionModel ? $regionModel->id : null;
            }
        }

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('regions', 'name')->ignore($regionId)
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                'regex:/^[A-Z0-9]+$/',
                Rule::unique('regions', 'code')->ignore($regionId)
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
            'name.required' => 'El nombre de la región es obligatorio.',
            'name.max' => 'El nombre de la región no puede exceder los 100 caracteres.',
            'name.unique' => 'Ya existe una región con este nombre.',
            'code.required' => 'El código de la región es obligatorio.',
            'code.max' => 'El código no puede exceder los 10 caracteres.',
            'code.regex' => 'El código debe contener solo letras mayúsculas y números.',
            'code.unique' => 'Ya existe una región con este código.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
