<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManagerController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Manager/Home/page', [
            'user' => $user,
        ]);
    }
}
