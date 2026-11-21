<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpmbHalaman extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'spmb_halamans';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'judul_hero_spmb',
        'subjudul_hero_spmb',
        'gambar_hero_spmb',
        'file_brosur_pdf',
        'judul_biaya',
        'subjudul_biaya',
        'daftar_rincian_biaya',
        'judul_alur_pendaftaran',
        'subjudul_alur_pendaftaran',
        'daftar_alur_pendaftaran',
        'judul_banner_bawah_spmb',
        'subjudul_banner_bawah_spmb',
        'gambar_banner_bawah_spmb',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'daftar_rincian_biaya' => 'array',
        'daftar_alur_pendaftaran' => 'array',
        ];
    }
}
