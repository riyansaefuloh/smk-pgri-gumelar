<?php

use App\Models\StrukturOrganisasi;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin struktur organisasi', function () {
    $this->get('/admin/struktur-organisasi')->assertRedirect(route('login', absolute: false));
});

test('admin can view and update struktur organisasi with chart image', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/struktur-organisasi')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/StrukturOrganisasi/Index'));

    $bagan = UploadedFile::fake()->image('bagan-struktur.png', 1600, 900);
    $this->actingAs($admin)
        ->put('/admin/struktur-organisasi', [
            'judul_halaman'         => 'Struktur Organisasi Sekolah',
            'subjudul_halaman'      => 'Susunan kepemimpinan dan tata kelola sekolah.',
            'gambar_bagan_struktur' => $bagan,
        ])
        ->assertRedirect(route('admin.struktur-organisasi'))
        ->assertSessionHas('success');

    $struktur = StrukturOrganisasi::first();
    expect($struktur)->not->toBeNull()
        ->judul_halaman->toBe('Struktur Organisasi Sekolah');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $struktur->gambar_bagan_struktur));
});
