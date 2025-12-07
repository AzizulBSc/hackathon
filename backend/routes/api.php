<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ChatbotController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'SmartSupport API is running',
        'timestamp' => now()->toDateTimeString(),
        'version' => 'Laravel ' . app()->version()
    ]);
});

// Authentication Routes (Public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public FAQ & Chatbot Routes
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/categories', [FaqController::class, 'categories']);
Route::get('/faqs/{id}', [FaqController::class, 'show']);

// Protected Routes (Require Authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Tickets
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/stats', [TicketController::class, 'stats']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::patch('/tickets/{id}', [TicketController::class, 'update']);
    Route::post('/tickets/{id}/reply', [TicketController::class, 'reply']);

    // Users (Admin only - get agents list)
    Route::get('/users/agents', [AuthController::class, 'getAgents']);

    // Chatbot
    Route::post('/chatbot/query', [ChatbotController::class, 'query']);
    Route::get('/chatbot/history', [ChatbotController::class, 'history']);
});
