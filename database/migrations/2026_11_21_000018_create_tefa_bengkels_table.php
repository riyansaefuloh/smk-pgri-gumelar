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
        Schema::create('tefa_bengkels', function (Blueprint $table) {
            $table->id();
            $table->string('foto_bengkel');
            $table->string('nama_unit_bengkel');
            $table->text('deskripsi_bengkel');
            $table->json('daftar_layanan');
            $table->string('jadwal_operasional');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tefa_bengkels');
    }
};
