<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpmbGelombang extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'spmb_gelombangs';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nama_gelombang',
        'tahun_ajaran',
        'tanggal_buka',
        'tanggal_tutup',
        'status_gelombang_buka',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'tanggal_buka' => 'date',
        'tanggal_tutup' => 'date',
        'status_gelombang_buka' => 'boolean',
        ];
    }

    /**
     * Relasi: satu SpmbGelombang memiliki banyak SpmbPendaftar.
     */
    public function spmbPendaftars(): HasMany
    {
        return $this->hasMany(SpmbPendaftar::class, 'spmb_gelombang_id');
    }
}
