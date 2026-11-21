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
        Schema::create('alumni_tracers', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap_alumni');
            $table->string('tahun_kelulusan');
            $table->string('program_keahlian')->default('Teknik Sepeda Motor (TSM)');
            $table->string('nomor_whatsapp_alumni');
            $table->string('email_alumni')->nullable();
            $table->json('status_alumni');
            $table->string('nama_tempat_kerja')->nullable();
            $table->string('posisi_pekerjaan')->nullable();
            $table->string('nama_kampus')->nullable();
            $table->string('program_studi')->nullable();
            $table->string('nama_usaha_bidang')->nullable();
            $table->text('isi_testimoni_alumni')->nullable();
            $table->string('foto_profil_alumni')->nullable();
            $table->boolean('status_tampil_beranda')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_tracers');
    }
};
