<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Setup Routes (For Shared Hosting - Remove after setup)
|--------------------------------------------------------------------------
*/

// Setup panel with UI
Route::get('/setup', function () {
    return view('setup');
});

// Run migrations
Route::get('/setup/migrate', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Migrations ran successfully!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Migration failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Run seeders
Route::get('/setup/seed', function () {
    try {
        Artisan::call('db:seed', ['--force' => true]);
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Database seeded successfully!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Seeding failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Fresh migration (drop all tables and re-run)
Route::get('/setup/migrate-fresh', function () {
    try {
        Artisan::call('migrate:fresh', ['--force' => true]);
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Fresh migration completed!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Fresh migration failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Fresh migration + seed
Route::get('/setup/migrate-fresh-seed', function () {
    try {
        Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Fresh migration with seeding completed!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Operation failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Clear cache
Route::get('/setup/clear-cache', function () {
    try {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');

        return response()->json([
            'success' => true,
            'message' => 'All caches cleared successfully!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Cache clearing failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Optimize application
Route::get('/setup/optimize', function () {
    try {
        Artisan::call('optimize');

        return response()->json([
            'success' => true,
            'message' => 'Application optimized successfully!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Optimization failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Check database connection
Route::get('/setup/db-check', function () {
    try {
        DB::connection()->getPdo();
        $dbName = DB::connection()->getDatabaseName();

        return response()->json([
            'success' => true,
            'message' => 'Database connection successful!',
            'database' => $dbName
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Storage link
Route::get('/setup/storage-link', function () {
    try {
        Artisan::call('storage:link');

        return response()->json([
            'success' => true,
            'message' => 'Storage link created successfully!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Storage link creation failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Generate app key
Route::get('/setup/generate-key', function () {
    try {
        Artisan::call('key:generate', ['--force' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Application key generated successfully!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Key generation failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// List all routes
Route::get('/setup/routes', function () {
    try {
        Artisan::call('route:list');
        $output = Artisan::output();

        return response()->json([
            'success' => true,
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// Complete setup (all-in-one)
Route::get('/setup/complete', function () {
    try {
        $results = [];

        // 1. Generate key
        Artisan::call('key:generate', ['--force' => true]);
        $results['key_generate'] = 'Success';

        // 2. Clear cache
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        $results['cache_clear'] = 'Success';

        // 3. Run migrations
        Artisan::call('migrate:fresh', ['--force' => true]);
        $results['migrate'] = 'Success';

        // 4. Seed database
        Artisan::call('db:seed', ['--force' => true]);
        $results['seed'] = 'Success';

        // 5. Storage link
        try {
            Artisan::call('storage:link');
            $results['storage_link'] = 'Success';
        } catch (\Exception $e) {
            $results['storage_link'] = 'Already exists or failed';
        }

        // 6. Optimize
        Artisan::call('optimize');
        $results['optimize'] = 'Success';

        return response()->json([
            'success' => true,
            'message' => 'Complete setup finished successfully!',
            'results' => $results
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Setup failed',
            'error' => $e->getMessage()
        ], 500);
    }
});
