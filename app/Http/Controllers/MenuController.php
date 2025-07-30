<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $manager = Auth::user();
        $menus = Menu::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Manager/Menu/page', [
            'manager' => $manager,
            'menus' => $menus,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'namaMenu' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'jumlahStok' => 'required|integer|min:0',
            'kategori' => 'required|string|max:255',
        ]);

        Menu::create([
            'namaMenu' => $request->namaMenu,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'jumlahStok' => $request->jumlahStok,
            'kategori' => $request->kategori,
        ]);

        return redirect()->back()->with('success', 'Menu berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'namaMenu' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'jumlahStok' => 'required|integer|min:0',
            'kategori' => 'required|string|max:255',
        ]);

        $menu = Menu::findOrFail($id);
        $menu->update([
            'namaMenu' => $request->namaMenu,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'jumlahStok' => $request->jumlahStok,
            'kategori' => $request->kategori,
        ]);

        return redirect()->back()->with('success', 'Menu berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        
        // Check if menu is used in transactions
        if ($menu->transaksiMenu()->exists()) {
            return redirect()->back()->with('error', 'Menu tidak dapat dihapus karena sudah digunakan dalam transaksi!');
        }

        $menu->delete();
        return redirect()->back()->with('success', 'Menu berhasil dihapus!');
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'jumlahStok' => 'required|integer|min:0',
        ]);

        $menu = Menu::findOrFail($id);
        $menu->update(['jumlahStok' => $request->jumlahStok]);

        return redirect()->back()->with('success', 'Stok menu berhasil diperbarui!');
    }

    public function getCategories()
    {
        $categories = Menu::select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->where('kategori', '!=', '')
            ->orderBy('kategori')
            ->pluck('kategori');

        return response()->json($categories);
    }

    public function addCategory(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string|max:255|unique:menu,kategori',
        ]);

        // Create a dummy menu entry to establish the category
        // Or you could create a separate categories table
        return response()->json([
            'success' => true,
            'kategori' => $request->kategori
        ]);
    }
}