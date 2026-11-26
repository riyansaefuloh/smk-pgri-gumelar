<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sarpras extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'sarpras';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'kategori_sarpras_id',
        'nama_fasilitas',
        'kategori_fasilitas',
        'foto_fasilitas',
        'deskripsi_fasilitas',
        'status_publikasi',
        'urutan_tampil',
    ];

    protected function casts(): array
    {
        return [
            'status_publikasi' => 'boolean',
        ];
    }

    public function kategoriSarpras(): BelongsTo
    {
        return $this->belongsTo(KategoriSarpras::class, 'kategori_sarpras_id');
    }
}
