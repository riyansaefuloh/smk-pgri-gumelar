<?php

namespace Database\Seeders;

use App\Models\KodeAlumni;
use Illuminate\Database\Seeder;

class KodeAlumniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kodes = [
            ['kode_validasi' => 'PGRI-ALUMNI-2026'],
            ['kode_validasi' => 'ALUMNI-GUMELAR'],
        ];

        foreach ($kodes as $item) {
            KodeAlumni::firstOrCreate(['kode_validasi' => $item['kode_validasi']]);
        }
    }
}
