<?php

namespace App\Policies;

use App\Models\Incident;
use App\Models\User;

class IncidentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['reporter', 'approver', 'assignee'], true);
    }

    public function view(User $user, Incident $incident): bool
    {
        if ($user->isApprover()) {
            return true;
        }

        if ($user->isReporter()) {
            return $incident->reporter_id === $user->id;
        }

        if ($user->isAssignee()) {
            return $incident->assignees()->where('users.id', $user->id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isReporter();
    }

    public function approve(User $user, Incident $incident): bool
    {
        return $user->isApprover() && $incident->status === 'Pending_Approval';
    }

    public function decline(User $user, Incident $incident): bool
    {
        return $user->isApprover() && $incident->status === 'Pending_Approval';
    }

    public function addLog(User $user, Incident $incident): bool
    {
        if (!$user->isAssignee()) {
            return false;
        }

        if ($incident->status !== 'In_Progress') {
            return false;
        }

        return $incident->assignees()->where('users.id', $user->id)->exists();
    }

    public function resolve(User $user, Incident $incident): bool
    {
        return $this->addLog($user, $incident);
    }
}