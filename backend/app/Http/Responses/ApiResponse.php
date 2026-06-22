<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success.',
        int $statusCode = 200,
        ?array $meta = null
    ): JsonResponse {
        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $statusCode);
    }

    public static function error(
        string $message,
        string $errorCode = 'SERVER_ERROR',
        int $statusCode = 500,
        ?array $errors = null
    ): JsonResponse {
        $payload = [
            'success'    => false,
            'message'    => $message,
            'error_code' => $errorCode,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $statusCode);
    }

    public static function created(mixed $data, string $message = 'Resource created.'): JsonResponse
    {
        return self::success($data, $message, 201);
    }

    public static function notFound(string $message = 'Resource not found.'): JsonResponse
    {
        return self::error($message, 'NOT_FOUND', 404);
    }

    public static function forbidden(string $message = 'Action not allowed.'): JsonResponse
    {
        return self::error($message, 'FORBIDDEN', 403);
    }

    public static function unauthorized(string $message = 'Unauthenticated.'): JsonResponse
    {
        return self::error($message, 'UNAUTHORIZED', 401);
    }

    public static function conflict(string $message): JsonResponse
    {
        return self::error($message, 'INVALID_STATE_TRANSITION', 409);
    }
}