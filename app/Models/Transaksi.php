<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksi';
    protected $fillable = [
        'waktu',
        'qty',
        'hargaItem',
        'hargaTotal',
        'idKasir',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'idKasir');
    }

    public function transaksiMenu(){
        return $this->hasMany(TransaksiMenu::class,'idTransaksi');
    }
}
