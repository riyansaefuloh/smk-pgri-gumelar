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
        Schema::create('berandas', function (Blueprint $table) {
            $table->id();
            $table->string('judul_hero');
            $table->text('subjudul_hero');
            $table->string('gambar_hero');
            $table->string('nama_kepala_sekolah');
            $table->string('foto_kepala_sekolah');
            $table->text('teks_sambutan');
            $table->string('judul_banner_bawah');
            $table->text('subjudul_banner_bawah');
            $table->string('gambar_banner_bawah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berandas');
    }
};
