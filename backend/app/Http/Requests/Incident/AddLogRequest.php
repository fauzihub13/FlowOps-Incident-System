<?php

namespace App\Http\Requests\Incident;

use Illuminate\Foundation\Http\FormRequest;

class AddLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isAssignee();
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:5', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required' => 'Catatan log wajib diisi.',
            'message.min'      => 'Catatan log minimal 5 karakter.',
            'message.max'      => 'Catatan log maksimal 1000 karakter.',
        ];
    }
}