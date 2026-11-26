<?php

use App\Models\HalamanHeader;
use App\Models\KategoriSarpras;
use App\Models\Sarpras;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin sarpras', function () {
    $this->get('/admin/sarpras')->assertRedirect(route('login', absolute: false));
});

test('admin can manage kategori sarpras and protect categories in use', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post('/admin/sarpras/kategori', ['nama_kategori' => 'Ruang Praktik'])
        ->assertRedirect();

    $kategori = KategoriSarpras::where('nama_kategori', 'Ruang Praktik')->first();
    expect($kategori)->not->toBeNull()
        ->slug_kategori->toBe('ruang-praktik');

    $this->actingAs($admin)
        ->put("/admin/sarpras/kategori/{$kategori->id}", ['nama_kategori' => 'Bengkel & Lab'])
        ->assertRedirect();

    expect($kategori->fresh()->nama_kategori)->toBe('Bengkel & Lab');

    $this->actingAs($admin)
        ->delete("/admin/sarpras/kategori/{$kategori->id}")
        ->assertRedirect();

    expect(KategoriSarpras::count())->toBe(0);
});

test('admin can view, create, toggle, update, and delete sarpras with header', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $kategori = KategoriSarpras::create([
        'nama_kategori' => 'Ruang Praktik',
        'slug_kategori' => 'ruang-praktik',
    ]);

    $this->actingAs($admin)
        ->get('/admin/sarpras')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/Sarpras/Index'));

    // 1. Update Header
    $this->actingAs($admin)
        ->put('/admin/sarpras/header', [
            'judul_header'    => 'Fasilitas Sekolah',
            'subjudul_header' => 'Sarana dan prasarana penunjang pembelajaran.',
        ])
        ->assertRedirect(route('admin.sarpras'));

    expect(HalamanHeader::where('kode_halaman', 'sarpras')->first())
        ->judul_header->toBe('Fasilitas Sekolah');

    // 2. Store Sarpras
    $foto = UploadedFile::fake()->image('bengkel.jpg', 1280, 720);
    $this->actingAs($admin)
        ->post('/admin/sarpras', [
            'kategori_sarpras_id' => $kategori->id,
            'nama_fasilitas'      => 'Bengkel Praktik Otomotif',
            'deskripsi_fasilitas' => 'Dilengkapi peralatan standar industri.',
            'status_publikasi'    => true,
            'urutan_tampil'       => 1,
            'foto_fasilitas'      => $foto,
        ])
        ->assertRedirect(route('admin.sarpras'))
        ->assertSessionHas('success');

    $item = Sarpras::first();
    expect($item)->not->toBeNull()
        ->nama_fasilitas->toBe('Bengkel Praktik Otomotif')
        ->status_publikasi->toBeTrue();
    $storedPath = str_replace('/storage/', '', $item->foto_fasilitas);
    Storage::disk('public')->assertExists($storedPath);

    // 3. Toggle Status Publikasi
    $this->actingAs($admin)
        ->patch("/admin/sarpras/{$item->id}/toggle")
        ->assertRedirect();

    expect($item->fresh()->status_publikasi)->toBeFalse();

    // 4. Delete kategori in use must fail
    $this->actingAs($admin)
        ->delete("/admin/sarpras/kategori/{$kategori->id}")
        ->assertSessionHas('error');
    expect(KategoriSarpras::count())->toBe(1);

    // 5. Update Sarpras
    $this->actingAs($admin)
        ->put("/admin/sarpras/{$item->id}", [
            'kategori_sarpras_id' => $kategori->id,
            'nama_fasilitas'      => 'Bengkel Praktik Terpadu',
            'deskripsi_fasilitas' => 'Pembaruan deskripsi fasilitas bengkel.',
            'status_publikasi'    => true,
            'urutan_tampil'       => 2,
        ])
        ->assertRedirect(route('admin.sarpras'));

    expect($item->fresh()->nama_fasilitas)->toBe('Bengkel Praktik Terpadu');

    // 6. Delete Sarpras
    $this->actingAs($admin)
        ->delete("/admin/sarpras/{$item->id}")
        ->assertRedirect(route('admin.sarpras'));

    expect(Sarpras::count())->toBe(0);
    Storage::disk('public')->assertMissing($storedPath);
});
