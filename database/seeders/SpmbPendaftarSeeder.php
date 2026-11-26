<?php

namespace Database\Seeders;

use App\Models\SpmbGelombang;
use App\Models\SpmbPendaftar;
use Illuminate\Database\Seeder;

class SpmbPendaftarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gelombang1 = SpmbGelombang::firstOrCreate(
            ['nama_gelombang' => 'Gelombang 1'],
            [
                'tahun_ajaran'          => '2026/2027',
                'tanggal_buka'          => '2026-01-05',
                'tanggal_tutup'         => '2026-03-31',
                'status_gelombang_buka' => true,
            ]
        );

        $gelombang2 = SpmbGelombang::firstOrCreate(
            ['nama_gelombang' => 'Gelombang 2'],
            [
                'tahun_ajaran'          => '2026/2027',
                'tanggal_buka'          => '2026-04-01',
                'tanggal_tutup'         => '2026-06-30',
                'status_gelombang_buka' => false,
            ]
        );

        $data = [
            [
                'nomor_registrasi'         => 'SPMB-2026-0002',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Aditya Bagus Pratama',
                'jenis_kelamin'            => 'L',
                'nisn_siswa'               => '0081234568',
                'nik_siswa'                => '3302151203080011',
                'tempat_lahir_siswa'       => 'Banyumas',
                'tanggal_lahir_siswa'      => '2008-03-12',
                'asal_sekolah_smp'         => 'SMP Negeri 1 Gumelar',
                'alamat_domisili_siswa'    => 'RT 02 RW 03, Desa Gumelar, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'     => '082134567890',
                'nama_ayah'                => 'Bambang Sutrisno',
                'nama_ibu_kandung'         => 'Siti Rohani',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Wiraswasta / Montir',
                'nomor_whatsapp_wali'      => '081234567890',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => '/storage/documents/spmb/sample-akta.pdf',
                'file_ijazah_atau_skl'     => '/storage/documents/spmb/sample-skl.pdf',
                'status_pendaftaran'       => 'diterima',
                'catatan_verifikasi'       => 'Berkas lengkap dan terverifikasi sah. Lulus seleksi berkas gelombang 1.',
            ],
            [
                'nomor_registrasi'         => 'SPMB-2026-0003',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Dimas Wahyu Nugroho',
                'jenis_kelamin'            => 'L',
                'nisn_siswa'               => '0082345678',
                'nik_siswa'                => '3302151505080002',
                'tempat_lahir_siswa'       => 'Banyumas',
                'tanggal_lahir_siswa'      => '2008-05-15',
                'asal_sekolah_smp'         => 'SMP Negeri 2 Gumelar',
                'alamat_domisili_siswa'    => 'RT 04 RW 01, Desa Cihonje, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'     => '082245678901',
                'nama_ayah'                => 'Supriyadi',
                'nama_ibu_kandung'         => 'Sumarsih',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Petani',
                'nomor_whatsapp_wali'      => '081345678901',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => '/storage/documents/spmb/sample-akta.pdf',
                'file_ijazah_atau_skl'     => null,
                'status_pendaftaran'       => 'menunggu_verifikasi',
                'catatan_verifikasi'       => null,
            ],
            [
                'nomor_registrasi'         => 'SPMB-2026-0004',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Rizki Nur Fauzi',
                'jenis_kelamin'            => 'L',
                'nisn_siswa'               => '0083456789',
                'nik_siswa'                => '3302152007080003',
                'tempat_lahir_siswa'       => 'Brebes',
                'tanggal_lahir_siswa'      => '2008-07-20',
                'asal_sekolah_smp'         => 'MTs Ma\'arif NU 1 Gumelar',
                'alamat_domisili_siswa'    => 'RT 01 RW 05, Desa Samudra, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'     => '082356789012',
                'nama_ayah'                => 'Kuswanto',
                'nama_ibu_kandung'         => 'Nur Hayati',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Buruh Harian Lepas',
                'nomor_whatsapp_wali'      => '081456789012',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => null,
                'file_ijazah_atau_skl'     => null,
                'status_pendaftaran'       => 'perlu_perbaikan',
                'catatan_verifikasi'       => 'Foto Kartu Keluarga agak buram pada bagian NIK. Mohon kirimkan scan/foto ulang KK yang lebih jelas ke nomor WhatsApp panitia.',
            ],
            [
                'nomor_registrasi'         => 'SPMB-2026-0005',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Farhan Maulana Akbar',
                'jenis_kelamin'            => 'L',
                'nisn_siswa'               => '0084567890',
                'nik_siswa'                => '3302151009080004',
                'tempat_lahir_siswa'       => 'Banyumas',
                'tanggal_lahir_siswa'      => '2008-09-10',
                'asal_sekolah_smp'         => 'SMP PGRI Gumelar',
                'alamat_domisili_siswa'    => 'RT 03 RW 02, Desa Kedungurang, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'     => '082467890123',
                'nama_ayah'                => 'Ahmad Tohir',
                'nama_ibu_kandung'         => 'Tri Wahyuni',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Pedagang',
                'nomor_whatsapp_wali'      => '081567890123',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => '/storage/documents/spmb/sample-akta.pdf',
                'file_ijazah_atau_skl'     => '/storage/documents/spmb/sample-skl.pdf',
                'status_pendaftaran'       => 'berkas_lengkap',
                'catatan_verifikasi'       => 'Berkas administrasi telah diverifikasi lengkap. Menunggu jadwal tes fisik/wawancara minat bakat.',
            ],
            [
                'nomor_registrasi'         => 'SPMB-2026-0006',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Nabila Putri Cahyani',
                'jenis_kelamin'            => 'P',
                'nisn_siswa'               => '0085678901',
                'nik_siswa'                => '3302152511080005',
                'tempat_lahir_siswa'       => 'Banyumas',
                'tanggal_lahir_siswa'      => '2008-11-25',
                'asal_sekolah_smp'         => 'SMP Negeri 1 Gumelar',
                'alamat_domisili_siswa'    => 'RT 02 RW 04, Desa Gancang, Kec. Gumelar, Kab. Banyumas',
                'nomor_whatsapp_siswa'     => '082578901234',
                'nama_ayah'                => 'Teguh Santoso',
                'nama_ibu_kandung'         => 'Endang Lestari',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Karyawan Swasta',
                'nomor_whatsapp_wali'      => '081678901234',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => '/storage/documents/spmb/sample-akta.pdf',
                'file_ijazah_atau_skl'     => '/storage/documents/spmb/sample-skl.pdf',
                'status_pendaftaran'       => 'diterima',
                'catatan_verifikasi'       => 'Lolos verifikasi berkas dan telah menyelesaikan administrasi awal.',
            ],
            [
                'nomor_registrasi'         => 'SPMB-2026-0007',
                'spmb_gelombang_id'        => $gelombang1->id,
                'nama_lengkap_siswa'       => 'Budi Setiawan',
                'jenis_kelamin'            => 'L',
                'nisn_siswa'               => '0086789012',
                'nik_siswa'                => '3302150101080006',
                'tempat_lahir_siswa'       => 'Cilacap',
                'tanggal_lahir_siswa'      => '2008-01-01',
                'asal_sekolah_smp'         => 'SMP Negeri 3 Karangkobar',
                'alamat_domisili_siswa'    => 'Dusun Krajan RT 01 RW 01, Kab. Cilacap',
                'nomor_whatsapp_siswa'     => '082689012345',
                'nama_ayah'                => 'Hartono',
                'nama_ibu_kandung'         => 'Maryati',
                'nama_wali'                => null,
                'pekerjaan_orang_tua_wali' => 'Buruh',
                'nomor_whatsapp_wali'      => '081789012345',
                'pilihan_program_keahlian' => 'Teknik Sepeda Motor (TSM)',
                'file_kartu_keluarga'      => '/storage/documents/spmb/sample-kk.pdf',
                'file_akta_kelahiran'      => null,
                'file_ijazah_atau_skl'     => null,
                'status_pendaftaran'       => 'menunggu_verifikasi',
                'catatan_verifikasi'       => null,
            ],
        ];

        foreach ($data as $item) {
            SpmbPendaftar::updateOrCreate(
                ['nomor_registrasi' => $item['nomor_registrasi']],
                $item
            );
        }
    }
}
