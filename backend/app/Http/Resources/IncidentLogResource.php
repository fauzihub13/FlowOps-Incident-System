<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'incident_id' => $this->incident_id,
            'log_type'    => $this->log_type,
            'message'     => $this->message,
            'meta'        => $this->meta,
            'author'      => $this->whenLoaded('author', fn () => [
                'id'   => $this->author->id,
                'name' => $this->author->name,
                'role' => $this->author_role,
            ]),
            'author_role' => $this->author_role,
            'created_at'  => optional($this->created_at)->toIso8601String(),
        ];
    }
}