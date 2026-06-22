<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'department', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    public function reportedIncidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'reporter_id');
    }

    public function approvedIncidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'approver_id');
    }

    public function assignedIncidents(): BelongsToMany
    {
        return $this->belongsToMany(Incident::class, 'incident_assignees')
                    ->withPivot(['assigned_at', 'assigned_by']);
    }

    public function incidentLogs(): HasMany
    {
        return $this->hasMany(IncidentLog::class, 'author_id');
    }

    public function isReporter(): bool
    {
        return $this->role === 'reporter';
    }

    public function isApprover(): bool
    {
        return $this->role === 'approver';
    }

    public function isAssignee(): bool
    {
        return $this->role === 'assignee';
    }
}