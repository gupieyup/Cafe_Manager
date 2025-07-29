<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryManagerController extends Controller
{
    public function index()
    {
        $manager = Auth::user();

        return Inertia::render('Manager/History/page', [
            'manager' => $manager,
        ]);
    }
}
