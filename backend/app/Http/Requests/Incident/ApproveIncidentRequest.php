<?php

namespace App\Http\Requests\Incident;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ApproveIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isApprover();
    }

    public function rules(): array
    {
        return [
            'assignee_ids'   => ['required', 'array', 'min:1'],
            'assignee_ids.*' => ['integer', 'exists:users,id'],
            'approval_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'assignee_ids.required' => 'Minimal 1 assignee harus dipilih.',
            'assignee_ids.min'      => 'Minimal 1 assignee harus dipilih.',
            'assignee_ids.*.exists' => 'Assignee yang dipilih tidak valid.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            if (!$v->errors()->isEmpty()) {
                return;
            }

            $ids = (array) $this->input('assignee_ids', []);

            $invalid = \App\Models\User::query()
                ->whereIn('id', $ids)
                ->where(function ($q) {
                    $q->where('role', '!=', 'assignee')->orWhere('is_active', false);
                })
                ->exists();

            if ($invalid) {
                $v->errors()->add(
                    'assignee_ids',
                    'Semua assignee harus memiliki role "assignee" dan berstatus aktif.'
                );
            }
        });
    }
}