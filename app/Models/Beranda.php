<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beranda extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'berandas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'judul_hero',
        'subjudul_hero',
        'gambar_hero',
        'nama_kepala_sekolah',
        'foto_kepala_sekolah',
        'teks_sambutan',
        'judul_banner_bawah',
        'subjudul_banner_bawah',
        'gambar_banner_bawah',
    ];
}
