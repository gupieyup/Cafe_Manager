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
        $kasir = Auth::user();

        return Inertia::render('Kasir/Home/page', [
            'kasir' => $kasir,
        ]);
    }
}
