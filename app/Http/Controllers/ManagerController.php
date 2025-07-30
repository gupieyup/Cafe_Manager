<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Transaksi;
use App\Models\TransaksiMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManagerController extends Controller
{
    public function index()
    {
        $manager = Auth::user();
        
        // Data untuk chart transaksi harian (7 hari terakhir)
        $startDate = Carbon::now()->subDays(6)->startOfDay(); // 7 hari termasuk hari ini
        $endDate = Carbon::now()->endOfDay();
        
        $dailyTransactions = Transaksi::selectRaw('DATE(waktu) as date, COUNT(*) as total_transaksi, SUM(hargaTotal) as total_pendapatan')
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

        // Data untuk chart transaksi bulanan (6 bulan terakhir)
        $monthlyTransactions = Transaksi::selectRaw('YEAR(waktu) as year, MONTH(waktu) as month, COUNT(*) as total_transaksi, SUM(hargaTotal) as total_pendapatan')
            ->where('waktu', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'total_transaksi' => $item->total_transaksi,
                    'total_pendapatan' => $item->total_pendapatan
                ];
            });

        // Data untuk chart menu terlaris (top 5)
        $topMenus = TransaksiMenu::select('menu.namaMenu')
            ->selectRaw('COUNT(transaksi_menu.idMenu) as total_terjual')
            ->join('menu', 'transaksi_menu.idMenu', '=', 'menu.id')
            ->join('transaksi', 'transaksi_menu.idTransaksi', '=', 'transaksi.id')
            ->where('transaksi.waktu', '>=', Carbon::now()->subDays(30))
            ->groupBy('transaksi_menu.idMenu', 'menu.namaMenu')
            ->orderBy('total_terjual', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->namaMenu,
                    'value' => $item->total_terjual
                ];
            });

        // Data statistik umum
        $totalTransaksiHariIni = Transaksi::whereDate('waktu', Carbon::today())->count();
        $totalPendapatanHariIni = Transaksi::whereDate('waktu', Carbon::today())->sum('hargaTotal');
        $totalTransaksiBulanIni = Transaksi::whereYear('waktu', Carbon::now()->year)
            ->whereMonth('waktu', Carbon::now()->month)
            ->count();
        $totalPendapatanBulanIni = Transaksi::whereYear('waktu', Carbon::now()->year)
            ->whereMonth('waktu', Carbon::now()->month)
            ->sum('hargaTotal');

        return Inertia::render('Manager/Home/page', [
            'manager' => $manager,
            'chartData' => [
                'daily' => $dailyChart,
                'monthly' => $monthlyTransactions,
                'topMenus' => $topMenus,
            ],
            'statistics' => [
                'totalTransaksiHariIni' => $totalTransaksiHariIni,
                'totalPendapatanHariIni' => $totalPendapatanHariIni,
                'totalTransaksiBulanIni' => $totalTransaksiBulanIni,
                'totalPendapatanBulanIni' => $totalPendapatanBulanIni,
            ]
        ]);
    }
}
