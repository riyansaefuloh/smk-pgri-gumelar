<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin Default CMS
        User::firstOrCreate(
            ['email' => 'admin@smkpgri-gumelar.sch.id'],
            [
                'name'     => 'Admin SMK PGRI Gumelar',
                'password' => Hash::make('admin12345'),
            ]
        );

        // 2. Panggil Seluruh Seeder Data Awal
        $this->call([
            HalamanHeaderSeeder::class,
            KodeAlumniSeeder::class,
            BerandaSeeder::class,
            TentangSekolahSeeder::class,
            ProgramKeahlianSeeder::class,
            SpmbHalamanSeeder::class,
            SpmbGelombangSeeder::class,
            SpmbPendaftarSeeder::class,
            KontakSekolahSeeder::class,
            KategoriSeeder::class,
        ]);
    }
}
