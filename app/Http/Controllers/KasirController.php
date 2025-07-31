<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Transaksi;
use App\Models\TransaksiMenu;

class KasirController extends Controller
{
    public function index()
    {
        $kasir = Auth::user();
        
        // Get today's statistics for this cashier
        $todayTransactions = Transaksi::where('idKasir', $kasir->id)
            ->whereDate('waktu', Carbon::today())
            ->count();
            
        $todayRevenue = Transaksi::where('idKasir', $kasir->id)
            ->whereDate('waktu', Carbon::today())
            ->sum('hargaTotal');
            
        // Get this month's statistics for this cashier
        $monthTransactions = Transaksi::where('idKasir', $kasir->id)
            ->whereYear('waktu', Carbon::now()->year)
            ->whereMonth('waktu', Carbon::now()->month)
            ->count();
            
        $monthRevenue = Transaksi::where('idKasir', $kasir->id)
            ->whereYear('waktu', Carbon::now()->year)
            ->whereMonth('waktu', Carbon::now()->month)
            ->sum('hargaTotal');
        
        // Get recent transactions (last 5) for this cashier
        $recentTransactions = Transaksi::with(['transaksiMenu.menu'])
            ->where('idKasir', $kasir->id)
            ->orderBy('waktu', 'desc')
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'waktu' => $transaction->waktu,
                    'qty' => $transaction->qty,
                    'hargaTotal' => $transaction->hargaTotal,
                    'items' => $transaction->transaksiMenu->map(function ($item) {
                        return [
                            'namaMenu' => $item->menu->namaMenu,
                            'qty' => $item->qty,
                            'harga' => $item->harga
                        ];
                    })
                ];
            });
        
        // Get menu availability stats
        $totalMenus = Menu::count();
        $availableMenus = Menu::where('jumlahStok', '>', 0)->count();
        $lowStockMenus = Menu::where('jumlahStok', '>', 0)
            ->where('jumlahStok', '<=', 5)
            ->count();
        $outOfStockMenus = Menu::where('jumlahStok', 0)->count();

        return Inertia::render('Kasir/Home/page', [
            'kasir' => $kasir,
            'statistics' => [
                'todayTransactions' => $todayTransactions,
                'todayRevenue' => $todayRevenue,
                'monthTransactions' => $monthTransactions,
                'monthRevenue' => $monthRevenue,
            ],
            'menuStats' => [
                'totalMenus' => $totalMenus,
                'availableMenus' => $availableMenus,
                'lowStockMenus' => $lowStockMenus,
                'outOfStockMenus' => $outOfStockMenus,
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }
}