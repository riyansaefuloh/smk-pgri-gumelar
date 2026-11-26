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
        Schema::table('tentang_sekolahs', function (Blueprint $table) {
            $table->string('nama_sekolah')->nullable()->after('keterangan_legalitas');
            $table->string('npsn', 30)->nullable()->after('nama_sekolah');
            $table->string('sk_izin_operasional')->nullable()->after('npsn');
            $table->string('jenjang_status', 100)->nullable()->after('sk_izin_operasional');
            $table->string('yayasan_penyelenggara')->nullable()->after('jenjang_status');
            $table->string('akreditasi', 50)->nullable()->after('yayasan_penyelenggara');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tentang_sekolahs', function (Blueprint $table) {
            $table->dropColumn([
                'nama_sekolah',
                'npsn',
                'sk_izin_operasional',
                'jenjang_status',
                'yayasan_penyelenggara',
                'akreditasi',
            ]);
        });
    }
};
