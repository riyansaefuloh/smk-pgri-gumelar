<?php

namespace Database\Seeders;

use App\Models\KategoriBerita;
use App\Models\KategoriKegiatan;
use App\Models\KategoriKarya;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Kategori Berita
        $kategoriBeritas = ['Pengumuman', 'Prestasi', 'Kegiatan Sekolah', 'Akademik', 'Artikel'];
        foreach ($kategoriBeritas as $nama) {
            KategoriBerita::firstOrCreate(
                ['nama_kategori' => $nama],
                ['slug_kategori' => Str::slug($nama)]
            );
        }

        // 2. Kategori Kegiatan (Kalender)
        $kategoriKegiatans = ['Akademik', 'Workshop Industri', 'Ujian & Asesmen', 'Kegiatan Kesiswaan'];
        foreach ($kategoriKegiatans as $nama) {
            KategoriKegiatan::firstOrCreate(['nama_kategori' => $nama]);
        }

        // 3. Kategori Karya Siswa
        $kategoriKaryas = ['Otomotif', 'Kreativitas Siswa', 'Kelistrikan', 'Modifikasi Sepeda Motor'];
        foreach ($kategoriKaryas as $nama) {
            KategoriKarya::firstOrCreate(
                ['nama_kategori' => $nama],
                ['slug_kategori' => Str::slug($nama)]
            );
        }
    }
}
