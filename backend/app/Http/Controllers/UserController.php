<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function assignees(): JsonResponse
    {
        try {
            $users = User::query()
                ->where('role', 'assignee')
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            return ApiResponse::success(
                $users->map(fn ($u) => [
                    'id'         => $u->id,
                    'name'       => $u->name,
                    'email'      => $u->email,
                    'department' => $u->department,
                ])->values(),
                'Assignees retrieved.'
            );
        } catch (\Throwable $e) {
            Log::error('UserController::assignees failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil daftar assignee.', 'SERVER_ERROR', 500);
        }
    }
}