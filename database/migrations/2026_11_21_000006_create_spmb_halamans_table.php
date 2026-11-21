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
        Schema::create('spmb_halamans', function (Blueprint $table) {
            $table->id();
            $table->string('judul_hero_spmb');
            $table->text('subjudul_hero_spmb');
            $table->string('gambar_hero_spmb');
            $table->string('file_brosur_pdf')->nullable();
            $table->string('judul_biaya');
            $table->text('subjudul_biaya');
            $table->json('daftar_rincian_biaya');
            $table->string('judul_alur_pendaftaran');
            $table->text('subjudul_alur_pendaftaran');
            $table->json('daftar_alur_pendaftaran');
            $table->string('judul_banner_bawah_spmb');
            $table->text('subjudul_banner_bawah_spmb');
            $table->string('gambar_banner_bawah_spmb');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spmb_halamans');
    }
};
