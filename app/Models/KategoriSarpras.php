<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriSarpras extends Model
{
    use HasFactory;

    protected $table = 'kategori_sarpras';

    protected $fillable = [
        'nama_kategori',
        'slug_kategori',
    ];

    public function sarpras(): HasMany
    {
        return $this->hasMany(Sarpras::class, 'kategori_sarpras_id');
    }
}
