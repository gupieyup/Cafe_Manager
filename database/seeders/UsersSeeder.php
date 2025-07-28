<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'email'=> 'manager@gmail.com',
            'password'=> Hash::make('manager123'),
            'role'=> 'manajer'
        ]);

         User::create([
            'email'=> 'kasir@gmail.com',
            'password'=> Hash::make('kasir123'),
            'role'=> 'kasir'
        ]);

        User::create([
            'email'=> 'gladys@gmail.com',
            'password'=> Hash::make('gladys21'),
            'role'=> 'kasir'
        ]);
    }
}
