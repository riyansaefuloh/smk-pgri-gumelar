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
        Schema::create('spmb_pendaftars', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_registrasi')->unique();
            $table->foreignId('spmb_gelombang_id')->constrained('spmb_gelombangs')->cascadeOnDelete();
            $table->string('nama_lengkap_siswa');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('nisn_siswa', 10)->unique();
            $table->string('nik_siswa', 16)->unique();
            $table->string('tempat_lahir_siswa');
            $table->date('tanggal_lahir_siswa');
            $table->string('asal_sekolah_smp');
            $table->text('alamat_domisili_siswa');
            $table->string('nomor_whatsapp_siswa');
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu_kandung')->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('pekerjaan_orang_tua_wali');
            $table->string('nomor_whatsapp_wali');
            $table->string('pilihan_program_keahlian')->default('Teknik Sepeda Motor (TSM)');
            $table->string('file_kartu_keluarga');
            $table->string('file_akta_kelahiran')->nullable();
            $table->string('file_ijazah_atau_skl')->nullable();
            $table->enum('status_pendaftaran', ['menunggu_verifikasi', 'perlu_perbaikan', 'berkas_lengkap', 'diterima', 'ditolak'])->default('menunggu_verifikasi');
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spmb_pendaftars');
    }
};
