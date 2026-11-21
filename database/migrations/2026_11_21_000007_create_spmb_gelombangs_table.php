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
        Schema::create('spmb_gelombangs', function (Blueprint $table) {
            $table->id();
            $table->string('nama_gelombang');
            $table->string('tahun_ajaran');
            $table->date('tanggal_buka');
            $table->date('tanggal_tutup');
            $table->boolean('status_gelombang_buka')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spmb_gelombangs');
    }
};
