<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes (Publik Website SMK PGRI Gumelar)
|--------------------------------------------------------------------------
*/

// Rute Awal Publik: Beranda Resmi SMK PGRI Gumelar
Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Dashboard & Profil Pengguna (Breeze)
|--------------------------------------------------------------------------
*/
// Rute Dashboard Resmi: /admin/dashboard
Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Auto-redirect /dashboard & /admin ke /admin/dashboard
Route::get('/dashboard', fn() => redirect()->route('dashboard'))->middleware('auth');
Route::get('/admin', fn() => redirect()->route('dashboard'))->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Autentikasi Breeze (Login, Register, Logout, dll)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Panel Admin CMS (routes/admin.php)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    require __DIR__.'/admin.php';
});
