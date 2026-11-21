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
        Schema::create('kontak_sekolahs', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_telepon');
            $table->string('nomor_whatsapp');
            $table->string('alamat_email');
            $table->text('alamat_lengkap');
            $table->text('embed_google_maps');
            $table->string('link_instagram')->nullable();
            $table->string('link_tiktok')->nullable();
            $table->string('link_youtube')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kontak_sekolahs');
    }
};
