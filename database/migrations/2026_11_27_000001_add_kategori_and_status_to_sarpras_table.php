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
        Schema::create('kategori_sarpras', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori')->unique();
            $table->string('slug_kategori')->unique();
            $table->timestamps();
        });

        Schema::table('sarpras', function (Blueprint $table) {
            $table->foreignId('kategori_sarpras_id')
                ->nullable()
                ->after('id')
                ->constrained('kategori_sarpras')
                ->nullOnDelete();
            $table->string('kategori_fasilitas')->nullable()->change();
            $table->boolean('status_publikasi')->default(true)->after('deskripsi_fasilitas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sarpras', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kategori_sarpras_id');
            $table->dropColumn('status_publikasi');
        });

        Schema::dropIfExists('kategori_sarpras');
    }
};
