<?php

namespace Database\Seeders;

use App\Models\Menu;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::create([
            'namaMenu'   => 'Nasi Goreng Spesial',
            'deskripsi'  => 'Nasi goreng dengan topping ayam, udang, dan telur',
            'harga'      => 25000,
            'jumlahStok' => 15,
            'kategori'   => 'Makanan',
        ]);

        Menu::create([
            'namaMenu'   => 'Mie Ayam Bakso',
            'deskripsi'  => 'Mie ayam dengan tambahan bakso sapi',
            'harga'      => 20000,
            'jumlahStok' => 20,
            'kategori'   => 'Makanan',
        ]);

        Menu::create([
            'namaMenu'   => 'Ayam Geprek Sambal Bawang',
            'deskripsi'  => 'Ayam goreng crispy dengan sambal bawang pedas',
            'harga'      => 22000,
            'jumlahStok' => 18,
            'kategori'   => 'Makanan',
        ]);

        Menu::create([
            'namaMenu'   => 'Es Teh Manis',
            'deskripsi'  => 'Es teh manis segar',
            'harga'      => 5000,
            'jumlahStok' => 30,
            'kategori'   => 'Minuman',
        ]);

        Menu::create([
            'namaMenu'   => 'Es Jeruk Peras',
            'deskripsi'  => 'Minuman segar jeruk peras asli',
            'harga'      => 7000,
            'jumlahStok' => 25,
            'kategori'   => 'Minuman',
        ]);

        Menu::create([
            'namaMenu'   => 'Kopi Hitam Tubruk',
            'deskripsi'  => 'Kopi hitam khas Indonesia',
            'harga'      => 8000,
            'jumlahStok' => 15,
            'kategori'   => 'Minuman',
        ]);

        Menu::create([
            'namaMenu'   => 'Teh Tarik',
            'deskripsi'  => 'Teh susu tarik khas Malaysia',
            'harga'      => 12000,
            'jumlahStok' => 10,
            'kategori'   => 'Minuman',
        ]);

        Menu::create([
            'namaMenu'   => 'Pisang Goreng Keju',
            'deskripsi'  => 'Pisang goreng dengan taburan keju parut',
            'harga'      => 10000,
            'jumlahStok' => 12,
            'kategori'   => 'Snack',
        ]);

        Menu::create([
            'namaMenu'   => 'Tahu Crispy',
            'deskripsi'  => 'Tahu goreng crispy dengan bumbu khas',
            'harga'      => 8000,
            'jumlahStok' => 14,
            'kategori'   => 'Snack',
        ]);

        Menu::create([
            'namaMenu'   => 'Tempe Mendoan',
            'deskripsi'  => 'Tempe mendoan dengan sambal kecap pedas',
            'harga'      => 9000,
            'jumlahStok' => 16,
            'kategori'   => 'Snack',
        ]);
    }
}
