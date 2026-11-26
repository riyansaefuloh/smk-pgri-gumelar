<?php

use App\Models\SejarahSekolah;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guest users are redirected to login when accessing admin sejarah sekolah', function () {
    $this->get('/admin/sejarah-sekolah')->assertRedirect(route('login', absolute: false));
});

test('admin can view and update sejarah sekolah narasi and milestones', function () {
    Storage::fake('public');
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get('/admin/sejarah-sekolah')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Admin/SejarahSekolah/Index'));

    // 1. Update Narasi & Upload Foto Sekolah
    $foto = UploadedFile::fake()->image('sejarah.jpg', 1280, 720);
    $this->actingAs($admin)
        ->put('/admin/sejarah-sekolah/narasi', [
            'judul_sejarah'     => 'Perjalanan Sejarah Sekolah',
            'deskripsi_sejarah' => 'Narasi lengkap perjalanan sekolah sejak tahun berdirinya.',
            'foto_sekolah'      => $foto,
        ])
        ->assertRedirect(route('admin.sejarah-sekolah'))
        ->assertSessionHas('success');

    $sejarah = SejarahSekolah::first();
    expect($sejarah)->not->toBeNull()
        ->judul_sejarah->toBe('Perjalanan Sejarah Sekolah');
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $sejarah->foto_sekolah));

    // 2. Update Milestone
    $this->actingAs($admin)
        ->put('/admin/sejarah-sekolah/milestone', [
            'daftar_milestone' => [
                ['tahun' => '2014', 'judul' => 'Pendirian Sekolah', 'deskripsi' => 'Izin operasional resmi diterbitkan.'],
                ['tahun' => '2020', 'judul' => 'Pengembangan Bengkel', 'deskripsi' => 'Peningkatan fasilitas praktik siswa.'],
            ],
        ])
        ->assertRedirect(route('admin.sejarah-sekolah'))
        ->assertSessionHas('success');

    expect($sejarah->fresh()->daftar_milestone)->toHaveCount(2);
});
