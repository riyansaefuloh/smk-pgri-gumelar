<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LowonganKerja extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'lowongan_kerjas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'posisi_pekerjaan',
        'slug_lowongan',
        'nama_perusahaan_mitra',
        'lokasi_penempatan',
        'tipe_pekerjaan',
        'pendidikan_minimal',
        'batas_akhir_lamaran',
        'deskripsi_pekerjaan',
        'link_pendaftaran',
        'status_aktif',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'batas_akhir_lamaran' => 'date',
        'status_aktif' => 'boolean',
        ];
    }
}
