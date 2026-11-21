<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriKegiatan extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'kategori_kegiatans';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nama_kategori',
    ];

    /**
     * Relasi: satu KategoriKegiatan memiliki banyak KalenderAkademik.
     */
    public function kalenderAkademiks(): HasMany
    {
        return $this->hasMany(KalenderAkademik::class, 'kategori_kegiatan_id');
    }
}
