<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\IncidentLogController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me',      [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('users/assignees', [UserController::class, 'assignees'])
        ->middleware('role:approver');

    Route::get('incidents',          [IncidentController::class, 'index']);
    Route::post('incidents',         [IncidentController::class, 'store'])->middleware('role:reporter');
    Route::get('incidents/{incident}', [IncidentController::class, 'show']);

    Route::patch('incidents/{incident}/approve', [IncidentController::class, 'approve'])
        ->middleware('role:approver');
    Route::patch('incidents/{incident}/decline', [IncidentController::class, 'decline'])
        ->middleware('role:approver');
    Route::post('incidents/{incident}/logs',      [IncidentLogController::class, 'store'])
        ->middleware('role:assignee');
    Route::patch('incidents/{incident}/resolve',  [IncidentController::class, 'resolve'])
        ->middleware('role:assignee');
});