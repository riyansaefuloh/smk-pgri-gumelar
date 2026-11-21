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
        Schema::create('tefa_karyas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_karya_id')->constrained('kategori_karyas')->cascadeOnDelete();
            $table->string('judul_karya');
            $table->string('slug_karya')->unique();
            $table->string('foto_karya');
            $table->text('deskripsi_karya');
            $table->boolean('status_publikasi')->default(true);
            $table->integer('urutan_tampil')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tefa_karyas');
    }
};
