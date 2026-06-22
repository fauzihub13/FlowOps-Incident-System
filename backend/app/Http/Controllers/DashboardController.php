<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Incident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $query = Incident::query();

            if ($user->isReporter()) {
                $query->where('reporter_id', $user->id);
            } elseif ($user->isAssignee()) {
                $query->whereHas('assignees', fn ($q) => $q->where('users.id', $user->id));
            }

            $counts = (clone $query)
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status');

            $stats = [
                'total'             => $counts->sum(),
                'pending_approval'  => (int) ($counts['Pending_Approval'] ?? 0),
                'in_progress'       => (int) ($counts['In_Progress']      ?? 0),
                'resolved'          => (int) ($counts['Resolved']         ?? 0),
                'rejected'          => (int) ($counts['Rejected']         ?? 0),
            ];

            $recent = (clone $query)
                ->with(['reporter', 'assignees'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(fn ($i) => [
                    'id'        => $i->id,
                    'title'     => $i->title,
                    'category'  => $i->category,
                    'priority'  => $i->priority,
                    'status'    => $i->status,
                    'reporter'  => $i->reporter ? ['id' => $i->reporter->id, 'name' => $i->reporter->name] : null,
                    'assignees' => $i->assignees->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])->values(),
                    'created_at'=> optional($i->created_at)->toIso8601String(),
                ])
                ->values();

            return ApiResponse::success([
                'stats'  => $stats,
                'recent' => $recent,
            ], 'Dashboard stats retrieved.');
        } catch (\Throwable $e) {
            Log::error('DashboardController::stats failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil statistik.', 'SERVER_ERROR', 500);
        }
    }
}