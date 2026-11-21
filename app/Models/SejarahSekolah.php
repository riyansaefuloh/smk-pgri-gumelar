<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SejarahSekolah extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'sejarah_sekolahs';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'judul_sejarah',
        'subjudul_sejarah',
        'deskripsi_sejarah',
        'foto_sekolah',
        'daftar_milestone',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'daftar_milestone' => 'array',
        ];
    }
}
