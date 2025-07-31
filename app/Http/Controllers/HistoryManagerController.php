<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class HistoryManagerController extends Controller
{
    public function index(Request $request)
    {
        $manager = Auth::user();
        
        // Dapatkan parameter filter
        $search = $request->get('search', '');
        $dateFrom = $request->get('date_from', '');
        $dateTo = $request->get('date_to', '');
        $kasirId = $request->get('kasir_id', '');
        $perPage = $request->get('per_page', 10);

        // Buat query untuk semua transaksi
        $query = Transaksi::with(['transaksiMenu.menu', 'user']);

        // Terapkan filter pencarian
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('transaksiMenu.menu', function($subQ) use ($search) {
                      $subQ->where('namaMenu', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function($subQ) use ($search) {
                      $subQ->where('email', 'like', "%{$search}%");
                  });
            });
        }

        // Terapkan filter tanggal
        if ($dateFrom) {
            $query->whereDate('waktu', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('waktu', '<=', $dateTo);
        }

        // Terapkan filter kasir
        if ($kasirId) {
            $query->where('idKasir', $kasirId);
        }

        // Dapatkan hasil dengan paginasi
        $transactions = $query->orderBy('waktu', 'desc')
            ->paginate($perPage)
            ->through(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'waktu' => $transaction->waktu,
                    'qty' => $transaction->qty,
                    'hargaTotal' => $transaction->hargaTotal,
                    'kasir' => $transaction->user->email,
                    'kasir_id' => $transaction->user->id,
                    'items' => $transaction->transaksiMenu->map(function ($item) {
                        return [
                            'namaMenu' => $item->menu->namaMenu,
                            'qty' => $item->qty,
                            'harga' => $item->harga,
                            'subtotal' => $item->qty * $item->harga
                        ];
                    })
                ];
            });

        // Dapatkan semua kasir untuk dropdown filter
        $kasirList = User::where('role', 'kasir')
            ->select('id', 'email')
            ->orderBy('email')
            ->get();

        return Inertia::render('Manager/History/page', [
            'manager' => $manager,
            'transactions' => $transactions,
            'kasirList' => $kasirList,
            'filters' => [
                'search' => $search,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'kasir_id' => $kasirId,
                'per_page' => $perPage
            ]
        ]);
    }

    public function downloadReceipt($id)
    {
        // Manager dapat mengunduh struk transaksi apa pun
        $transaction = Transaksi::with(['transaksiMenu.menu', 'user'])
            ->where('id', $id)
            ->firstOrFail();

        $pdf = app('dompdf.wrapper');
        
        $html = view('receipts.transaction', [
            'transaction' => $transaction,
            'items' => $transaction->transaksiMenu->map(function ($item) {
                return [
                    'namaMenu' => $item->menu->namaMenu,
                    'qty' => $item->qty,
                    'harga' => $item->harga,
                    'subtotal' => $item->qty * $item->harga
                ];
            })
        ])->render();

        $pdf->loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("struk-{$transaction->id}.pdf");
    }

    public function downloadReport(Request $request)
    {
        // Validasi input laporan
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'kasir_id' => 'nullable|exists:users,id'
        ]);

        $period = $request->get('period');
        $dateFrom = Carbon::parse($request->get('date_from'));
        $dateTo = Carbon::parse($request->get('date_to'));
        $kasirId = $request->get('kasir_id');

        // Buat query untuk laporan
        $query = Transaksi::with(['user', 'transaksiMenu.menu'])
            ->whereBetween('waktu', [$dateFrom->startOfDay(), $dateTo->endOfDay()]);

        if ($kasirId) {
            $query->where('idKasir', $kasirId);
        }

        $transactions = $query->orderBy('waktu', 'desc')->get();

        // Hitung statistik
        $totalTransaksi = $transactions->count();
        $totalPendapatan = $transactions->sum('hargaTotal');
        $rataRataTransaksi = $totalTransaksi > 0 ? $totalPendapatan / $totalTransaksi : 0;

        // Kelompokkan data berdasarkan periode
        $groupedData = [];
        if ($period == 'daily') {
            $groupedData = $transactions->groupBy(function($transaction) {
                return Carbon::parse($transaction->waktu)->format('Y-m-d');
            });
        } elseif ($period == 'weekly') {
            $groupedData = $transactions->groupBy(function($transaction) {
                $date = Carbon::parse($transaction->waktu);
                return $date->format('Y') . '-W' . $date->weekOfYear;
            });
        } elseif ($period == 'monthly') {
            $groupedData = $transactions->groupBy(function($transaction) {
                return Carbon::parse($transaction->waktu)->format('Y-m');
            });
        } elseif ($period == 'yearly') {
            $groupedData = $transactions->groupBy(function($transaction) {
                return Carbon::parse($transaction->waktu)->format('Y');
            });
        }

        // Proses data yang dikelompokkan untuk laporan
        $reportData = [];
        foreach ($groupedData as $periodKey => $periodTransactions) {
            $reportData[] = [
                'periode' => $periodKey,
                'total_transaksi' => $periodTransactions->count(),
                'total_pendapatan' => $periodTransactions->sum('hargaTotal'),
                'rata_rata_transaksi' => $periodTransactions->avg('hargaTotal')
            ];
        }

        // Dapatkan info kasir jika difilter
        $kasirInfo = null;
        if ($kasirId) {
            $kasirInfo = User::find($kasirId);
        }

        // Terjemahkan periode ke bahasa Indonesia
        $periodIndonesia = [
            'daily' => 'Harian',
            'weekly' => 'Mingguan', 
            'monthly' => 'Bulanan',
            'yearly' => 'Tahunan'
        ];

        $pdf = app('dompdf.wrapper');
        
        $html = view('reports.revenue', [
            'periode' => $periodIndonesia[$period],
            'tanggalMulai' => $dateFrom,
            'tanggalSelesai' => $dateTo,
            'kasirInfo' => $kasirInfo,
            'totalTransaksi' => $totalTransaksi,
            'totalPendapatan' => $totalPendapatan,
            'rataRataTransaksi' => $rataRataTransaksi,
            'reportData' => $reportData,
            'transactions' => $transactions
        ])->render();

        $pdf->loadHTML($html);
        $pdf->setPaper('A4', 'portrait');

        $namaFile = "laporan-pendapatan-{$period}-" . $dateFrom->format('Y-m-d') . "-sampai-" . $dateTo->format('Y-m-d') . ".pdf";
        
        return $pdf->download($namaFile);
    }
}