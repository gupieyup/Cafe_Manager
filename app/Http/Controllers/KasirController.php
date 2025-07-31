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
        
        // Get menu availability stats
        $totalMenus = Menu::count();
        $availableMenus = Menu::where('jumlahStok', '>', 0)->count();
        $lowStockMenus = Menu::where('jumlahStok', '>', 0)
            ->where('jumlahStok', '<=', 5)
            ->count();
        $outOfStockMenus = Menu::where('jumlahStok', 0)->count();

        // Data untuk chart transaksi harian (7 hari terakhir) - hanya untuk kasir ini
        $startDate = Carbon::now()->subDays(6)->startOfDay(); 
        $endDate = Carbon::now()->endOfDay();
        
        $dailyTransactions = Transaksi::selectRaw('DATE(waktu) as date, COUNT(*) as total_transaksi, SUM(hargaTotal) as total_pendapatan')
            ->where('idKasir', $kasir->id)
            ->whereBetween('waktu', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Buat array untuk 7 hari terakhir dengan data 0 jika tidak ada transaksi
        $dailyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $currentDate = Carbon::now()->subDays($i);
            $dateKey = $currentDate->format('Y-m-d');
            $displayDate = $currentDate->format('d/m');
            
            $found = $dailyTransactions->firstWhere('date', $dateKey);
            
            $dailyChart[] = [
                'date' => $displayDate,
                'total_transaksi' => $found ? (int)$found->total_transaksi : 0,
                'total_pendapatan' => $found ? (float)$found->total_pendapatan : 0
            ];
        }

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
            'chartData' => [
                'daily' => $dailyChart,
            ],
        ]);
    }
}