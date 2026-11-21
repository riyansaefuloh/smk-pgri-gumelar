<?php

namespace Database\Seeders;

use App\Models\TentangSekolah;
use Illuminate\Database\Seeder;

class TentangSekolahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TentangSekolah::updateOrCreate(
            ['id' => 1],
            [
                'judul_halaman'        => 'Mengenal SMK PGRI Gumelar Lebih Dekat',
                'sub_judul_halaman'    => 'SMK PGRI Gumelar merupakan lembaga pendidikan kejuruan yang berfokus pada pengembangan pengetahuan, keterampilan, dan karakter siswa. Melalui pembelajaran teori dan praktik, sekolah menjadi tempat bagi siswa untuk mengembangkan potensi diri sebagai bekal menghadapi dunia kerja, berwirausaha, maupun melanjutkan pendidikan.',
                'foto_gedung_sekolah'  => '/images/gedung-sekolah.jpg',
                'teks_visi'            => 'Terwujudnya lulusan SMK PGRI Gumelar yang berakhlak mulia, kompeten, berjiwa wirausaha, dan siap bersaing di dunia kerja maupun pendidikan lanjutan.',
                'poin_misi'            => [
                    'Menyelenggarakan pembelajaran kejuruan yang berorientasi pada kebutuhan dunia usaha dan dunia industri (DUDI).',
                    'Membentuk karakter peserta didik yang disiplin, mandiri, dan berakhlak terpuji.',
                    'Mengembangkan potensi kewirausahaan dan keahlian praktis melalui kegiatan Teaching Factory (TEFA).',
                    'Meningkatkan mutu sarana dan prasarana pembelajaran sesuai standar industri.',
                ],
                'jumlah_jurusan'       => '1',
                'jumlah_siswa'         => '100+',
                'jumlah_guru_staf'     => '15',
                'lama_tahun_beroperasi'=> '12+',
                'judul_legalitas'      => 'Awal Operasional & Izin Resmi Sekolah',
                'keterangan_legalitas' => 'SMK PGRI Gumelar menyelenggarakan pendidikan kejuruan berdasarkan izin operasional resmi SK Nomor 422/217 Tahun 2014 di bawah naungan YPLP DM PGRI JT Cabang Banyumas.',
                'foto_legalitas'       => '/images/dokumen-legalitas.jpg',
            ]
        );
    }
}
