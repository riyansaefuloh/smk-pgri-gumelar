<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriKarya extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'kategori_karyas';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nama_kategori',
        'slug_kategori',
    ];

    /**
     * Relasi: satu KategoriKarya memiliki banyak TefaKarya.
     */
    public function tefaKaryas(): HasMany
    {
        return $this->hasMany(TefaKarya::class, 'kategori_karya_id');
    }
}
