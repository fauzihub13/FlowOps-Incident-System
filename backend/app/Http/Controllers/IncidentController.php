<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidStateTransitionException;
use App\Exceptions\NotAssigneeException;
use App\Http\Requests\Incident\AddLogRequest;
use App\Http\Requests\Incident\ApproveIncidentRequest;
use App\Http\Requests\Incident\CreateIncidentRequest;
use App\Http\Requests\Incident\DeclineIncidentRequest;
use App\Http\Requests\Incident\ResolveIncidentRequest;
use App\Http\Resources\IncidentResource;
use App\Http\Responses\ApiResponse;
use App\Models\Incident;
use App\Models\IncidentLog;
use App\Services\IncidentWorkflowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IncidentController extends Controller
{
    public function __construct(private IncidentWorkflowService $workflow) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $query = Incident::query()->with(['reporter', 'assignees']);

            if ($user->isReporter()) {
                $query->where('reporter_id', $user->id);
            } elseif ($user->isAssignee()) {
                $query->whereHas('assignees', fn ($q) => $q->where('users.id', $user->id));
            }

            if ($status = $request->query('status')) {
                $query->where('status', $status);
            }
            if ($priority = $request->query('priority')) {
                $query->where('priority', $priority);
            }
            if ($category = $request->query('category')) {
                $query->where('category', $category);
            }
            if ($search = $request->query('search')) {
                $query->where('title', 'like', "%{$search}%");
            }

            $sort = $request->query('sort', 'created_at');
            $direction = $request->query('direction', 'desc');
            $query->orderBy($sort, $direction);

            $perPage = (int) $request->query('per_page', 15);
            $page    = (int) $request->query('page', 1);

            $paginator = $query->paginate(perPage: $perPage, page: $page);

            return ApiResponse::success(
                IncidentResource::collection($paginator->items())->resolve(),
                'Incidents retrieved.',
                200,
                [
                    'current_page' => $paginator->currentPage(),
                    'per_page'     => $paginator->perPage(),
                    'total'        => $paginator->total(),
                    'last_page'    => $paginator->lastPage(),
                ]
            );
        } catch (\Throwable $e) {
            Log::error('IncidentController::index failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil daftar insiden.', 'SERVER_ERROR', 500);
        }
    }

    public function store(CreateIncidentRequest $request): JsonResponse
    {
        try {
            $incident = Incident::create([
                ...$request->validated(),
                'reporter_id' => $request->user()->id,
                'status'      => 'Pending_Approval',
            ]);

            IncidentLog::create([
                'incident_id' => $incident->id,
                'author_id'   => $request->user()->id,
                'author_role' => 'reporter',
                'log_type'    => 'created',
                'message'     => 'Insiden dilaporkan.',
            ]);

            $incident->load(['reporter', 'assignees', 'logs']);

            return ApiResponse::created(
                (new IncidentResource($incident))->resolve(),
                'Incident reported successfully.'
            );
        } catch (\Throwable $e) {
            Log::error('IncidentController::store failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal membuat laporan insiden.', 'SERVER_ERROR', 500);
        }
    }

    public function show(Request $request, Incident $incident): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->isReporter() && $incident->reporter_id !== $user->id) {
                return ApiResponse::forbidden('Anda tidak memiliki akses ke insiden ini.');
            }

            if ($user->isAssignee()) {
                $isAssigned = $incident->assignees()->where('users.id', $user->id)->exists();
                if (!$isAssigned) {
                    return ApiResponse::forbidden('Anda tidak memiliki akses ke insiden ini.');
                }
            }

            $incident->load(['reporter', 'approver', 'assignees', 'logs.author']);

            return ApiResponse::success(
                (new IncidentResource($incident))->resolve(),
                'Incident retrieved.'
            );
        } catch (\Throwable $e) {
            Log::error('IncidentController::show failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil detail insiden.', 'SERVER_ERROR', 500);
        }
    }

    public function approve(ApproveIncidentRequest $request, Incident $incident): JsonResponse
    {
        try {
            $count = count($request->validated('assignee_ids'));
            $updated = $this->workflow->approve(
                $incident,
                $request->user(),
                $request->validated('assignee_ids'),
                $request->validated('approval_notes')
            );

            return ApiResponse::success(
                (new IncidentResource($updated))->resolve(),
                "Incident approved and assigned to {$count} assignee(s)."
            );
        } catch (InvalidStateTransitionException $e) {
            return ApiResponse::conflict($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('IncidentController::approve failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal menyetujui insiden.', 'SERVER_ERROR', 500);
        }
    }

    public function decline(DeclineIncidentRequest $request, Incident $incident): JsonResponse
    {
        try {
            $updated = $this->workflow->decline(
                $incident,
                $request->user(),
                $request->validated('rejection_reason')
            );

            return ApiResponse::success(
                (new IncidentResource($updated))->resolve(),
                'Incident declined.'
            );
        } catch (InvalidStateTransitionException $e) {
            return ApiResponse::conflict($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('IncidentController::decline failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal menolak insiden.', 'SERVER_ERROR', 500);
        }
    }

    public function resolve(ResolveIncidentRequest $request, Incident $incident): JsonResponse
    {
        try {
            $updated = $this->workflow->resolve(
                $incident,
                $request->user(),
                $request->validated('resolution_notes')
            );

            return ApiResponse::success(
                (new IncidentResource($updated))->resolve(),
                'Incident resolved.'
            );
        } catch (InvalidStateTransitionException $e) {
            return ApiResponse::conflict($e->getMessage());
        } catch (NotAssigneeException $e) {
            return ApiResponse::forbidden($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('IncidentController::resolve failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal menyelesaikan insiden.', 'SERVER_ERROR', 500);
        }
    }
}