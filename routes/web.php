<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\RoomApiController;
use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\BookingApiController;
use App\Http\Controllers\Api\GalleryApiController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\ICalController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::middleware(\App\Http\Middleware\SetLocale::class)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/about', [AboutController::class, 'index'])->name('about');
    Route::get('/rooms', [RoomController::class, 'index'])->name('rooms');
    Route::get('/events', [EventController::class, 'index'])->name('events');
    Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
    Route::get('/contact', [ContactController::class, 'index'])->name('contact');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.submit');

    // Language switch
    Route::get('/lang/{locale}', function ($locale) {
        if (in_array($locale, ['en', 'fr'])) {
            session(['locale' => $locale]);
        }
        return redirect()->back();
    })->name('lang.switch');
});

/*
|--------------------------------------------------------------------------
| SEO Routes - Sitemap
|--------------------------------------------------------------------------
*/
Route::get('/sitemap.xml', function () {
    $urls = [
        ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['loc' => url('/rooms'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => url('/events'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => url('/gallery'), 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => url('/contact'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => url('/about'), 'priority' => '0.5', 'changefreq' => 'monthly'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    foreach ($urls as $url) {
        $xml .= '<url>';
        $xml .= '<loc>' . $url['loc'] . '</loc>';
        $xml .= '<lastmod>' . now()->toDateString() . '</lastmod>';
        $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
        $xml .= '<priority>' . $url['priority'] . '</priority>';
        $xml .= '</url>';
    }
    $xml .= '</urlset>';
    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');

    Route::middleware(\App\Http\Middleware\AdminAuth::class)->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard.alias');
    });
});

/*
|--------------------------------------------------------------------------
| API Routes (used by admin JS)
|--------------------------------------------------------------------------
*/
Route::prefix('api')->middleware(\App\Http\Middleware\AdminAuth::class)->group(function () {
    // Rooms
    Route::get('/rooms', [RoomApiController::class, 'index']);
    Route::post('/rooms', [RoomApiController::class, 'store']);
    Route::get('/rooms/{id}', [RoomApiController::class, 'show']);
    Route::put('/rooms/{id}', [RoomApiController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomApiController::class, 'destroy']);

    // Events
    Route::get('/events', [EventApiController::class, 'index']);
    Route::post('/events', [EventApiController::class, 'store']);
    Route::get('/events/{id}', [EventApiController::class, 'show']);
    Route::put('/events/{id}', [EventApiController::class, 'update']);
    Route::delete('/events/{id}', [EventApiController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingApiController::class, 'index']);
    Route::get('/bookings/availability', [BookingApiController::class, 'availability']);
    Route::get('/bookings/{id}', [BookingApiController::class, 'show']);
    Route::put('/bookings/{id}', [BookingApiController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingApiController::class, 'destroy']);

    // Gallery
    Route::get('/gallery', [GalleryApiController::class, 'index']);
    Route::post('/gallery', [GalleryApiController::class, 'store']);
    Route::put('/gallery/{id}', [GalleryApiController::class, 'update']);
    Route::delete('/gallery/{id}', [GalleryApiController::class, 'destroy']);

    // Upload
    Route::post('/upload', [UploadController::class, 'store']);
});

// Public booking API (no auth required)
Route::post('/api/bookings', [BookingApiController::class, 'store']);

/*
|--------------------------------------------------------------------------
| iCal Routes
|--------------------------------------------------------------------------
*/
// Public iCal export (accessed by Booking.com, Airbnb, etc.)
Route::get('/ical/{token}', [ICalController::class, 'export'])->name('ical.export');

// Admin iCal management (behind auth)
Route::prefix('api')->middleware(\App\Http\Middleware\AdminAuth::class)->group(function () {
    Route::post('/rooms/{id}/sync-ical', [ICalController::class, 'syncRoom']);
    Route::put('/rooms/{id}/ical-urls', [ICalController::class, 'updateIcalUrls']);
    Route::post('/rooms/{id}/regenerate-ical-token', [ICalController::class, 'regenerateToken']);
    Route::post('/sync-ical-all', [ICalController::class, 'syncAll']);
});
