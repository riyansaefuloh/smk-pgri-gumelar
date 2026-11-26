<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\ManagesPublicMedia;
use App\Http\Controllers\Controller;
use App\Models\Beranda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    use ManagesPublicMedia;

    /**
     * Tampilkan halaman pengelolaan Beranda Website (singleton).
     */
    public function index()
    {
        return Inertia::render('Admin/Beranda/Index', [
            'title'   => 'Beranda Website',
            'beranda' => Beranda::first(),
        ]);
    }

    /**
     * Perbarui Seksi 1: Hero Banner Utama.
     */
    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'judul_hero'    => ['required', 'string', 'max:200'],
            'subjudul_hero' => ['required', 'string', 'max:1000'],
            'gambar_hero'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_hero.required'    => 'Judul hero banner wajib diisi.',
            'judul_hero.max'         => 'Judul hero banner maksimal 200 karakter.',
            'subjudul_hero.required' => 'Subjudul hero banner wajib diisi.',
            'subjudul_hero.max'      => 'Subjudul hero banner maksimal 1.000 karakter.',
            'gambar_hero.image'      => 'File gambar hero harus berupa gambar.',
            'gambar_hero.mimes'      => 'Format gambar hero harus jpg, jpeg, png, atau webp.',
            'gambar_hero.max'        => 'Ukuran gambar hero maksimal 3 MB.',
        ]);

        $beranda = $this->firstOrNewBeranda();

        $gambarHero = $this->replacePublicPhoto(
            $request->file('gambar_hero'),
            'beranda/hero',
            $beranda->gambar_hero
        );

        $beranda->fill([
            'judul_hero'    => trim($validated['judul_hero']),
            'subjudul_hero' => trim($validated['subjudul_hero']),
            'gambar_hero'   => $gambarHero,
        ]);
        $beranda->save();

        return redirect()
            ->route('admin.beranda')
            ->with('success', 'Hero banner beranda berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 2: Sambutan Kepala Sekolah.
     */
    public function updateSambutan(Request $request)
    {
        $validated = $request->validate([
            'nama_kepala_sekolah' => ['required', 'string', 'max:200'],
            'teks_sambutan'       => ['required', 'string', 'max:5000'],
            'foto_kepala_sekolah' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'nama_kepala_sekolah.required' => 'Nama kepala sekolah wajib diisi.',
            'nama_kepala_sekolah.max'      => 'Nama kepala sekolah maksimal 200 karakter.',
            'teks_sambutan.required'       => 'Teks sambutan kepala sekolah wajib diisi.',
            'teks_sambutan.max'            => 'Teks sambutan maksimal 5.000 karakter.',
            'foto_kepala_sekolah.image'    => 'File foto kepala sekolah harus berupa gambar.',
            'foto_kepala_sekolah.mimes'    => 'Format foto kepala sekolah harus jpg, jpeg, png, atau webp.',
            'foto_kepala_sekolah.max'      => 'Ukuran foto kepala sekolah maksimal 3 MB.',
        ]);

        $beranda = $this->firstOrNewBeranda();

        $fotoKepsek = $this->replacePublicPhoto(
            $request->file('foto_kepala_sekolah'),
            'beranda/kepala-sekolah',
            $beranda->foto_kepala_sekolah
        );

        $beranda->fill([
            'nama_kepala_sekolah' => trim($validated['nama_kepala_sekolah']),
            'teks_sambutan'       => trim($validated['teks_sambutan']),
            'foto_kepala_sekolah' => $fotoKepsek,
        ]);
        $beranda->save();

        return redirect()
            ->route('admin.beranda')
            ->with('success', 'Sambutan kepala sekolah berhasil diperbarui.');
    }

    /**
     * Perbarui Seksi 3: Banner Ajakan Bawah.
     */
    public function updateBannerBawah(Request $request)
    {
        $validated = $request->validate([
            'judul_banner_bawah'    => ['required', 'string', 'max:200'],
            'subjudul_banner_bawah' => ['required', 'string', 'max:1000'],
            'gambar_banner_bawah'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
        ], [
            'judul_banner_bawah.required'    => 'Judul banner bawah wajib diisi.',
            'judul_banner_bawah.max'         => 'Judul banner bawah maksimal 200 karakter.',
            'subjudul_banner_bawah.required' => 'Subjudul banner bawah wajib diisi.',
            'subjudul_banner_bawah.max'      => 'Subjudul banner bawah maksimal 1.000 karakter.',
            'gambar_banner_bawah.image'      => 'File gambar banner bawah harus berupa gambar.',
            'gambar_banner_bawah.mimes'      => 'Format gambar banner bawah harus jpg, jpeg, png, atau webp.',
            'gambar_banner_bawah.max'        => 'Ukuran gambar banner bawah maksimal 3 MB.',
        ]);

        $beranda = $this->firstOrNewBeranda();

        $gambarBanner = $this->replacePublicPhoto(
            $request->file('gambar_banner_bawah'),
            'beranda/banner-bawah',
            $beranda->gambar_banner_bawah
        );

        $beranda->fill([
            'judul_banner_bawah'    => trim($validated['judul_banner_bawah']),
            'subjudul_banner_bawah' => trim($validated['subjudul_banner_bawah']),
            'gambar_banner_bawah'   => $gambarBanner,
        ]);
        $beranda->save();

        return redirect()
            ->route('admin.beranda')
            ->with('success', 'Banner bawah beranda berhasil diperbarui.');
    }

    /**
     * Ambil record beranda pertama atau siapkan nilai default aman untuk record baru.
     */
    private function firstOrNewBeranda(): Beranda
    {
        return Beranda::first() ?? new Beranda([
            'judul_hero'            => '',
            'subjudul_hero'         => '',
            'gambar_hero'           => '',
            'nama_kepala_sekolah'   => '',
            'foto_kepala_sekolah'   => '',
            'teks_sambutan'         => '',
            'judul_banner_bawah'    => '',
            'subjudul_banner_bawah' => '',
            'gambar_banner_bawah'   => '',
        ]);
    }
}
