<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Beranda;
use App\Models\TentangSekolah;
use App\Models\SejarahSekolah;
use App\Models\StrukturOrganisasi;
use App\Models\Guru;
use App\Models\Sarpras;
use App\Models\ProgramKeahlian;
use App\Models\Berita;
use App\Models\KategoriBerita;
use App\Models\KalenderAkademik;
use App\Models\KategoriKegiatan;
use App\Models\UnduhanPublik;
use App\Models\HalamanHeader;
use App\Models\TefaBengkel;
use App\Models\TefaKarya;
use App\Models\KategoriKarya;
use App\Models\MitraDudi;
use App\Models\LowonganKerja;
use App\Models\KodeAlumni;
use App\Models\AlumniTracer;
use App\Models\SpmbHalaman;
use App\Models\SpmbGelombang;
use App\Models\SpmbPendaftar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Halaman Beranda Utama
     */
    public function index()
    {
        $beranda = Beranda::first();
        $jurusan = ProgramKeahlian::orderBy('urutan_tampil')->get();
        $beritaTerbaru = Berita::with('kategori')->orderBy('id', 'desc')->take(3)->get();
        $kalenderMendatang = KalenderAkademik::with('kategori')->orderBy('tanggal_kegiatan', 'asc')->take(3)->get();
        $karyaTerbaru = TefaKarya::with('kategoriKarya')
            ->where('status_publikasi', true)
            ->orderBy('urutan_tampil')
            ->orderBy('id', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Public/Beranda', [
            'beranda'           => $beranda,
            'jurusan'           => $jurusan,
            'berita_terbaru'    => $beritaTerbaru,
            'kalender_kegiatan' => $kalenderMendatang,
            'karya_terbaru'     => $karyaTerbaru,
        ]);
    }

    /**
     * Profil - Tentang Sekolah
     */
    public function tentang()
    {
        return Inertia::render('Public/Profil/Tentang', [
            'tentang' => TentangSekolah::first(),
            'header'  => HalamanHeader::where('kode_halaman', 'tentang')->first(),
        ]);
    }

    /**
     * Profil - Sejarah Sekolah
     */
    public function sejarah()
    {
        return Inertia::render('Public/Profil/Sejarah', [
            'sejarah' => SejarahSekolah::first(),
            'header'  => HalamanHeader::where('kode_halaman', 'sejarah')->first(),
        ]);
    }

    /**
     * Profil - Struktur Organisasi
     */
    public function struktur()
    {
        return Inertia::render('Public/Profil/Struktur', [
            'struktur' => StrukturOrganisasi::first(),
            'header'   => HalamanHeader::where('kode_halaman', 'struktur')->first(),
        ]);
    }

    /**
     * Profil - Guru & Tenaga Kependidikan
     */
    public function guru()
    {
        return Inertia::render('Public/Profil/Guru', [
            'gurus'  => Guru::orderBy('urutan_tampil')->get(),
            'header' => HalamanHeader::where('kode_halaman', 'guru')->first(),
        ]);
    }

    /**
     * Profil - Sarana & Prasarana
     */
    public function sarpras()
    {
        return Inertia::render('Public/Profil/Sarpras', [
            'sarpras' => Sarpras::all(),
            'header'  => HalamanHeader::where('kode_halaman', 'sarpras')->first(),
        ]);
    }

    /**
     * Program Keahlian (TBSM)
     */
    public function jurusan()
    {
        return Inertia::render('Public/Jurusan/Index', [
            'jurusan' => ProgramKeahlian::orderBy('urutan_tampil')->get(),
            'header'  => HalamanHeader::where('kode_halaman', 'jurusan')->first(),
        ]);
    }

    /**
     * Berita & Pengumuman
     */
    public function berita(Request $request)
    {
        $kategoriSlug = $request->query('kategori');
        $query = Berita::with('kategori')->orderBy('id', 'desc');

        if ($kategoriSlug) {
            $query->whereHas('kategori', fn($q) => $q->where('slug_kategori', $kategoriSlug));
        }

        return Inertia::render('Public/Berita/Index', [
            'beritas'   => $query->paginate(9),
            'kategoris' => KategoriBerita::all(),
            'header'    => HalamanHeader::where('kode_halaman', 'berita')->first(),
        ]);
    }

    /**
     * Kalender Akademik
     */
    public function kalender()
    {
        return Inertia::render('Public/Kalender/Index', [
            'kegiatans' => KalenderAkademik::with('kategori')->orderBy('tanggal_kegiatan', 'asc')->get(),
            'kategoris' => KategoriKegiatan::all(),
            'header'    => HalamanHeader::where('kode_halaman', 'kalender')->first(),
        ]);
    }

    /**
     * Pusat Unduhan
     */
    public function unduhan()
    {
        return Inertia::render('Public/Unduhan/Index', [
            'unduhans' => UnduhanPublik::orderBy('id', 'desc')->get(),
            'header'   => HalamanHeader::where('kode_halaman', 'unduhan')->first(),
        ]);
    }

    /**
     * Teaching Factory (TEFA)
     */
    public function tefa()
    {
        return Inertia::render('Public/Tefa/Index', [
            'bengkel' => TefaBengkel::first(),
            'header'  => HalamanHeader::where('kode_halaman', 'tefa')->first(),
        ]);
    }

    /**
     * Galeri Karya Siswa
     */
    public function karya()
    {
        return Inertia::render('Public/Karya/Index', [
            'karyas'    => TefaKarya::with('kategoriKarya')
                ->where('status_publikasi', true)
                ->orderBy('urutan_tampil')
                ->orderBy('id', 'desc')
                ->get(),
            'kategoris' => KategoriKarya::all(),
            'header'    => HalamanHeader::where('kode_halaman', 'karya')->first(),
        ]);
    }

    /**
     * Kemitraan Industri (DUDI)
     */
    public function mitra()
    {
        return Inertia::render('Public/Mitra/Index', [
            'mitras' => MitraDudi::all(),
            'header' => HalamanHeader::where('kode_halaman', 'bkk')->first(),
        ]);
    }

    /**
     * Bursa Kerja Khusus (BKK)
     */
    public function bkk()
    {
        return Inertia::render('Public/Bkk/Index', [
            'lowongans' => LowonganKerja::where('status_aktif', true)->orderBy('id', 'desc')->get(),
            'header'    => HalamanHeader::where('kode_halaman', 'bkk')->first(),
        ]);
    }

    /**
     * Tracer Study Alumni
     */
    public function tracer()
    {
        return Inertia::render('Public/Tracer/Index', [
            'header' => HalamanHeader::where('kode_halaman', 'tracer')->first(),
        ]);
    }

    /**
     * Simpan Tracer Study Alumni
     */
    public function tracerStore(Request $request)
    {
        $validated = $request->validate([
            'kode_validasi'          => 'required|string',
            'nama_alumni'            => 'required|string|max:255',
            'tahun_lulus'            => 'required|integer',
            'nomor_telepon_alumni'   => 'required|string',
            'status_alumni'          => 'required|in:bekerja,kuliah,wirausaha,mencari_kerja',
            'nama_tempat_bekerja'    => 'nullable|string',
            'posisi_jabatan'         => 'nullable|string',
            'pendapatan_bulanan'     => 'nullable|string',
            'relevansi_kompetensi'   => 'nullable|in:sangat_sesuai,sesuai,kurang_sesuai,tidak_sesuai',
            'testimoni_dan_saran'    => 'nullable|string',
        ]);

        // Cek kode validasi alumni
        $kodeValid = KodeAlumni::where('kode_validasi', $validated['kode_validasi'])->exists();
        if (!$kodeValid) {
            return back()->with('error', 'Kode Validasi Alumni tidak valid. Silakan hubungi sekolah jika belum memiliki kode.');
        }

        unset($validated['kode_validasi']);
        AlumniTracer::create($validated);

        return back()->with('success', 'Terima kasih! Data Tracer Study Anda telah berhasil disimpan.');
    }

    /**
     * Landing SPMB (PPDB)
     */
    public function spmb()
    {
        return Inertia::render('Public/Spmb/Index', [
            'spmb'       => SpmbHalaman::first(),
            'gelombangs' => SpmbGelombang::where('status_gelombang_buka', true)->get(),
            'jurusan'    => ProgramKeahlian::all(),
        ]);
    }
}
