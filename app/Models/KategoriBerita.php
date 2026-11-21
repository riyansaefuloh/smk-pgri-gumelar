<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriBerita extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'kategori_beritas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nama_kategori',
        'slug_kategori',
    ];

    /**
     * Relasi: satu KategoriBerita memiliki banyak Berita.
     */
    public function beritas(): HasMany
    {
        return $this->hasMany(Berita::class, 'kategori_berita_id');
    }
}
