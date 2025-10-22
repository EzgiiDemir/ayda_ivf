<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactMapController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TreatmentsController;
use App\Http\Controllers\Api\WelcomeController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\NavbarController;
use App\Http\Controllers\Api\FooterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (AUTH OLMADAN) - Frontend için
|--------------------------------------------------------------------------
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public content routes - Frontend için
Route::get('/hero', [HeroController::class, 'index']);
Route::get('/welcome', [WelcomeController::class, 'index']);
Route::get('/treatments', [TreatmentsController::class, 'index']);
Route::get('/contact-map', [ContactMapController::class, 'index']);

// FAQ Public
Route::get('/faq', [FAQController::class, 'index']);

// Contact Public
Route::get('/contact', [ContactController::class, 'index']);
Route::post('/contact/submit', [ContactController::class, 'submit']);

// Navbar & Footer Public
Route::get('/navbar', [NavbarController::class, 'index']);
Route::get('/footer', [FooterController::class, 'index']);

// Pages Public Routes - Frontend için (AUTH GEREKMİYOR)
Route::get('/pages/slug/{slug}', [PageController::class, 'getBySlug']);
Route::get('/pages/all', [PageController::class, 'getAllPages']);

/*
|--------------------------------------------------------------------------
| Protected Routes (AUTH GEREKLİ) - Admin Panel
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/recent-pages', [DashboardController::class, 'recentPages']);
        Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);
    });

    // Pages ADMIN Routes (Auth gerekli)
    Route::prefix('pages')->group(function () {
        Route::get('/', [PageController::class, 'index']);           // GET /api/pages
        Route::post('/', [PageController::class, 'store']);          // POST /api/pages
        Route::get('/{id}', [PageController::class, 'show']);        // GET /api/pages/{id}?locale=tr
        Route::put('/{id}', [PageController::class, 'update']);      // PUT /api/pages/{id}
        Route::delete('/{id}', [PageController::class, 'destroy']);  // DELETE /api/pages/{id}
        // Bulk delete (mevcut olan dosyaların birinde vardı) - güvenlik kontrolleri eklemeyi unutmayın
        Route::post('/bulk-delete', [PageController::class, 'bulkDelete']);
    });

    // Media routes
    Route::prefix('media')->group(function () {
        Route::get('/', [MediaController::class, 'index']);
        Route::post('/upload', [MediaController::class, 'upload']);
        Route::get('/{id}', [MediaController::class, 'show']);
        Route::delete('/{id}', [MediaController::class, 'destroy']);
        Route::post('/bulk-delete', [MediaController::class, 'bulkDelete']);
    });

    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::get('/general', [SettingController::class, 'getGeneral']);
        Route::get('/seo', [SettingController::class, 'getSeo']);
        Route::get('/social', [SettingController::class, 'getSocial']);
        Route::put('/general', [SettingController::class, 'updateGeneral']);
        Route::put('/seo', [SettingController::class, 'updateSeo']);
        Route::put('/social', [SettingController::class, 'updateSocial']);
    });

    // Home Page Components - Admin endpoints
    Route::put('/hero', [HeroController::class, 'update']);
    Route::put('/welcome', [WelcomeController::class, 'update']);
    Route::put('/treatments', [TreatmentsController::class, 'update']);
    Route::put('/contact-map', [ContactMapController::class, 'update']);

    // FAQ Admin
    Route::put('/faq', [FAQController::class, 'update']);

    // Contact Admin
    Route::put('/contact', [ContactController::class, 'update']);
    Route::get('/contact/submissions', [ContactController::class, 'submissions']);
    Route::patch('/contact/submissions/{id}/read', [ContactController::class, 'markAsRead']);
    Route::delete('/contact/submissions/{id}', [ContactController::class, 'deleteSubmission']);

    // Navbar Admin
    Route::put('/navbar', [NavbarController::class, 'update']);

    // Footer Admin
    Route::put('/footer', [FooterController::class, 'update']);
});
