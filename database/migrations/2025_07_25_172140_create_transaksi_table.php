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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->dateTime('waktu');
            $table->integer('qty');
            $table->integer('hargaItem');
            $table->integer('hargaTotal');
            $table->unsignedBigInteger('idKasir');
            $table->timestamps();

            $table->foreign('idKasir')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table) {
            $table->dropForeign(['idKasir']);
        });
        Schema::dropIfExists('transaksi');
    }
};
