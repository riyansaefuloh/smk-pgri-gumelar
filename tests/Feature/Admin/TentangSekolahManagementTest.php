<?php

use App\Models\TentangSekolah;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin tentang sekolah', function () {
    $this->get('/admin/tentang-sekolah')->assertRedirect(route('login', absolute: false));
});

test('admin can view and update tentang sekolah sections independently', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/tentang-sekolah')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/TentangSekolah/Index'));

    // 1. Update Profil & Upload Foto Gedung
    $fotoGedung = UploadedFile::fake()->image('gedung.jpg', 1280, 720);
    $this->actingAs($admin)
        ->put('/admin/tentang-sekolah/profil', [
            'judul_halaman'       => 'Mengenal SMK PGRI Gumelar',
            'sub_judul_halaman'   => 'Sekolah kejuruan unggulan berfokus pada kompetensi industri.',
            'foto_gedung_sekolah' => $fotoGedung,
        ])
        ->assertRedirect(route('admin.tentang-sekolah'))
        ->assertSessionHas('success');

    $tentang = TentangSekolah::first();
    expect($tentang)->not->toBeNull()
        ->judul_halaman->toBe('Mengenal SMK PGRI Gumelar');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $tentang->foto_gedung_sekolah));

    // 2. Update Statistik Ringkas
    $this->actingAs($admin)
        ->put('/admin/tentang-sekolah/statistik', [
            'jumlah_jurusan'        => '2',
            'jumlah_siswa'          => '150+',
            'jumlah_guru_staf'      => '18',
            'lama_tahun_beroperasi' => '13+',
        ])
        ->assertRedirect(route('admin.tentang-sekolah'))
        ->assertSessionHas('success');

    expect($tentang->fresh()->jumlah_siswa)->toBe('150+');

    // 3. Update Visi & Daftar Misi
    $this->actingAs($admin)
        ->put('/admin/tentang-sekolah/visi', [
            'teks_visi' => 'Menjadi SMK unggul dan berkarakter.',
        ])
        ->assertRedirect(route('admin.tentang-sekolah'));

    $this->actingAs($admin)
        ->put('/admin/tentang-sekolah/misi', [
            'poin_misi' => [
                'Menyelenggarakan pembelajaran berbasis industri.',
                'Membentuk karakter disiplin dan mandiri.',
            ],
        ])
        ->assertRedirect(route('admin.tentang-sekolah'));

    $tentang->refresh();
    expect($tentang->teks_visi)->toBe('Menjadi SMK unggul dan berkarakter.')
        ->and($tentang->poin_misi)->toHaveCount(2);

    // 4. Update Legalitas & Upload Foto Legalitas
    $fotoLegalitas = UploadedFile::fake()->image('legalitas.png', 1280, 720);
    $this->actingAs($admin)
        ->put('/admin/tentang-sekolah/legalitas', [
            'judul_legalitas'       => 'Izin Operasional Resmi',
            'keterangan_legalitas'  => 'SK Nomor 422/217 Tahun 2014.',
            'nama_sekolah'          => 'SMK PGRI Gumelar',
            'npsn'                  => '12345678',
            'sk_izin_operasional'   => '422/217 Tahun 2014',
            'jenjang_status'        => 'SMK / Swasta',
            'yayasan_penyelenggara' => 'YPLP DM PGRI JT Cabang Banyumas',
            'akreditasi'            => 'B',
            'foto_legalitas'        => $fotoLegalitas,
        ])
        ->assertRedirect(route('admin.tentang-sekolah'))
        ->assertSessionHas('success');

    $tentang->refresh();
    expect($tentang->judul_legalitas)->toBe('Izin Operasional Resmi')
        ->and($tentang->nama_sekolah)->toBe('SMK PGRI Gumelar')
        ->and($tentang->npsn)->toBe('12345678')
        ->and($tentang->sk_izin_operasional)->toBe('422/217 Tahun 2014')
        ->and($tentang->jenjang_status)->toBe('SMK / Swasta')
        ->and($tentang->yayasan_penyelenggara)->toBe('YPLP DM PGRI JT Cabang Banyumas')
        ->and($tentang->akreditasi)->toBe('B');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $tentang->foto_legalitas));
});
