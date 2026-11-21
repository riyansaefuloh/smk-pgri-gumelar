<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TefaKarya extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'tefa_karyas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'kategori_karya_id',
        'judul_karya',
        'slug_karya',
        'foto_karya',
        'deskripsi_karya',
        'status_publikasi',
        'urutan_tampil',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'status_publikasi' => 'boolean',
        ];
    }

    /**
     * Relasi: TefaKarya milik satu KategoriKarya.
     */
    public function kategoriKarya(): BelongsTo
    {
        return $this->belongsTo(KategoriKarya::class, 'kategori_karya_id');
    }
}
