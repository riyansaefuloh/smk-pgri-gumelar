<?php

use App\Models\HalamanHeader;
use App\Models\KategoriKarya;
use App\Models\TefaBengkel;
use App\Models\TefaKarya;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing tefa cms routes', function () {
    $this->get('/admin/tefa-bengkel')->assertRedirect(route('login', absolute: false));
    $this->get('/admin/tefa-karya')->assertRedirect(route('login', absolute: false));
});

test('admin can view and update tefa bengkel sections independently', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/tefa-bengkel')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/TefaBengkel/Index'));

    // 1. Update Header
    $this->actingAs($admin)
        ->put('/admin/tefa-bengkel/header', [
            'judul_header' => 'Mengenal TEFA Sekolah',
            'subjudul_header' => 'Bengkel praktik siswa berbasis standar industri.',
        ])
        ->assertRedirect(route('admin.tefa-bengkel'));

    expect(HalamanHeader::where('kode_halaman', 'tefa')->first())
        ->judul_header->toBe('Mengenal TEFA Sekolah');

    // 2. Update Profil & Upload Foto
    $foto = UploadedFile::fake()->image('bengkel.jpg', 600, 800);
    $this->actingAs($admin)
        ->put('/admin/tefa-bengkel/profil', [
            'nama_unit_bengkel' => 'TEFA Automotive Service',
            'jadwal_operasional' => 'Senin - Sabtu, 08.00 - 15.00 WIB',
            'deskripsi_bengkel' => 'Layanan servis berkala oleh siswa kompetensi otomotif.',
            'foto_bengkel' => $foto,
        ])
        ->assertRedirect(route('admin.tefa-bengkel'));

    $bengkel = TefaBengkel::first();
    expect($bengkel)->not->toBeNull()
        ->nama_unit_bengkel->toBe('TEFA Automotive Service');

    $storedPath = str_replace('/storage/', '', $bengkel->foto_bengkel);
    Storage::disk('public')->assertExists($storedPath);

    // 3. Update Layanan
    $this->actingAs($admin)
        ->put('/admin/tefa-bengkel/layanan', [
            'daftar_layanan' => [
                ['nama_layanan' => 'Servis Ringan', 'deskripsi_layanan' => 'Tune-up dan ganti oli mesin.'],
                ['nama_layanan' => 'Ganti Kampas Rem', 'deskripsi_layanan' => 'Pemeriksaan dan penggantian rem.'],
            ],
        ])
        ->assertRedirect(route('admin.tefa-bengkel'));

    expect($bengkel->fresh()->daftar_layanan)->toHaveCount(2);
});

test('admin can manage kategori karya and protect categories in use', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post('/admin/tefa-karya/kategori', ['nama_kategori' => 'Inovasi Mesin'])
        ->assertRedirect();

    $kategori = KategoriKarya::where('nama_kategori', 'Inovasi Mesin')->first();
    expect($kategori)->not->toBeNull()
        ->slug_kategori->toBe('inovasi-mesin');

    // Rename kategori
    $this->actingAs($admin)
        ->put("/admin/tefa-karya/kategori/{$kategori->id}", ['nama_kategori' => 'Teknologi Roda Dua'])
        ->assertRedirect();

    expect($kategori->fresh()->nama_kategori)->toBe('Teknologi Roda Dua');

    // Kaitkan dengan satu karya agar tidak bisa dihapus
    TefaKarya::create([
        'kategori_karya_id' => $kategori->id,
        'judul_karya' => 'Alat Uji Injektor',
        'slug_karya' => 'alat-uji-injektor',
        'foto_karya' => '/storage/tefa/karya/dummy.jpg',
        'deskripsi_karya' => 'Perangkat uji semprotan injektor.',
        'status_publikasi' => true,
        'urutan_tampil' => 1,
    ]);

    $this->actingAs($admin)
        ->deleteJson("/admin/tefa-karya/kategori/{$kategori->id}")
        ->assertStatus(422);

    expect(KategoriKarya::find($kategori->id))->not->toBeNull();

    // Kategori kosong dapat dihapus
    $emptyKat = KategoriKarya::create([
        'nama_kategori' => 'Sementara',
        'slug_kategori' => 'sementara',
    ]);

    $this->actingAs($admin)
        ->delete("/admin/tefa-karya/kategori/{$emptyKat->id}")
        ->assertRedirect();

    expect(KategoriKarya::find($emptyKat->id))->toBeNull();
});

test('admin can create, update, toggle, filter, and delete tefa karya', function () {
    Storage::fake('public');
    $admin = User::factory()->create();
    $kategori = KategoriKarya::create([
        'nama_kategori' => 'Rancang Bangun',
        'slug_kategori' => 'rancang-bangun',
    ]);

    // Store karya
    $foto1 = UploadedFile::fake()->image('karya1.jpg', 800, 450);
    $this->actingAs($admin)
        ->post('/admin/tefa-karya', [
            'kategori_karya_id' => $kategori->id,
            'judul_karya' => 'Sepeda Motor Listrik',
            'deskripsi_karya' => 'Konversi rangka motor dengan penggerak listrik.',
            'urutan_tampil' => 1,
            'status_publikasi' => true,
            'foto_karya' => $foto1,
        ])
        ->assertRedirect(route('admin.tefa-karya'));

    $karya = TefaKarya::first();
    expect($karya)->not->toBeNull()
        ->judul_karya->toBe('Sepeda Motor Listrik')
        ->status_publikasi->toBeTrue();

    $oldPhoto = str_replace('/storage/', '', $karya->foto_karya);
    Storage::disk('public')->assertExists($oldPhoto);

    // Index with per_page parameter
    $this->actingAs($admin)
        ->get('/admin/tefa-karya?per_page=20&search=Listrik')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/TefaKarya/Index')
            ->where('filters.per_page', 20)
            ->has('karyas.data', 1)
        );

    // Toggle status
    $this->actingAs($admin)
        ->patch("/admin/tefa-karya/{$karya->id}/toggle")
        ->assertRedirect();

    expect($karya->fresh()->status_publikasi)->toBeFalse();

    // Update karya with new photo removes old photo
    $foto2 = UploadedFile::fake()->image('karya2.png', 800, 450);
    $this->actingAs($admin)
        ->put("/admin/tefa-karya/{$karya->id}", [
            'kategori_karya_id' => $kategori->id,
            'judul_karya' => 'Sepeda Motor Listrik V2',
            'deskripsi_karya' => 'Pembaruan baterai dan kontroler.',
            'urutan_tampil' => 2,
            'status_publikasi' => true,
            'foto_karya' => $foto2,
        ])
        ->assertRedirect(route('admin.tefa-karya'));

    $karya->refresh();
    expect($karya->judul_karya)->toBe('Sepeda Motor Listrik V2');
    Storage::disk('public')->assertMissing($oldPhoto);
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $karya->foto_karya));

    // Destroy karya removes photo and record
    $currentPhoto = str_replace('/storage/', '', $karya->foto_karya);
    $this->actingAs($admin)
        ->delete("/admin/tefa-karya/{$karya->id}")
        ->assertRedirect(route('admin.tefa-karya'));

    expect(TefaKarya::find($karya->id))->toBeNull();
    Storage::disk('public')->assertMissing($currentPhoto);
});

test('public beranda renders cleanly and only includes published tefa karya', function () {
    $kategori = KategoriKarya::create([
        'nama_kategori' => 'Karya Siswa',
        'slug_kategori' => 'karya-siswa',
    ]);

    TefaKarya::create([
        'kategori_karya_id' => $kategori->id,
        'judul_karya' => 'Karya Tayang Publik',
        'slug_karya' => 'karya-tayang-publik',
        'foto_karya' => '/storage/tefa/karya/pub.jpg',
        'deskripsi_karya' => 'Tampil di beranda publik.',
        'status_publikasi' => true,
        'urutan_tampil' => 1,
    ]);

    TefaKarya::create([
        'kategori_karya_id' => $kategori->id,
        'judul_karya' => 'Karya Draft Internal',
        'slug_karya' => 'karya-draft-internal',
        'foto_karya' => '/storage/tefa/karya/draft.jpg',
        'deskripsi_karya' => 'Tidak boleh tampil di publik.',
        'status_publikasi' => false,
        'urutan_tampil' => 0,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Beranda')
            ->has('karya_terbaru', 1)
            ->where('karya_terbaru.0.judul_karya', 'Karya Tayang Publik')
        );
});
