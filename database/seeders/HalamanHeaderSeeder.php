<?php

namespace Database\Seeders;

use App\Models\HalamanHeader;
use Illuminate\Database\Seeder;

class HalamanHeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $headers = [
            [
                'kode_halaman'   => 'berita',
                'judul_header'   => 'Temukan Informasi Terbaru dari SMK PGRI Gumelar',
                'subjudul_header' => 'Ikuti berbagai informasi, kegiatan, dan pengumuman terbaru seputar SMK PGRI Gumelar melalui halaman ini.',
            ],
            [
                'kode_halaman'   => 'guru',
                'judul_header'   => 'Mengenal Tenaga Pendidik Kami',
                'subjudul_header' => 'Didukung oleh tenaga pendidik dan kependidikan yang berperan dalam menciptakan lingkungan belajar yang nyaman, mendukung perkembangan siswa, serta membantu mempersiapkan generasi yang terampil dan berkarakter.',
            ],
            [
                'kode_halaman'   => 'sarpras',
                'judul_header'   => 'Fasilitas untuk Mendukung Potensi Siswa',
                'subjudul_header' => 'Lingkungan belajar yang didukung fasilitas memadai membantu siswa mengembangkan pengetahuan, keterampilan, dan pengalaman praktik sebagai bekal untuk masa depan.',
            ],
            [
                'kode_halaman'   => 'jurusan',
                'judul_header'   => 'Temukan Minat dan Kembangkan Keahlianmu',
                'subjudul_header' => 'SMK PGRI Gumelar menghadirkan pembelajaran kejuruan yang berfokus pada pengembangan pengetahuan dan keterampilan sesuai bidang keahlian.',
            ],
            [
                'kode_halaman'   => 'kalender',
                'judul_header'   => 'Kalender Akademik & Agenda Kegiatan',
                'subjudul_header' => 'Temukan jadwal kegiatan dan agenda penting SMK PGRI Gumelar agar kamu selalu mengetahui informasi terbaru dari sekolah.',
            ],
            [
                'kode_halaman'   => 'unduhan',
                'judul_header'   => 'Pusat Unduhan',
                'subjudul_header' => 'Akses berbagai dokumen dan berkas akademik yang disediakan sekolah dalam satu tempat agar lebih mudah ditemukan dan diunduh saat dibutuhkan.',
            ],
            [
                'kode_halaman'   => 'tefa',
                'judul_header'   => 'Mengenal TEFA (Teaching Factory)',
                'subjudul_header' => 'Teaching Factory (TEFA) merupakan konsep pembelajaran yang menggabungkan kegiatan belajar di sekolah dengan suasana dan standar kerja industri untuk membekali siswa dengan pengalaman nyata.',
            ],
            [
                'kode_halaman'   => 'karya',
                'judul_header'   => 'Eksplorasi Karya dan Kreativitas',
                'subjudul_header' => 'Lihat berbagai kegiatan praktik dan karya siswa SMK PGRI Gumelar dalam mengembangkan keterampilan, kreativitas, dan pengalaman di bidang otomotif.',
            ],
            [
                'kode_halaman'   => 'bkk',
                'judul_header'   => 'Temukan Peluang Kariermu di Sini',
                'subjudul_header' => 'Dapatkan informasi lowongan pekerjaan dari berbagai perusahaan dan mitra industri. Temukan peluang karier yang sesuai dengan minat, keahlian, dan kompetensi yang telah kamu pelajari selama di SMK PGRI Gumelar.',
            ],
            [
                'kode_halaman'   => 'tracer',
                'judul_header'   => 'Mari Tetap Terhubung Melalui Tracer Study',
                'subjudul_header' => 'Bagikan informasi tentang perjalananmu setelah lulus dari SMK PGRI Gumelar. Melalui Tracer Study, sekolah dapat mengetahui perkembangan alumni, mulai dari status pekerjaan hingga pendidikan lanjutan.',
            ],
        ];

        foreach ($headers as $header) {
            HalamanHeader::updateOrCreate(
                ['kode_halaman' => $header['kode_halaman']],
                $header
            );
        }
    }
}
