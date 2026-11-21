<?php

namespace Database\Seeders;

use App\Models\ProgramKeahlian;
use Illuminate\Database\Seeder;

class ProgramKeahlianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProgramKeahlian::updateOrCreate(
            ['id' => 1],
            [
                'nama_program_keahlian' => 'Teknik dan Bisnis Sepeda Motor (TBSM)',
                'deskripsi_jurusan'     => 'Program keahlian Teknik dan Bisnis Sepeda Motor (TBSM) membekali peserta didik dengan keterampilan teknis otomotif roda dua yang komprehensif, mulai dari perawatan berkala, perbaikan mesin, sistem kelistrikan, hingga manajemen bengkel modern.',
                'foto_jurusan'          => '/images/jurusan-tbsm.jpg',
                'poin_kompetensi'       => [
                    [
                        'pilihan_icon' => 'build',
                        'judul'        => 'Perawatan Sepeda Motor',
                        'deskripsi'    => 'Mempelajari cara perawatan rutin, tune-up, dan servis berkala mesin sepeda motor sesuai standar pabrikan.',
                    ],
                    [
                        'pilihan_icon' => 'settings',
                        'judul'        => 'Pemeriksaan dan Perbaikan',
                        'deskripsi'    => 'Menganalisis gangguan kerusakan chassis, sistem rem, suspensi, dan transmisi transmisi manual/otomatis.',
                    ],
                    [
                        'pilihan_icon' => 'bolt',
                        'judul'        => 'Teknologi Kelistrikan Motor',
                        'deskripsi'    => 'Mengenal dan menguasai instalasi kelistrikan, sistem starter, pengapian EFI/injeksi, dan sensor modern.',
                    ],
                ],
                'prospek_karier'        => 'Lulusan program keahlian TBSM memiliki prospek karier yang luas sebagai Teknisi/Mekanik Sepeda Motor di Dealer Resmi (AHASS/Yamaha), Service Advisor, Wirausaha Bengkel Mandiri, Operator Perakitan Industri Otomotif, serta Teknisi Modifikasi Roda Dua.',
                'urutan_tampil'         => 1,
            ]
        );
    }
}
