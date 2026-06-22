<?php

namespace App\Http\Requests\Incident;

use Illuminate\Foundation\Http\FormRequest;

class CreateIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isReporter();
    }

    public function rules(): array
    {
        return [
            'title'          => ['required', 'string', 'max:255'],
            'description'    => ['required', 'string', 'min:30'],
            'category'       => ['required', 'in:IT,Facility,HR,Security,Other'],
            'priority'       => ['required', 'in:Low,Medium,High,Critical'],
            'location'       => ['nullable', 'string', 'max:255'],
            'attachment_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Judul insiden wajib diisi.',
            'description.required' => 'Deskripsi wajib diisi.',
            'description.min'      => 'Deskripsi minimal 30 karakter.',
            'category.required'    => 'Kategori wajib dipilih.',
            'priority.required'    => 'Prioritas wajib dipilih.',
            'attachment_url.url'   => 'URL lampiran tidak valid.',
        ];
    }
}