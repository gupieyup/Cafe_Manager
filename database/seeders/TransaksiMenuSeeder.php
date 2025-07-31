<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransaksiMenu;

class TransaksiMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Transaksi #1: Nasi Goreng Spesial (25000) x1 + Es Teh Manis (5000) x1 = 50000
        TransaksiMenu::create([
            'idTransaksi' => 1,
            'idMenu'      => 1, // Nasi Goreng Spesial
            'qty'         => 1,
            'harga'       => 25000,
        ]);
        
        TransaksiMenu::create([
            'idTransaksi' => 1,
            'idMenu'      => 4, // Es Teh Manis  
            'qty'         => 1,
            'harga'       => 5000,
        ]);

        // Transaksi #2: Mie Ayam Bakso (20000) x1 = 20000
        TransaksiMenu::create([
            'idTransaksi' => 2,
            'idMenu'      => 2, // Mie Ayam Bakso
            'qty'         => 1,
            'harga'       => 20000,
        ]);

        // Transaksi #3: Es Jeruk Peras (7000) x3 = 21000
        TransaksiMenu::create([
            'idTransaksi' => 3,
            'idMenu'      => 5, // Es Jeruk Peras
            'qty'         => 3,
            'harga'       => 7000,
        ]);

        // Transaksi #4: Teh Tarik (12000) x1 = 12000
        TransaksiMenu::create([
            'idTransaksi' => 4,
            'idMenu'      => 7, // Teh Tarik
            'qty'         => 1,
            'harga'       => 12000,
        ]);

        // Transaksi #5: Es Teh Manis (5000) x4 = 20000
        TransaksiMenu::create([
            'idTransaksi' => 5,
            'idMenu'      => 4, // Es Teh Manis
            'qty'         => 4,
            'harga'       => 5000,
        ]);

        // Transaksi #6: Ayam Geprek (22000) x2 = 44000
        TransaksiMenu::create([
            'idTransaksi' => 6,
            'idMenu'      => 3, // Ayam Geprek
            'qty'         => 2,
            'harga'       => 22000,
        ]);

        // Transaksi #7: Pisang Goreng Keju (10000) x1 = 10000
        TransaksiMenu::create([
            'idTransaksi' => 7,
            'idMenu'      => 8, // Pisang Goreng Keju
            'qty'         => 1,
            'harga'       => 10000,
        ]);

        // Transaksi #8: Tahu Crispy (8000) x2 = 16000
        TransaksiMenu::create([
            'idTransaksi' => 8,
            'idMenu'      => 9, // Tahu Crispy
            'qty'         => 2,
            'harga'       => 8000,
        ]);

        // Transaksi #9: Tempe Mendoan (9000) x1 = 9000
        TransaksiMenu::create([
            'idTransaksi' => 9,
            'idMenu'      => 10, // Tempe Mendoan
            'qty'         => 1,
            'harga'       => 9000,
        ]);

        // Transaksi #10: Kopi Hitam (8000) x3 = 24000
        TransaksiMenu::create([
            'idTransaksi' => 10,
            'idMenu'      => 6, // Kopi Hitam
            'qty'         => 3,
            'harga'       => 8000,
        ]);
    }
}