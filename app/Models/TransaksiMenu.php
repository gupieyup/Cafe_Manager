<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiMenu extends Model
{
    use HasFactory;

    protected $table = 'transaksi_menu';
    protected $fillable = [
        'idTransaksi',
        'idMenu',
    ];

    public function transaksi(){
        return $this->belongsTo(Transaksi::class, 'idTransaksi');
    }

    public function menu(){
        return $this->belongsTo(Menu::class, 'idMenu');
    }
}
