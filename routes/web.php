<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\HistoryManagerController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\HistoryController;

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
    Route::get('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/actionLogin', [LoginController::class, 'actionLogin'])->name('actionLogin');
});

// Redirect root to appropriate dashboard based on role
Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->role === 'manajer') {
            return redirect()->route('manager.home');
        } elseif ($user->role === 'kasir') {
            return redirect()->route('kasir.home');
        }
    }
    return redirect()->route('login');
})->name('home');

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'actionLogout'])->name('logout');

    // Manager routes
    Route::middleware('role:manajer')->prefix('manager')->name('manager.')->group(function () {
        Route::get('/home', [ManagerController::class, 'index'])->name('home');
        
        // Menu management
        Route::get('/menu', [MenuController::class, 'index'])->name('menu');
        Route::post('/menu', [MenuController::class, 'store'])->name('menu.store');
        Route::put('/menu/{id}', [MenuController::class, 'update'])->name('menu.update');
        Route::delete('/menu/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');
        Route::put('/menu/{id}/stock', [MenuController::class, 'updateStock'])->name('menu.stock');
        Route::get('/menu/categories', [MenuController::class, 'getCategories'])->name('menu.categories');
        Route::post('/menu/categories', [MenuController::class, 'addCategory'])->name('menu.addCategory');
        
        // History and reports
        Route::get('/history', [HistoryManagerController::class, 'index'])->name('history');
        Route::get('/history/receipt/{id}', [HistoryManagerController::class, 'downloadReceipt'])->name('history.receipt');
        Route::get('/history/report', [HistoryManagerController::class, 'downloadReport'])->name('history.report');
    });

    // Kasir routes
    Route::middleware('role:kasir')->prefix('kasir')->name('kasir.')->group(function () {
        Route::get('/home', [KasirController::class, 'index'])->name('home');
        
        // Transaction routes
        Route::get('/transaction', [TransactionController::class, 'index'])->name('transaction');
        Route::post('/transaction', [TransactionController::class, 'store'])->name('transaction.store');
        Route::get('/menu/category/{category}', [TransactionController::class, 'getMenuByCategory'])->name('menu.category');
        
        // History routes
        Route::get('/history', [HistoryController::class, 'index'])->name('history');
        Route::get('/history/receipt/{id}', [HistoryController::class, 'downloadReceipt'])->name('history.receipt');
    });
});