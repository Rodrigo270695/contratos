<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ConvocatoriaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo administradores pueden gestionar convocatorias
        return Auth::check() && Auth::user()->user_type === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $convocatoriaId = $this->route('convocatoria')?->id ?? null;

        // Obtener el estado actual de la convocatoria (si existe)
        $convocatoriaActual = $convocatoriaId ? \App\Models\Convocatoria::find($convocatoriaId) : null;
        $estadoActual = $convocatoriaActual ? $convocatoriaActual->status : null;

        // Obtener el nuevo estado que se está enviando
        $nuevoEstado = $this->input('status', 'draft');

        // Solo aplicar validaciones de fechas pasadas si la convocatoria está o será publicada/activa
        $requiereValidacionFechas = in_array($nuevoEstado, ['published', 'active']) ||
                                   in_array($estadoActual, ['published', 'active']);

        $rules = [
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
            'title' => [
                'required',
                'string',
                'max:300',
                Rule::unique('convocatorias', 'title')->ignore($convocatoriaId),
            ],
            'description' => ['nullable', 'string', 'max:5000'],
            'year' => [
                'required',
                'integer',
                'min:2020',
                'max:' . (date('Y') + 2), // Hasta 2 años en el futuro
            ],
            'process_type' => ['required', Rule::in(['contratacion', 'nombramiento'])],
            'start_date' => [
                'required',
                'date',
            ],
            'end_date' => [
                'required',
                'date',
                'after:start_date',
            ],
            'registration_start' => [
                'required',
                'date',
                'before_or_equal:start_date',
            ],
            'registration_end' => [
                'required',
                'date',
                'after:registration_start',
                'before_or_equal:end_date',
            ],
            'status' => ['required', Rule::in(['draft', 'published', 'active', 'closed', 'cancelled'])],
            'total_plazas' => ['nullable', 'integer', 'min:0', 'max:10000'],
        ];

        // Solo agregar validación de fecha pasada si requiere validación de fechas
        if ($requiereValidacionFechas) {
            $rules['start_date'][] = function ($attribute, $value, $fail) use ($estadoActual, $nuevoEstado) {
                // Si está cambiando de draft a published/active, validar que la fecha no sea pasada
                if ($estadoActual === 'draft' && in_array($nuevoEstado, ['published', 'active'])) {
                    if (strtotime($value) < strtotime('today')) {
                        $fail('La fecha de inicio no puede ser anterior a hoy cuando se publica la convocatoria.');
                    }
                }
                // Si ya está published/active, no permitir cambiar a fecha pasada
                elseif (in_array($estadoActual, ['published', 'active']) && strtotime($value) < strtotime('today')) {
                    $fail('No se puede cambiar la fecha de inicio a una fecha pasada en una convocatoria publicada o activa.');
                }
            };
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'ugel_id.required' => 'La UGEL es obligatoria.',
            'ugel_id.exists' => 'La UGEL seleccionada no existe.',
            'title.required' => 'El título de la convocatoria es obligatorio.',
            'title.max' => 'El título no puede exceder los 300 caracteres.',
            'title.unique' => 'Ya existe una convocatoria con este título.',
            'description.max' => 'La descripción no puede exceder los 5000 caracteres.',
            'year.required' => 'El año es obligatorio.',
            'year.integer' => 'El año debe ser un número válido.',
            'year.min' => 'El año no puede ser anterior a 2020.',
            'year.max' => 'El año no puede ser más de 2 años en el futuro.',
            'process_type.required' => 'El tipo de proceso es obligatorio.',
            'process_type.in' => 'El tipo de proceso debe ser contratación o nombramiento.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida.',
            'end_date.required' => 'La fecha de fin es obligatoria.',
            'end_date.date' => 'La fecha de fin debe ser una fecha válida.',
            'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
            'registration_start.required' => 'La fecha de inicio de inscripciones es obligatoria.',
            'registration_start.date' => 'La fecha de inicio de inscripciones debe ser una fecha válida.',
            'registration_start.before_or_equal' => 'Las inscripciones deben iniciar antes o el mismo día que la convocatoria.',
            'registration_end.required' => 'La fecha de fin de inscripciones es obligatoria.',
            'registration_end.date' => 'La fecha de fin de inscripciones debe ser una fecha válida.',
            'registration_end.after' => 'El fin de inscripciones debe ser posterior al inicio de inscripciones.',
            'registration_end.before_or_equal' => 'Las inscripciones deben terminar antes o el mismo día que la convocatoria.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser: borrador, publicado, activo, cerrado o cancelado.',
            'total_plazas.integer' => 'El total de plazas debe ser un número.',
            'total_plazas.min' => 'El total de plazas no puede ser negativo.',
            'total_plazas.max' => 'El total de plazas no puede exceder 10,000.',
        ];
    }
}
