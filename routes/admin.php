<?php

use App\Http\Controllers\Admin\BerandaController;
use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\SarprasController;
use App\Http\Controllers\Admin\SejarahSekolahController;
use App\Http\Controllers\Admin\StrukturOrganisasiController;
use App\Http\Controllers\Admin\TefaBengkelController;
use App\Http\Controllers\Admin\TefaKaryaController;
use App\Http\Controllers\Admin\TentangSekolahController;
use App\Http\Controllers\Admin\SpmbGelombangController;
use App\Http\Controllers\Admin\SpmbHalamanController;
use App\Http\Controllers\Admin\SpmbPendaftarController;
use App\Models\Beranda;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin CMS Routes (Prefix: /admin, Middleware: auth, verified)
|--------------------------------------------------------------------------
*/

// 1. Profil Sekolah
Route::get('/beranda', [BerandaController::class, 'index'])->name('beranda');
Route::put('/beranda/hero', [BerandaController::class, 'updateHero'])->name('beranda.hero.update');
Route::put('/beranda/sambutan', [BerandaController::class, 'updateSambutan'])->name('beranda.sambutan.update');
Route::put('/beranda/banner-bawah', [BerandaController::class, 'updateBannerBawah'])->name('beranda.banner-bawah.update');

Route::get('/tentang-sekolah', [TentangSekolahController::class, 'index'])->name('tentang-sekolah');
Route::put('/tentang-sekolah/profil', [TentangSekolahController::class, 'updateProfil'])->name('tentang-sekolah.profil.update');
Route::put('/tentang-sekolah/statistik', [TentangSekolahController::class, 'updateStatistik'])->name('tentang-sekolah.statistik.update');
Route::put('/tentang-sekolah/visi', [TentangSekolahController::class, 'updateVisi'])->name('tentang-sekolah.visi.update');
Route::put('/tentang-sekolah/misi', [TentangSekolahController::class, 'updateMisi'])->name('tentang-sekolah.misi.update');
Route::put('/tentang-sekolah/legalitas', [TentangSekolahController::class, 'updateLegalitas'])->name('tentang-sekolah.legalitas.update');

Route::get('/sejarah-sekolah', [SejarahSekolahController::class, 'index'])->name('sejarah-sekolah');
Route::put('/sejarah-sekolah/narasi', [SejarahSekolahController::class, 'updateNarasi'])->name('sejarah-sekolah.narasi.update');
Route::put('/sejarah-sekolah/milestone', [SejarahSekolahController::class, 'updateMilestone'])->name('sejarah-sekolah.milestone.update');

Route::get('/struktur-organisasi', [StrukturOrganisasiController::class, 'index'])->name('struktur-organisasi');
Route::put('/struktur-organisasi', [StrukturOrganisasiController::class, 'update'])->name('struktur-organisasi.update');

Route::get('/guru', [GuruController::class, 'index'])->name('guru');
Route::put('/guru/header', [GuruController::class, 'updateHeader'])->name('guru.header.update');
Route::post('/guru', [GuruController::class, 'store'])->name('guru.store');
Route::put('/guru/{guru}', [GuruController::class, 'update'])->name('guru.update');
Route::delete('/guru/{guru}', [GuruController::class, 'destroy'])->name('guru.destroy');

Route::get('/sarpras', [SarprasController::class, 'index'])->name('sarpras');
Route::put('/sarpras/header', [SarprasController::class, 'updateHeader'])->name('sarpras.header.update');
Route::post('/sarpras', [SarprasController::class, 'store'])->name('sarpras.store');
Route::put('/sarpras/{sarpras}', [SarprasController::class, 'update'])->name('sarpras.update');
Route::delete('/sarpras/{sarpras}', [SarprasController::class, 'destroy'])->name('sarpras.destroy');
Route::patch('/sarpras/{sarpras}/toggle', [SarprasController::class, 'toggleStatus'])->name('sarpras.toggle');

Route::post('/sarpras/kategori', [SarprasController::class, 'storeKategori'])->name('sarpras.kategori.store');
Route::put('/sarpras/kategori/{kategori}', [SarprasController::class, 'updateKategori'])->name('sarpras.kategori.update');
Route::delete('/sarpras/kategori/{kategori}', [SarprasController::class, 'destroyKategori'])->name('sarpras.kategori.destroy');

// 2. SPMB (PPDB Online)
// 2.1 Pengaturan & Brosur SPMB (Controller Aktif)
Route::get('/spmb-halaman', [SpmbHalamanController::class, 'index'])->name('spmb-halaman.index');
Route::post('/spmb-halaman/hero', [SpmbHalamanController::class, 'updateHero'])->name('spmb-halaman.hero');
Route::put('/spmb-halaman/biaya', [SpmbHalamanController::class, 'updateBiaya'])->name('spmb-halaman.biaya');
Route::put('/spmb-halaman/alur', [SpmbHalamanController::class, 'updateAlur'])->name('spmb-halaman.alur');
Route::post('/spmb-halaman/banner', [SpmbHalamanController::class, 'updateBanner'])->name('spmb-halaman.banner');
Route::post('/spmb-halaman', [SpmbHalamanController::class, 'update'])->name('spmb-halaman.update');

// 2.2 Master Jadwal Gelombang (Controller Aktif)
Route::resource('/spmb-gelombang', SpmbGelombangController::class)->except(['create', 'show', 'edit']);
Route::patch('/spmb-gelombang/{spmbGelombang}/toggle', [SpmbGelombangController::class, 'toggleStatus'])->name('spmb-gelombang.toggle');

// 2.3 Data Pendaftar Siswa (Controller Aktif)
Route::get('/spmb-pendaftar', [SpmbPendaftarController::class, 'index'])->name('spmb-pendaftar');
Route::get('/spmb-pendaftar/export', [SpmbPendaftarController::class, 'exportExcel'])->name('spmb-pendaftar.export');
Route::patch('/spmb-pendaftar/{spmbPendaftar}/status', [SpmbPendaftarController::class, 'updateStatus'])->name('spmb-pendaftar.status');
Route::delete('/spmb-pendaftar/{spmbPendaftar}', [SpmbPendaftarController::class, 'destroy'])->name('spmb-pendaftar.destroy');
Route::get('/spmb-pendaftar/{spmbPendaftar}/pdf', [SpmbPendaftarController::class, 'downloadPdf'])->name('spmb-pendaftar.pdf');

// 3. Academic Hub (Program Keahlian, Berita, Kalender, Unduhan, Mapel Pilihan, Ekstrakurikuler, Kokurikuler & OSIS)
Route::get('/program-keahlian', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Program Keahlian',
    'category'    => 'Academic Hub',
    'description' => 'Kelola showcase kurikulum, kompetensi lulusan, dan keunggulan Teknik Sepeda Motor (TSM).',
]))->name('program-keahlian');

Route::get('/berita', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Berita & Pengumuman',
    'category'    => 'Academic Hub',
    'description' => 'Tulis, sunting, terbitkan warta sekolah, dan kelola liputan berita atau pengumuman.',
]))->name('berita');

Route::get('/kalender-akademik', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Kalender Akademik',
    'category'    => 'Academic Hub',
    'description' => 'Kelola jadwal kegiatan kalender akademik sekolah per semester dan agenda ujian.',
]))->name('kalender-akademik');

Route::get('/unduhan', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Pusat Unduhan',
    'category'    => 'Academic Hub',
    'description' => 'Unggah dan bagikan dokumen resmi sekolah (SK, modul pembelajaran, panduan, form perizinan).',
]))->name('unduhan');

Route::get('/mapel-pilihan', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'           => 'Mata Pelajaran Pilihan',
    'category'        => 'Academic Hub',
    'description'     => 'Kelola kurikulum mata pelajaran pilihan kesiswaan (AKL, Coding/Komputer) untuk siswa TSM.',
    'migrationStatus' => 'Belum ada tabel migrasi, nunggu konfirmasi bareng',
]))->name('mapel-pilihan');

Route::get('/ekstrakurikuler', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'           => 'Ekstrakurikuler',
    'category'        => 'Academic Hub',
    'description'     => 'Pengelolaan direktori kegiatan ekstrakurikuler sekolah seperti Pramuka, olahraga, seni, dan keterampilan.',
    'migrationStatus' => 'Belum ada tabel migrasi, nunggu konfirmasi bareng',
]))->name('ekstrakurikuler');

Route::get('/osis-kesiswaan', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'           => 'Kokurikuler & OSIS',
    'category'        => 'Academic Hub',
    'description'     => 'Wadah kegiatan organisasi kesiswaan (OSIS, MPK) dan agenda pembinaan karakter kokurikuler.',
    'migrationStatus' => 'Belum ada tabel migrasi, nunggu konfirmasi bareng',
]))->name('osis-kesiswaan');

// Alias rute lama agar kompatibel
Route::get('/kategori-berita', fn() => redirect()->route('berita'));
Route::get('/kategori-kegiatan', fn() => redirect()->route('kalender-akademik'));

// 6. TEFA & Karya Siswa
Route::get('/tefa-bengkel', [TefaBengkelController::class, 'index'])->name('tefa-bengkel');
Route::put('/tefa-bengkel', [TefaBengkelController::class, 'update'])->name('tefa-bengkel.update');
Route::put('/tefa-bengkel/header', [TefaBengkelController::class, 'updateHeader'])->name('tefa-bengkel.header.update');
Route::put('/tefa-bengkel/profil', [TefaBengkelController::class, 'updateProfil'])->name('tefa-bengkel.profil.update');
Route::put('/tefa-bengkel/layanan', [TefaBengkelController::class, 'updateLayanan'])->name('tefa-bengkel.layanan.update');

Route::get('/tefa-karya', [TefaKaryaController::class, 'index'])->name('tefa-karya');
Route::put('/tefa-karya/header', [TefaKaryaController::class, 'updateHeader'])->name('tefa-karya.header.update');
Route::post('/tefa-karya', [TefaKaryaController::class, 'store'])->name('tefa-karya.store');
Route::put('/tefa-karya/{karya}', [TefaKaryaController::class, 'update'])->name('tefa-karya.update');
Route::delete('/tefa-karya/{karya}', [TefaKaryaController::class, 'destroy'])->name('tefa-karya.destroy');
Route::patch('/tefa-karya/{karya}/toggle', [TefaKaryaController::class, 'toggleStatus'])->name('tefa-karya.toggle');

Route::post('/tefa-karya/kategori', [TefaKaryaController::class, 'storeKategori'])->name('tefa-karya.kategori.store');
Route::put('/tefa-karya/kategori/{kategori}', [TefaKaryaController::class, 'updateKategori'])->name('tefa-karya.kategori.update');
Route::delete('/tefa-karya/kategori/{kategori}', [TefaKaryaController::class, 'destroyKategori'])->name('tefa-karya.kategori.destroy');

Route::get('/kategori-karya', fn() => redirect()->route('admin.tefa-karya'));

// 7. Job Center & BKK
Route::get('/mitra-dudi', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Mitra Industri (DUDI)',
    'category'    => '7. Job Center & BKK',
    'description' => 'Kelola daftar kemitraan industri dunia usaha dan dunia kerja (DUDI).',
]))->name('mitra-dudi');

Route::get('/lowongan-kerja', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Papan Lowongan Kerja',
    'category'    => '7. Job Center & BKK',
    'description' => 'Kelola informasi lowongan kerja BKK terverifikasi untuk siswa tingkat akhir & alumni.',
]))->name('lowongan-kerja');

// 8. Tracer Study
Route::get('/kode-alumni', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Kode Alumni',
    'category'    => '8. Tracer Study',
    'description' => 'Generate dan kelola kode validasi unik (passkey) kuesioner alumni.',
]))->name('kode-alumni');

Route::get('/alumni-tracer', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Respon & Testimoni',
    'category'    => '8. Tracer Study',
    'description' => 'Tinjau respon kuesioner penelusuran lulusan dan kelola moderasi testimoni alumni.',
]))->name('alumni-tracer');

// 9. Pengaturan & Sistem
Route::get('/halaman-header', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Sentral Header Halaman',
    'category'    => '9. Pengaturan & Sistem',
    'description' => 'Kelola gambar banner dan teks judul header untuk 10 halaman portal publik.',
]))->name('halaman-header');

Route::get('/kontak-sekolah', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Kontak Sekolah & Medsos',
    'category'    => '9. Pengaturan & Sistem',
    'description' => 'Kelola alamat resmi, nomor telepon, WhatsApp, email, dan tautan media sosial sekolah.',
]))->name('kontak-sekolah');
