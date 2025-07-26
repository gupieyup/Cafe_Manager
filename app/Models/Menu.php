<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menu';
    protected $fillable = [
        'namaMenu',
        'deskripsi',
        'harga',
        'jumlahStok',
        'kategori',
    ];

    public function transaksiMenu(){
        return $this->hasMany(TransaksiMenu::class,'idMenu');
    }
}
