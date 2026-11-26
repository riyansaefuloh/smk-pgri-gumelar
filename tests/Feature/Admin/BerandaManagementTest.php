<?php

use App\Models\Beranda;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin beranda', function () {
    $this->get('/admin/beranda')->assertRedirect(route('login', absolute: false));
});

test('admin can view and update beranda sections independently', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/beranda')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/Beranda/Index'));

    // 1. Update Hero Banner + Upload Gambar
    $heroImage = UploadedFile::fake()->image('hero.jpg', 1280, 720);
    $this->actingAs($admin)
        ->put('/admin/beranda/hero', [
            'judul_hero'    => 'Judul Hero Terbaru',
            'subjudul_hero' => 'Subjudul hero terbaru untuk halaman depan.',
            'gambar_hero'   => $heroImage,
        ])
        ->assertRedirect(route('admin.beranda'))
        ->assertSessionHas('success');

    $beranda = Beranda::first();
    expect($beranda)->not->toBeNull()
        ->judul_hero->toBe('Judul Hero Terbaru')
        ->subjudul_hero->toBe('Subjudul hero terbaru untuk halaman depan.');

    $heroPath = str_replace('/storage/', '', $beranda->gambar_hero);
    Storage::disk('public')->assertExists($heroPath);

    // 2. Update Sambutan Kepala Sekolah + Upload Foto
    $kepsekImage = UploadedFile::fake()->image('kepsek.png', 600, 800);
    $this->actingAs($admin)
        ->put('/admin/beranda/sambutan', [
            'nama_kepala_sekolah' => 'Drs. Ahmad Hidayat, M.Pd.',
            'teks_sambutan'       => 'Selamat datang di portal resmi sekolah kami.',
            'foto_kepala_sekolah' => $kepsekImage,
        ])
        ->assertRedirect(route('admin.beranda'))
        ->assertSessionHas('success');

    $beranda->refresh();
    expect($beranda->nama_kepala_sekolah)->toBe('Drs. Ahmad Hidayat, M.Pd.');
    $kepsekPath = str_replace('/storage/', '', $beranda->foto_kepala_sekolah);
    Storage::disk('public')->assertExists($kepsekPath);

    // 3. Update Banner Bawah + Upload Gambar
    $bannerImage = UploadedFile::fake()->image('banner.webp', 1280, 720);
    $this->actingAs($admin)
        ->put('/admin/beranda/banner-bawah', [
            'judul_banner_bawah'    => 'Mari Bergabung Bersama Kami',
            'subjudul_banner_bawah' => 'Daftar sekarang untuk tahun ajaran baru.',
            'gambar_banner_bawah'   => $bannerImage,
        ])
        ->assertRedirect(route('admin.beranda'))
        ->assertSessionHas('success');

    $beranda->refresh();
    expect($beranda->judul_banner_bawah)->toBe('Mari Bergabung Bersama Kami');
    $bannerPath = str_replace('/storage/', '', $beranda->gambar_banner_bawah);
    Storage::disk('public')->assertExists($bannerPath);
});

test('beranda section updates validate required fields and image formats', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->put('/admin/beranda/hero', [
            'judul_hero'    => '',
            'subjudul_hero' => '',
            'gambar_hero'   => UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors(['judul_hero', 'subjudul_hero', 'gambar_hero']);
});
