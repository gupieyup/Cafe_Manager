<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi_menu', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idTransaksi');
            $table->unsignedBigInteger('idMenu');
            $table->timestamps();

            $table->foreign('idTransaksi')->references('id')->on('transaksi')->onDelete('cascade');
            $table->foreign('idMenu')->references('id')->on('menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksi_menu', function (Blueprint $table) {
            $table->dropForeign(['idTransaksi']);
            $table->dropForeign(['idMenu']);
        });
        Schema::dropIfExists('transaksi_menu');
    }
};
