<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $manager = Auth::user();

        return Inertia::render('Manager/Menu/page', [
            'manager' => $manager,
        ]);
    }
}