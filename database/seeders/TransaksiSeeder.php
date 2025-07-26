<?php

namespace Database\Seeders;

use App\Models\Transaksi;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil user kasir
        $kasir = User::where('role', 'kasir')->first();

        if ($kasir) {
            Transaksi::create([
                'waktu'      => '10:15:00',
                'qty'        => 2,
                'hargaItem'  => 25000,
                'hargaTotal' => 50000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '11:30:00',
                'qty'        => 1,
                'hargaItem'  => 20000,
                'hargaTotal' => 20000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '12:05:00',
                'qty'        => 3,
                'hargaItem'  => 7000,
                'hargaTotal' => 21000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '13:20:00',
                'qty'        => 1,
                'hargaItem'  => 12000,
                'hargaTotal' => 12000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '14:10:00',
                'qty'        => 4,
                'hargaItem'  => 5000,
                'hargaTotal' => 20000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '15:45:00',
                'qty'        => 2,
                'hargaItem'  => 22000,
                'hargaTotal' => 44000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '16:30:00',
                'qty'        => 1,
                'hargaItem'  => 10000,
                'hargaTotal' => 10000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '17:00:00',
                'qty'        => 2,
                'hargaItem'  => 8000,
                'hargaTotal' => 16000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '18:15:00',
                'qty'        => 1,
                'hargaItem'  => 9000,
                'hargaTotal' => 9000,
                'idKasir'    => $kasir->id,
            ]);

            Transaksi::create([
                'waktu'      => '19:40:00',
                'qty'        => 3,
                'hargaItem'  => 8000,
                'hargaTotal' => 24000,
                'idKasir'    => $kasir->id,
            ]);
        }
    }
}
