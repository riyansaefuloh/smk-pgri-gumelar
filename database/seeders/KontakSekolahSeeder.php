<?php

namespace Database\Seeders;

use App\Models\KontakSekolah;
use Illuminate\Database\Seeder;

class KontakSekolahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KontakSekolah::updateOrCreate(
            ['id' => 1],
            [
                'nomor_telepon'     => '(0281) 657xxxx',
                'nomor_whatsapp'    => '081234567890',
                'alamat_email'      => 'smkpgridm.gumelar@gmail.com',
                'alamat_lengkap'    => 'Jl. Raya Gumelar, Kecamatan Gumelar, Kabupaten Banyumas, Jawa Tengah 53165',
                'embed_google_maps' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.842750376269!2d108.9890!3d-7.3710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjInMTUuNiJTIDEwOMKwNTknMjAuNCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'link_instagram'    => 'https://instagram.com/smkpgri_gumelar',
                'link_tiktok'       => 'https://tiktok.com/@smkpgri_gumelar',
                'link_youtube'      => 'https://youtube.com/@smkpgri_gumelar',
            ]
        );
    }
}
