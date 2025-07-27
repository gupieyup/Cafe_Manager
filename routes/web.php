<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ManagerController;
use Illuminate\Support\Facades\Route;

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

// Guest routes (not authenticated)
Route::middleware('guest')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home')->middleware('auth');
    Route::get('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/actionLogin', [LoginController::class, 'actionLogin'])->name('actionLogin');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'actionLogout'])->name('logout');

       // Manager routes
        Route::middleware('role:manajer')->prefix('manager')->name('manager.')->group(function () {
            Route::get('/home', [ManagerController::class, 'index'])->name('home');

    });

        // Kasir routes
        Route::middleware('role:kasir')->prefix('kasir')->name('kasir.')->group(function () {
            Route::get('/home', [KasirController::class, 'index'])->name('home');
    
    });
});