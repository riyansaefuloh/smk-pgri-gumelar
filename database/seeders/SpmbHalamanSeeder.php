<?php

namespace Database\Seeders;

use App\Models\SpmbHalaman;
use Illuminate\Database\Seeder;

class SpmbHalamanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SpmbHalaman::updateOrCreate(
            ['id' => 1],
            [
                'judul_hero_spmb'          => 'Wujudkan Masa Depanmu Bersama SMK PGRI Gumelar',
                'subjudul_hero_spmb'       => 'Saatnya mengembangkan potensi, mengasah keterampilan, dan mempersiapkan diri menghadapi dunia kerja. Bergabunglah bersama SMK PGRI Gumelar dan mulai perjalananmu menuju masa depan yang lebih baik.',
                'gambar_hero_spmb'         => '/images/spmb-hero.jpg',
                'file_brosur_pdf'          => '/documents/brosur-ppdb-smk-pgri-gumelar.pdf',
                'judul_biaya'              => 'Informasi Biaya Pendidikan',
                'subjudul_biaya'           => 'Biaya pendidikan transparan dan terjangkau dengan berbagai program keringanan serta beasiswa bagi siswa berprestasi.',
                'daftar_rincian_biaya'     => [
                    [
                        'komponen_biaya' => 'Biaya Pendaftaran Formulir',
                        'nominal_biaya'  => 'Gratis',
                        'keterangan'     => 'Program subsidi pendaftaran awal tahun ajaran',
                    ],
                    [
                        'komponen_biaya' => 'Seragam Sekolah & Wearpack Praktik',
                        'nominal_biaya'  => 'Rp 650.000',
                        'keterangan'     => 'Termasuk 3 stel seragam dan 1 stel wearpack bengkel',
                    ],
                    [
                        'komponen_biaya' => 'SPP Bulanan',
                        'nominal_biaya'  => 'Rp 100.000 / bulan',
                        'keterangan'     => 'Biaya operasional pendidikan dan praktikum bengkel',
                    ],
                ],
                'judul_alur_pendaftaran'   => 'Alur Pendaftaran Calon Siswa Baru',
                'subjudul_alur_pendaftaran'=> 'Ikuti tahapan berikut untuk menyelesaikan proses pendaftaran secara online. Pastikan kamu menyiapkan dokumen yang diperlukan agar proses pendaftaran berjalan lancar.',
                'daftar_alur_pendaftaran'  => [
                    [
                        'langkah'   => '1',
                        'judul'     => 'Pengisian Formulir Online',
                        'deskripsi' => 'Isi data diri calon siswa dan pilih program keahlian secara lengkap melalui website resmi.',
                    ],
                    [
                        'langkah'   => '2',
                        'judul'     => 'Unggah Dokumen Persyaratan',
                        'deskripsi' => 'Unggah dokumen pendukung seperti KK, Akta Kelahiran, dan Ijazah/SKL SMP/MTs yang terbaca jelas.',
                    ],
                    [
                        'langkah'   => '3',
                        'judul'     => 'Verifikasi Berkas & Cetak Bukti',
                        'deskripsi' => 'Panitia memverifikasi berkas pendaftaran. Calon siswa dapat langsung mengunduh dan mencetak Bukti Pendaftaran PDF.',
                    ],
                    [
                        'langkah'   => '4',
                        'judul'     => 'Daftar Ulang',
                        'deskripsi' => 'Lakukan konfirmasi dan daftar ulang ke kampus SMK PGRI Gumelar sesuai jadwal gelombang pendaftaran.',
                    ],
                ],
                'judul_banner_bawah_spmb'  => 'Masa Depan Cerah Dimulai dari Sini!',
                'subjudul_banner_bawah_spmb' => 'Segera daftarkan dirimu dan jadilah bagian dari generasi teknisi andal SMK PGRI Gumelar.',
                'gambar_banner_bawah_spmb' => '/images/spmb-banner-bawah.jpg',
            ]
        );
    }
}
