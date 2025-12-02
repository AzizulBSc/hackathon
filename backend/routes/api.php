<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API routes
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString(),
        'version' => 'Laravel ' . app()->version()
    ]);
});

// Example API routes
Route::prefix('v1')->group(function () {
    // Add your API routes here
    Route::get('/test', function () {
        return response()->json([
            'message' => 'Hello from Laravel API',
            'version' => '1.0',
            'laravel' => app()->version()
        ]);
    });
});

// Public API routes
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Example API routes
Route::prefix('v1')->group(function () {
    // Add your API routes here
    Route::get('/test', function () {
        return response()->json([
            'message' => 'Hello from Laravel API',
            'version' => '1.0'
        ]);
    });
});
