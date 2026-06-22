<?php

use App\Exceptions\InvalidStateTransitionException;
use App\Exceptions\NotAssigneeException;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Responses\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );

        $exceptions->render(function (InvalidStateTransitionException $e, Request $request) {
            return ApiResponse::conflict($e->getMessage());
        });

        $exceptions->render(function (NotAssigneeException $e, Request $request) {
            return ApiResponse::forbidden($e->getMessage());
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return ApiResponse::unauthorized('Unauthenticated.');
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            return ApiResponse::notFound('Resource tidak ditemukan.');
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            return ApiResponse::notFound('Endpoint tidak ditemukan.');
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            return ApiResponse::forbidden($e->getMessage() ?: 'Akses ditolak.');
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            return ApiResponse::error(
                'Validasi gagal.',
                'VALIDATION_ERROR',
                422,
                $e->errors()
            );
        });
    })->create();