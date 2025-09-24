<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PlazaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar plazas
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $plazaId = $this->route('plaza')?->id ?? null;

        return [
            'convocatoria_id' => [
                'required',
                'exists:convocatorias,id',
                function ($attribute, $value, $fail) {
                    $convocatoria = \App\Models\Convocatoria::find($value);
                    if (!$convocatoria || !in_array($convocatoria->status, ['published', 'active'])) {
                        $fail('La convocatoria seleccionada debe estar publicada o activa.');
                        return;
                    }

                    // Validar límite de plazas
                    $plazaId = $this->route('plaza')?->id ?? null;
                    $plazasExistentes = \App\Models\Plaza::where('convocatoria_id', $value)
                        ->when($plazaId, function ($query, $plazaId) {
                            return $query->where('id', '!=', $plazaId);
                        })
                        ->count();

                    if ($plazasExistentes >= $convocatoria->total_plazas) {
                        $fail("Esta convocatoria ya tiene el máximo de plazas permitidas ({$convocatoria->total_plazas}). Plazas actuales: {$plazasExistentes}");
                    }
                },
            ],
            'institution_id' => [
                'required',
                'exists:institutions,id',
                function ($attribute, $value, $fail) {
                    $institution = \App\Models\Institution::find($value);
                    if (!$institution || $institution->status !== 'active') {
                        $fail('La institución seleccionada no está activa.');
                    }
                },
            ],
            'codigo_plaza' => [
                'required',
                'string',
                'max:30',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('plazas', 'codigo_plaza')->ignore($plazaId),
            ],
            'cargo' => ['required', 'string', 'max:150'],
            'nivel' => ['required', Rule::in(['inicial', 'primaria', 'secundaria'])],
            'especialidad' => ['nullable', 'string', 'max:100'],
            'jornada' => ['required', Rule::in(['25', '30', '40'])],
            'monto_pago' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'vacantes' => ['required', 'integer', 'min:1', 'max:50'],
            'motivo_vacante' => ['required', 'string', 'max:200'],
            'requisitos' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::in(['active', 'filled', 'cancelled'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'convocatoria_id.required' => 'La convocatoria es obligatoria.',
            'convocatoria_id.exists' => 'La convocatoria seleccionada no existe.',
            'institution_id.required' => 'La institución educativa es obligatoria.',
            'institution_id.exists' => 'La institución seleccionada no existe.',
            'codigo_plaza.required' => 'El código de plaza es obligatorio.',
            'codigo_plaza.max' => 'El código de plaza no puede exceder los 30 caracteres.',
            'codigo_plaza.regex' => 'El código de plaza solo puede contener letras mayúsculas, números y guiones.',
            'codigo_plaza.unique' => 'Ya existe una plaza con este código.',
            'cargo.required' => 'El cargo es obligatorio.',
            'cargo.max' => 'El cargo no puede exceder los 150 caracteres.',
            'nivel.required' => 'El nivel educativo es obligatorio.',
            'nivel.in' => 'El nivel debe ser inicial, primaria o secundaria.',
            'especialidad.max' => 'La especialidad no puede exceder los 100 caracteres.',
            'jornada.required' => 'La jornada laboral es obligatoria.',
            'jornada.in' => 'La jornada debe ser de 25, 30 o 40 horas.',
            'monto_pago.numeric' => 'El monto de pago debe ser un número válido.',
            'monto_pago.min' => 'El monto de pago no puede ser negativo.',
            'monto_pago.max' => 'El monto de pago no puede exceder S/ 999,999.99.',
            'vacantes.required' => 'El número de vacantes es obligatorio.',
            'vacantes.integer' => 'El número de vacantes debe ser un número entero.',
            'vacantes.min' => 'Debe haber al menos 1 vacante.',
            'vacantes.max' => 'No puede haber más de 50 vacantes por plaza.',
            'motivo_vacante.required' => 'El motivo de la vacante es obligatorio.',
            'motivo_vacante.max' => 'El motivo no puede exceder los 200 caracteres.',
            'requisitos.max' => 'Los requisitos no pueden exceder los 5000 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo, ocupado o cancelado.',
        ];
    }
}
