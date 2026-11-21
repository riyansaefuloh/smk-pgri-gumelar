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
        Schema::create('mitra_dudis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_mitra_industri');
            $table->string('logo_mitra_industri');
            $table->integer('urutan_tampil')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mitra_dudis');
    }
};
