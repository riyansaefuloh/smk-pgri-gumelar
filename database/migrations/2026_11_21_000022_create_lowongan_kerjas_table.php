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
        Schema::create('lowongan_kerjas', function (Blueprint $table) {
            $table->id();
            $table->string('posisi_pekerjaan');
            $table->string('slug_lowongan')->unique();
            $table->string('nama_perusahaan_mitra');
            $table->string('lokasi_penempatan');
            $table->string('tipe_pekerjaan');
            $table->string('pendidikan_minimal');
            $table->date('batas_akhir_lamaran');
            $table->text('deskripsi_pekerjaan');
            $table->string('link_pendaftaran');
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lowongan_kerjas');
    }
};
