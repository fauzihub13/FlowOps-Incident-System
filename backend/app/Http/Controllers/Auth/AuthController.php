<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->only('email', 'password');

            $user = User::where('email', $credentials['email'])
                ->where('is_active', true)
                ->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return ApiResponse::error('Email atau password salah.', 'UNAUTHORIZED', 401);
            }

            $token = $user->createToken('web')->plainTextToken;

            return ApiResponse::success([
                'token' => $token,
                'user'  => (new UserResource($user))->resolve(),
            ], 'Login successful.');
        } catch (\Throwable $e) {
            Log::error('AuthController::login failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal login.', 'SERVER_ERROR', 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return ApiResponse::success(null, 'Logged out successfully.');
        } catch (\Throwable $e) {
            Log::error('AuthController::logout failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal logout.', 'SERVER_ERROR', 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            return ApiResponse::success(
                (new UserResource($user))->resolve(),
                'Profile retrieved.'
            );
        } catch (\Throwable $e) {
            Log::error('AuthController::me failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil profil.', 'SERVER_ERROR', 500);
        }
    }
}