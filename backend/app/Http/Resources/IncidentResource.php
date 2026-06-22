<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'description'      => $this->description,
            'category'         => $this->category,
            'priority'         => $this->priority,
            'status'           => $this->status,
            'location'         => $this->location,
            'attachment_url'   => $this->attachment_url,
            'rejection_reason' => $this->rejection_reason,
            'approval_notes'   => $this->approval_notes,
            'resolution_notes' => $this->resolution_notes,
            'reporter'         => $this->whenLoaded('reporter', fn () => [
                'id'   => $this->reporter->id,
                'name' => $this->reporter->name,
            ]),
            'approver'         => $this->whenLoaded('approver', fn () => $this->approver ? [
                'id'   => $this->approver->id,
                'name' => $this->approver->name,
            ] : null),
            'assignees'        => $this->whenLoaded('assignees', fn () => $this->assignees->map(function ($u) {
                $assignedAt = $u->pivot->assigned_at;
                if ($assignedAt && !$assignedAt instanceof \DateTimeInterface) {
                    try {
                        $assignedAt = \Illuminate\Support\Carbon::parse($assignedAt);
                    } catch (\Throwable) {
                        $assignedAt = null;
                    }
                }
                return [
                    'id'          => $u->id,
                    'name'        => $u->name,
                    'assigned_at' => $assignedAt?->toIso8601String(),
                ];
            })->values()),
            'logs'             => $this->whenLoaded('logs', fn () => IncidentLogResource::collection($this->logs)),
            'approved_at'      => optional($this->approved_at)->toIso8601String(),
            'rejected_at'      => optional($this->rejected_at)->toIso8601String(),
            'resolved_at'      => optional($this->resolved_at)->toIso8601String(),
            'created_at'       => optional($this->created_at)->toIso8601String(),
            'updated_at'       => optional($this->updated_at)->toIso8601String(),
        ];
    }
}