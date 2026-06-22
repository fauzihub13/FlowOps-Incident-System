<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'priority',
        'status',
        'location',
        'attachment_url',
        'reporter_id',
        'approver_id',
        'rejection_reason',
        'approval_notes',
        'resolution_notes',
        'approved_at',
        'rejected_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'incident_assignees')
                    ->withPivot(['assigned_at', 'assigned_by']);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(IncidentLog::class)->orderBy('created_at', 'asc');
    }

    public function isFinal(): bool
    {
        return in_array($this->status, ['Resolved', 'Rejected'], true);
    }
}