<?php

namespace Database\Seeders;

use App\Models\Beranda;
use Illuminate\Database\Seeder;

class BerandaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Beranda::updateOrCreate(
            ['id' => 1],
            [
                'judul_hero'            => 'Membangun Generasi Terampil dan Siap Menghadapi Masa Depan',
                'subjudul_hero'         => 'Kenali SMK PGRI Gumelar sebagai tempat untuk mengembangkan potensi, mengasah keterampilan, dan mempersiapkan diri menghadapi dunia kerja maupun pendidikan lanjutan.',
                'gambar_hero'           => '/images/hero-default.jpg',
                'nama_kepala_sekolah'   => 'Ratna Dewi Astuti, S.Pd.',
                'foto_kepala_sekolah'   => '/images/kepala-sekolah.jpg',
                'teks_sambutan'         => 'Selamat datang di website resmi SMK PGRI Gumelar. Website ini menjadi sarana bagi masyarakat untuk mengenal sekolah, memperoleh informasi pendidikan, serta melihat berbagai kegiatan dan karya siswa. Kami berkomitmen untuk mendukung peserta didik dalam mengembangkan potensi, meningkatkan keterampilan, dan mempersiapkan diri menghadapi dunia kerja maupun melanjutkan pendidikan. Semoga website ini dapat memberikan informasi yang bermanfaat bagi siswa, orang tua, alumni, dan masyarakat.',
                'judul_banner_bawah'    => 'Masa Depan Cerah Dimulai dari Sini!',
                'subjudul_banner_bawah' => 'Jangan lewatkan kesempatan untuk bergabung bersama SMK PGRI Gumelar. Dapatkan pendidikan kejuruan berkualitas dengan fasilitas dan praktik terbaik.',
                'gambar_banner_bawah'   => '/images/banner-bawah.jpg',
            ]
        );
    }
}
