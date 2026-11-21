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
        Schema::create('tentang_sekolahs', function (Blueprint $table) {
            $table->id();
            $table->string('judul_halaman');
            $table->text('sub_judul_halaman');
            $table->string('foto_gedung_sekolah');
            $table->text('teks_visi');
            $table->json('poin_misi');
            $table->string('jumlah_jurusan');
            $table->string('jumlah_siswa');
            $table->string('jumlah_guru_staf');
            $table->string('lama_tahun_beroperasi');
            $table->string('judul_legalitas');
            $table->text('keterangan_legalitas');
            $table->string('foto_legalitas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tentang_sekolahs');
    }
};
