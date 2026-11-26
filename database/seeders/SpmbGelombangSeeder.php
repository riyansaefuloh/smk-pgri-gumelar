<?php

namespace Database\Seeders;

use App\Models\SpmbGelombang;
use App\Models\SpmbPendaftar;
use Illuminate\Database\Seeder;

class SpmbGelombangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Gelombang 1 yang aktif saat ini
        $gelombang1 = SpmbGelombang::updateOrCreate(
            ['nama_gelombang' => 'Gelombang 1'],
            [
                'tahun_ajaran'          => '2026/2027',
                'tanggal_buka'          => now()->subDays(5)->format('Y-m-d'),
                'tanggal_tutup'         => now()->addDays(30)->format('Y-m-d'),
                'status_gelombang_buka' => true,
            ]
        );

        // 2. Buat Gelombang 2 (Akan datang / Masih Tutup)
        SpmbGelombang::updateOrCreate(
            ['nama_gelombang' => 'Gelombang 2'],
            [
                'tahun_ajaran'          => '2026/2027',
                'tanggal_buka'          => now()->addDays(31)->format('Y-m-d'),
                'tanggal_tutup'         => now()->addDays(60)->format('Y-m-d'),
                'status_gelombang_buka' => false,
            ]
        );

        // 3. Buat 1 Data Pendaftar Contoh untuk Testing Cetak PDF & Auto-Number
        SpmbPendaftar::updateOrCreate(
            ['nomor_registrasi' => 'SPMB-2026-0001'],
            [
                'spmb_gelombang_id'         => $gelombang1->id,
                'nama_lengkap_siswa'        => 'Ahmad Rizky Pratama',
                'jenis_kelamin'             => 'L',
                'nisn_siswa'                => '0081234567',
                'nik_siswa'                 => '3302123456780001',
                'tempat_lahir_siswa'        => 'Banyumas',
                'tanggal_lahir_siswa'       => '2010-05-14',
                'asal_sekolah_smp'          => 'SMP Negeri 1 Gumelar',
                'alamat_domisili_siswa'     => 'RT 02 RW 03, Desa Cihonje, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'      => '081234567890',
                'nama_ayah'                 => 'Slamet Riyadi',
                'nama_ibu_kandung'          => 'Siti Aminah',
                'nama_wali'                 => null,
                'pekerjaan_orang_tua_wali'  => 'Wiraswasta / Bengkel',
                'nomor_whatsapp_wali'       => '081987654321',
                'pilihan_program_keahlian'  => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'       => 'dummy/kk-sample.pdf',
                'file_akta_kelahiran'       => 'dummy/akta-sample.pdf',
                'file_ijazah_atau_skl'      => 'dummy/ijazah-sample.pdf',
                'status_pendaftaran'        => 'menunggu_verifikasi',
                'catatan_verifikasi'        => null,
            ]
        );
    }
}
