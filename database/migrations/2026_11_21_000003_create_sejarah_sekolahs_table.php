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
        Schema::create('sejarah_sekolahs', function (Blueprint $table) {
            $table->id();
            $table->string('judul_sejarah');
            $table->string('subjudul_sejarah');
            $table->text('deskripsi_sejarah');
            $table->string('foto_sekolah');
            $table->json('daftar_milestone');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sejarah_sekolahs');
    }
};
