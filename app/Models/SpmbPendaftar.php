<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpmbPendaftar extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     */
    protected $table = 'spmb_pendaftars';

    /**
     * Kolom yang boleh diisi secara massal (mass assignment).
     */
    protected $fillable = [
        'nomor_registrasi',
        'spmb_gelombang_id',
        'nama_lengkap_siswa',
        'jenis_kelamin',
        'nisn_siswa',
        'nik_siswa',
        'tempat_lahir_siswa',
        'tanggal_lahir_siswa',
        'asal_sekolah_smp',
        'alamat_domisili_siswa',
        'nomor_whatsapp_siswa',
        'nama_ayah',
        'nama_ibu_kandung',
        'nama_wali',
        'pekerjaan_orang_tua_wali',
        'nomor_whatsapp_wali',
        'pilihan_program_keahlian',
        'file_kartu_keluarga',
        'file_akta_kelahiran',
        'file_ijazah_atau_skl',
        'status_pendaftaran',
        'catatan_verifikasi',
    ];

    /**
     * Atribut yang harus di-cast ke tipe data native.
     */
    protected function casts(): array
    {
        return [
        'tanggal_lahir_siswa' => 'date',
        ];
    }

    /**
     * Relasi: SpmbPendaftar milik satu SpmbGelombang.
     */
    public function spmbGelombang(): BelongsTo
    {
        return $this->belongsTo(SpmbGelombang::class, 'spmb_gelombang_id');
    }
}
