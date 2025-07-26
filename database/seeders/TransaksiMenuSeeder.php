<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Transaksi;
use App\Models\TransaksiMenu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class TransaksiMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Misalnya transaksi ke-1 beli menu ke-1 dan ke-4
        TransaksiMenu::create([
            'idTransaksi' => 1,
            'idMenu'      => 1,
        ]);

        TransaksiMenu::create([
            'idTransaksi' => 1,
            'idMenu'      => 4,
        ]);

        // Transaksi ke-2 beli menu ke-2
        TransaksiMenu::create([
            'idTransaksi' => 2,
            'idMenu'      => 2,
        ]);

        // Transaksi ke-3 beli menu ke-5 dan ke-6
        TransaksiMenu::create([
            'idTransaksi' => 3,
            'idMenu'      => 5,
        ]);

        TransaksiMenu::create([
            'idTransaksi' => 3,
            'idMenu'      => 6,
        ]);

        // Transaksi ke-4 beli menu ke-3
        TransaksiMenu::create([
            'idTransaksi' => 4,
            'idMenu'      => 3,
        ]);

        // Transaksi ke-5 beli menu ke-7
        TransaksiMenu::create([
            'idTransaksi' => 5,
            'idMenu'      => 7,
        ]);

        // Transaksi ke-6 beli menu ke-8
        TransaksiMenu::create([
            'idTransaksi' => 6,
            'idMenu'      => 8,
        ]);

        // Transaksi ke-7 beli menu ke-9
        TransaksiMenu::create([
            'idTransaksi' => 7,
            'idMenu'      => 9,
        ]);

        // Transaksi ke-8 beli menu ke-10
        TransaksiMenu::create([
            'idTransaksi' => 8,
            'idMenu'      => 10,
        ]);
    }
}
