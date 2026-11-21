<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KontakSekolah extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'kontak_sekolahs';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nomor_telepon',
        'nomor_whatsapp',
        'alamat_email',
        'alamat_lengkap',
        'embed_google_maps',
        'link_instagram',
        'link_tiktok',
        'link_youtube',
    ];
}
