<?php

namespace App\Http\Requests\Incident;

use Illuminate\Foundation\Http\FormRequest;

class ResolveIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isAssignee();
    }

    public function rules(): array
    {
        return [
            'resolution_notes' => ['required', 'string', 'min:20', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'resolution_notes.required' => 'Catatan resolusi wajib diisi.',
            'resolution_notes.min'      => 'Catatan resolusi minimal 20 karakter.',
            'resolution_notes.max'      => 'Catatan resolusi maksimal 2000 karakter.',
        ];
    }
}