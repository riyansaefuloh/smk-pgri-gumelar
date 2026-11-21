<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Berita extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'beritas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'kategori_berita_id',
        'judul_berita',
        'slug_berita',
        'gambar_sampul_berita',
        'isi_konten_berita',
        'tanggal_publikasi',
        'status_publikasi',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'tanggal_publikasi' => 'date',
        'status_publikasi' => 'boolean',
        ];
    }

    /**
     * Relasi: Berita milik satu KategoriBerita.
     */
    public function kategoriBerita(): BelongsTo
    {
        return $this->belongsTo(KategoriBerita::class, 'kategori_berita_id');
    }
}
