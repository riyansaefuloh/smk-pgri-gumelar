<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Beranda;

/*
|--------------------------------------------------------------------------
| Admin CMS Routes (Prefix: /admin, Middleware: auth, verified)
|--------------------------------------------------------------------------
*/

// 1. Profil Sekolah
Route::get('/beranda', function () {
    return Inertia::render('Admin/Beranda', [
        'title'   => 'Beranda Website',
        'beranda' => Beranda::first(),
    ]);
})->name('beranda');

Route::get('/tentang-sekolah', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Tentang Sekolah',
    'category'    => '1. Profil Sekolah',
    'description' => 'Kelola profil sekolah, visi, misi, dan nilai keunggulan SMK PGRI Gumelar.',
]))->name('tentang-sekolah');

Route::get('/sejarah-sekolah', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Sejarah Sekolah',
    'category'    => '1. Profil Sekolah',
    'description' => 'Kelola linimasa sejarah berdirinya dan perkembangan SMK PGRI Gumelar.',
]))->name('sejarah-sekolah');

Route::get('/struktur-organisasi', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Struktur Organisasi',
    'category'    => '1. Profil Sekolah',
    'description' => 'Kelola bagan struktur organisasi kepemimpinan dan manajemen sekolah.',
]))->name('struktur-organisasi');

Route::get('/guru', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Direktori Guru & Staf',
    'category'    => '1. Profil Sekolah',
    'description' => 'Kelola data dewan guru, tenaga kependidikan (GTK), dan staf TU sekolah.',
]))->name('guru');

Route::get('/sarpras', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Sarana & Prasarana',
    'category'    => '1. Profil Sekolah',
    'description' => 'Kelola inventaris fasilitas ruang kelas, bengkel otomotif, lab, dan sarpras pendukung.',
]))->name('sarpras');

// 2. SPMB (PPDB Online)
Route::get('/spmb-halaman', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Pengaturan & Brosur SPMB',
    'category'    => '2. SPMB (PPDB Online)',
    'description' => 'Kelola informasi jalur masuk, syarat pendaftaran, dan unduhan brosur PPDB.',
]))->name('spmb-halaman');

Route::get('/spmb-gelombang', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Jadwal Gelombang',
    'category'    => '2. SPMB (PPDB Online)',
    'description' => 'Kelola jadwal gelombang pendaftaran, kuota penerimaan, dan status aktif.',
]))->name('spmb-gelombang');

Route::get('/spmb-pendaftar', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Data Pendaftar Siswa',
    'category'    => '2. SPMB (PPDB Online)',
    'description' => 'Kelola verifikasi data calon siswa baru yang mendaftar secara online.',
]))->name('spmb-pendaftar');

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
Route::get('/tefa-bengkel', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Profil Bengkel TEFA',
    'category'    => '6. TEFA & Karya Siswa',
    'description' => 'Kelola profil bengkel motor Teaching Factory, layanan servis, dan jam operasional.',
]))->name('tefa-bengkel');

Route::get('/tefa-karya', fn() => Inertia::render('Admin/ModuleScaffold', [
    'title'       => 'Karya & Inovasi',
    'category'    => '6. TEFA & Karya Siswa',
    'description' => 'Kelola etalase karya inovatif siswa, deskripsi produk inovasi, dan dokumentasi.',
]))->name('tefa-karya');

Route::get('/kategori-karya', fn() => redirect()->route('tefa-karya'));

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
