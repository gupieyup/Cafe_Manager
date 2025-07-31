<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Transaksi;
use App\Models\TransaksiMenu;

class TransactionController extends Controller
{
    public function index()
    {
        $kasir = Auth::user();
        
        // Get available menus with stock > 0
        $menus = Menu::where('jumlahStok', '>', 0)
            ->orderBy('kategori')
            ->orderBy('namaMenu')
            ->get();
        
        // Get categories for filtering
        $categories = Menu::select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->where('kategori', '!=', '')
            ->where('jumlahStok', '>', 0)
            ->orderBy('kategori')
            ->pluck('kategori');

        return Inertia::render('Kasir/Transaction/page', [
            'kasir' => $kasir,
            'menus' => $menus,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.idMenu' => 'required|exists:menu,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.harga' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        
        try {
            $totalAmount = 0;
            $totalQty = 0;
            
            // Calculate totals and validate stock
            foreach ($request->items as $item) {
                $menu = Menu::findOrFail($item['idMenu']);
                
                // Check if stock is sufficient
                if ($menu->jumlahStok < $item['qty']) {
                    return redirect()->back()->with('error', "Stok {$menu->namaMenu} tidak mencukupi! Stok tersedia: {$menu->jumlahStok}");
                }
                
                $totalAmount += $item['harga'] * $item['qty'];
                $totalQty += $item['qty'];
            }

            // Create transaction
            $transaksi = Transaksi::create([
                'waktu' => Carbon::now(),
                'qty' => $totalQty,
                'hargaItem' => $totalAmount / $totalQty,
                'hargaTotal' => $totalAmount,
                'idKasir' => Auth::id(),
            ]);

            // Create transaction items and update stock
            foreach ($request->items as $item) {
                $menu = Menu::findOrFail($item['idMenu']);
                
                // Create transaction menu entry
                TransaksiMenu::create([
                    'idTransaksi' => $transaksi->id,
                    'idMenu' => $item['idMenu'],
                    'qty' => $item['qty'],
                    'harga' => $item['harga'],
                ]);
                
                // Update stock
                $menu->decrement('jumlahStok', $item['qty']);
            }

            DB::commit();
            
            return redirect()->back()->with('success', 'Transaksi berhasil disimpan!');
            
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan transaksi: ' . $e->getMessage());
        }
    }

    public function getMenuByCategory($category)
    {
        $menus = Menu::where('kategori', $category)
            ->where('jumlahStok', '>', 0)
            ->orderBy('namaMenu')
            ->get();
            
        return response()->json($menus);
    }
}