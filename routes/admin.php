<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Beranda;

/*
|--------------------------------------------------------------------------
| Admin CMS Routes (Prefix: /admin, Middleware: auth, verified)
|--------------------------------------------------------------------------
*/

// Rute Awal CMS: Kelola Beranda
Route::get('/beranda', function () {
    return Inertia::render('Admin/Beranda', [
        'title'   => 'Kelola Beranda Website',
        'beranda' => Beranda::first(),
    ]);
})->name('beranda');
