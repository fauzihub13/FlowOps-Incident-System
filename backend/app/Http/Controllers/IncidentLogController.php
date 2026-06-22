<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidStateTransitionException;
use App\Exceptions\NotAssigneeException;
use App\Http\Requests\Incident\AddLogRequest;
use App\Http\Resources\IncidentLogResource;
use App\Http\Responses\ApiResponse;
use App\Models\Incident;
use App\Services\IncidentWorkflowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class IncidentLogController extends Controller
{
    public function __construct(private IncidentWorkflowService $workflow) {}

    public function store(AddLogRequest $request, Incident $incident): JsonResponse
    {
        try {
            $log = $this->workflow->addLog(
                $incident,
                $request->user(),
                $request->validated('message')
            );
            $log->load('author');

            return ApiResponse::created(
                (new IncidentLogResource($log))->resolve(),
                'Progress log added.'
            );
        } catch (NotAssigneeException $e) {
            return ApiResponse::forbidden($e->getMessage());
        } catch (InvalidStateTransitionException $e) {
            return ApiResponse::conflict($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('IncidentLogController::store failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal menambah log.', 'SERVER_ERROR', 500);
        }
    }
}