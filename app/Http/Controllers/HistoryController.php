<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $kasir = Auth::user();
        
        // Get filter parameters
        $search = $request->get('search', '');
        $dateFrom = $request->get('date_from', '');
        $dateTo = $request->get('date_to', '');
        $perPage = $request->get('per_page', 10);

        // Build query for transactions of this cashier only
        $query = Transaksi::with(['transaksiMenu.menu', 'user'])
            ->where('idKasir', $kasir->id);

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('transaksiMenu.menu', function($subQ) use ($search) {
                      $subQ->where('namaMenu', 'like', "%{$search}%");
                  });
            });
        }

        // Apply date filters
        if ($dateFrom) {
            $query->whereDate('waktu', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('waktu', '<=', $dateTo);
        }

        // Get paginated results
        $transactions = $query->orderBy('waktu', 'desc')
            ->paginate($perPage)
            ->through(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'waktu' => $transaction->waktu,
                    'qty' => $transaction->qty,
                    'hargaTotal' => $transaction->hargaTotal,
                    'kasir' => $transaction->user->email,
                    'items' => $transaction->transaksiMenu->map(function ($item) {
                        return [
                            'namaMenu' => $item->menu ? $item->menu->namaMenu : 'Menu tidak ditemukan',
                            'qty' => $item->qty,
                            'harga' => $item->harga,
                            'subtotal' => $item->qty * $item->harga
                        ];
                    })
                ];
            });

        return Inertia::render('Kasir/History/page', [
            'kasir' => $kasir,
            'transactions' => $transactions,
            'filters' => [
                'search' => $search,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'per_page' => $perPage
            ]
        ]);
    }
}