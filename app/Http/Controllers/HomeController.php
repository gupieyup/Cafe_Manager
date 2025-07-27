<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        // Retrieve the currently authenticated user
        $user = Auth::user();

        // Check if user is authenticated
        if (!$user) {
            return redirect()->route('login');
        } elseif ($user->role === 'manajer'){
            return redirect()->route('manajer.dashboard');
        } elseif ($user->role === 'kasir'){
            return redirect()->route('kasir.home');
        }
    }
}
