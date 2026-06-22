<?php

namespace App\Services;

use App\Exceptions\InvalidStateTransitionException;
use App\Exceptions\NotAssigneeException;
use App\Models\Incident;
use App\Models\IncidentAssignee;
use App\Models\IncidentLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class IncidentWorkflowService
{
    public const ALLOWED_TRANSITIONS = [
        'Pending_Approval' => ['In_Progress', 'Rejected'],
        'In_Progress'      => ['Resolved'],
        'Resolved'         => [],
        'Rejected'         => [],
    ];

    public function approve(
        Incident $incident,
        User $approver,
        array $assigneeIds,
        ?string $approvalNotes
    ): Incident {
        try {
            $this->assertTransition($incident->status, 'In_Progress');

            return DB::transaction(function () use ($incident, $approver, $assigneeIds, $approvalNotes) {
                $incident->update([
                    'status'         => 'In_Progress',
                    'approver_id'    => $approver->id,
                    'approval_notes' => $approvalNotes,
                    'approved_at'    => now(),
                ]);

                $pivotData = collect($assigneeIds)->map(fn ($id) => [
                    'incident_id' => $incident->id,
                    'user_id'     => $id,
                    'assigned_by' => $approver->id,
                    'assigned_at' => now(),
                ])->all();

                IncidentAssignee::insert($pivotData);

                $assigneeNames = User::whereIn('id', $assigneeIds)->pluck('name')->join(', ');
                IncidentLog::create([
                    'incident_id' => $incident->id,
                    'author_id'   => $approver->id,
                    'author_role' => 'approver',
                    'log_type'    => 'approved',
                    'message'     => "Insiden disetujui dan ditugaskan kepada: {$assigneeNames}.",
                    'meta'        => ['assignee_ids' => $assigneeIds],
                ]);

                return $incident->fresh(['assignees', 'logs', 'reporter', 'approver']);
            });
        } catch (InvalidStateTransitionException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('IncidentWorkflowService::approve failed', [
                'incident_id' => $incident->id,
                'error'       => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function decline(Incident $incident, User $approver, string $reason): Incident
    {
        try {
            $this->assertTransition($incident->status, 'Rejected');

            return DB::transaction(function () use ($incident, $approver, $reason) {
                $incident->update([
                    'status'           => 'Rejected',
                    'approver_id'      => $approver->id,
                    'rejection_reason' => $reason,
                    'rejected_at'      => now(),
                ]);

                IncidentLog::create([
                    'incident_id' => $incident->id,
                    'author_id'   => $approver->id,
                    'author_role' => 'approver',
                    'log_type'    => 'declined',
                    'message'     => "Insiden ditolak. Alasan: {$reason}",
                ]);

                return $incident->fresh(['assignees', 'logs', 'reporter', 'approver']);
            });
        } catch (InvalidStateTransitionException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('IncidentWorkflowService::decline failed', [
                'incident_id' => $incident->id,
                'error'       => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function addLog(Incident $incident, User $assignee, string $message): IncidentLog
    {
        try {
            $this->assertIsAssignee($incident, $assignee);

            if ($incident->status !== 'In_Progress') {
                throw new InvalidStateTransitionException(
                    "Log hanya dapat ditambahkan ketika insiden berstatus 'In_Progress'."
                );
            }

            return IncidentLog::create([
                'incident_id' => $incident->id,
                'author_id'   => $assignee->id,
                'author_role' => 'assignee',
                'log_type'    => 'progress_update',
                'message'     => $message,
            ])->fresh('author');
        } catch (NotAssigneeException | InvalidStateTransitionException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('IncidentWorkflowService::addLog failed', [
                'incident_id' => $incident->id,
                'error'       => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function resolve(Incident $incident, User $assignee, string $resolutionNotes): Incident
    {
        try {
            $this->assertTransition($incident->status, 'Resolved');
            $this->assertIsAssignee($incident, $assignee);

            return DB::transaction(function () use ($incident, $assignee, $resolutionNotes) {
                $incident->update([
                    'status'           => 'Resolved',
                    'resolution_notes' => $resolutionNotes,
                    'resolved_at'      => now(),
                ]);

                IncidentLog::create([
                    'incident_id' => $incident->id,
                    'author_id'   => $assignee->id,
                    'author_role' => 'assignee',
                    'log_type'    => 'resolved',
                    'message'     => "Insiden diselesaikan. Catatan: {$resolutionNotes}",
                ]);

                return $incident->fresh(['assignees', 'logs', 'reporter', 'approver']);
            });
        } catch (InvalidStateTransitionException | NotAssigneeException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('IncidentWorkflowService::resolve failed', [
                'incident_id' => $incident->id,
                'error'       => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function assertTransition(string $from, string $to): void
    {
        $allowed = self::ALLOWED_TRANSITIONS[$from] ?? [];
        if (!in_array($to, $allowed, true)) {
            throw new InvalidStateTransitionException(
                "Tidak dapat mengubah status dari '{$from}' ke '{$to}'."
            );
        }
    }

    private function assertIsAssignee(Incident $incident, User $user): void
    {
        $isAssigned = IncidentAssignee::where('incident_id', $incident->id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isAssigned) {
            throw new NotAssigneeException('Anda tidak ter-assign ke insiden ini.');
        }
    }
}