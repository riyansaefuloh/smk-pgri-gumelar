<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlumniTracer extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'alumni_tracers';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nama_lengkap_alumni',
        'tahun_kelulusan',
        'program_keahlian',
        'nomor_whatsapp_alumni',
        'email_alumni',
        'status_alumni',
        'nama_tempat_kerja',
        'posisi_pekerjaan',
        'nama_kampus',
        'program_studi',
        'nama_usaha_bidang',
        'isi_testimoni_alumni',
        'foto_profil_alumni',
        'status_tampil_beranda',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'status_alumni' => 'array',
        'status_tampil_beranda' => 'boolean',
        ];
    }
}
