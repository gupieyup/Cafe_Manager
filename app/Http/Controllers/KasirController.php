<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Kasir hanya melihat transaksi miliknya
        $transaksis = Transaksi::where('idKasir', $user->id)->latest()->get();

        return Inertia::render('Kasir/Home', [
            'user' => $user,
            'transaksis' => $transaksis,
        ]);
    }
}
