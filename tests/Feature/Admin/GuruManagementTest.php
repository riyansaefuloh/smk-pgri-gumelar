<?php

use App\Models\Guru;
use App\Models\HalamanHeader;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin guru', function () {
    $this->get('/admin/guru')->assertRedirect(route('login', absolute: false));
});

test('admin can view, create, update, and delete guru with header', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/guru')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/Guru/Index'));

    // 1. Update Header
    $this->actingAs($admin)
        ->put('/admin/guru/header', [
            'judul_header'    => 'Mengenal Tenaga Pendidik Kami',
            'subjudul_header' => 'Dewan guru dan staf profesional.',
        ])
        ->assertRedirect(route('admin.guru'));

    expect(HalamanHeader::where('kode_halaman', 'guru')->first())
        ->judul_header->toBe('Mengenal Tenaga Pendidik Kami');

    // 2. Store Guru
    $foto = UploadedFile::fake()->image('guru.jpg', 600, 800);
    $this->actingAs($admin)
        ->post('/admin/guru', [
            'nama_lengkap_gelar' => 'Budi Santoso, S.Pd.',
            'jabatan'            => 'Guru Produktif',
            'mata_pelajaran'     => 'Teknik Sepeda Motor',
            'urutan_tampil'      => 1,
            'foto_profil'        => $foto,
        ])
        ->assertRedirect(route('admin.guru'))
        ->assertSessionHas('success');

    $guru = Guru::first();
    expect($guru)->not->toBeNull()
        ->nama_lengkap_gelar->toBe('Budi Santoso, S.Pd.')
        ->mata_pelajaran->toBe('Teknik Sepeda Motor');
    $storedPath = str_replace('/storage/', '', $guru->foto_profil);
    Storage::disk('public')->assertExists($storedPath);

    // 3. Update Guru
    $this->actingAs($admin)
        ->put("/admin/guru/{$guru->id}", [
            'nama_lengkap_gelar' => 'Budi Santoso, M.Pd.',
            'jabatan'            => 'Kepala Bengkel',
            'mata_pelajaran'     => 'Perawatan Mesin',
            'urutan_tampil'      => 2,
        ])
        ->assertRedirect(route('admin.guru'));

    expect($guru->fresh()->nama_lengkap_gelar)->toBe('Budi Santoso, M.Pd.')
        ->and($guru->fresh()->mata_pelajaran)->toBe('Perawatan Mesin');

    // 4. Delete Guru
    $this->actingAs($admin)
        ->delete("/admin/guru/{$guru->id}")
        ->assertRedirect(route('admin.guru'));

    expect(Guru::count())->toBe(0);
    Storage::disk('public')->assertMissing($storedPath);
});
