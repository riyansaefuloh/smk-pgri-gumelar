<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TentangSekolah extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'tentang_sekolahs';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'judul_halaman',
        'sub_judul_halaman',
        'foto_gedung_sekolah',
        'teks_visi',
        'poin_misi',
        'jumlah_jurusan',
        'jumlah_siswa',
        'jumlah_guru_staf',
        'lama_tahun_beroperasi',
        'judul_legalitas',
        'keterangan_legalitas',
        'foto_legalitas',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'poin_misi' => 'array',
        ];
    }
}
